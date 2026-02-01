import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { Sale, SaleItem } from '../types';

/**
 * Create a new sale
 */
export const createSale = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;
    const {
      customerId,
      items,
      subtotal,
      discount,
      discountType,
      total,
      paymentMode,
      amountPaid,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Sale must have at least one item',
      });
      return;
    }

    const userId = req.user?.uid || 'system';
    const amountDue = total - (amountPaid || 0);
    const paymentStatus = amountDue === 0 ? 'paid' : amountDue < total ? 'partial' : 'unpaid';

    // Generate sale number
    const timestamp = Date.now();
    const saleNumber = `SALE-${timestamp}`;

    const saleData: Partial<Sale> = {
      shopId,
      customerId: customerId || undefined,
      saleNumber,
      items,
      subtotal: parseFloat(subtotal),
      discount: parseFloat(discount) || 0,
      discountType: discountType || 'amount',
      total: parseFloat(total),
      paymentMode,
      paymentStatus,
      amountPaid: parseFloat(amountPaid) || 0,
      amountDue,
      notes: notes || '',
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Start a batch operation for atomic updates
    const batch = db.batch();

    // Add sale
    const saleRef = db.collection('sales').doc();
    batch.set(saleRef, saleData);

    // Update stock for each item
    for (const item of items as SaleItem[]) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const currentStock = productDoc.data()?.stockQuantity || 0;
        const newStock = currentStock - item.quantity;
        
        batch.update(productRef, {
          stockQuantity: newStock,
          updatedAt: new Date(),
        });

        // Add stock transaction
        const stockTxRef = db.collection('stockTransactions').doc();
        batch.set(stockTxRef, {
          shopId,
          productId: item.productId,
          type: 'out',
          quantity: item.quantity,
          previousStock: currentStock,
          newStock,
          reason: 'Sale',
          reference: saleRef.id,
          createdBy: userId,
          createdAt: new Date(),
        });
      }
    }

    // If payment mode is udhar and there's due amount, create udhar transaction
    if (paymentMode === 'udhar' && amountDue > 0 && customerId) {
      // Get current customer balance
      const customerDoc = await db.collection('customers').doc(customerId).get();
      const currentDue = customerDoc.exists ? (customerDoc.data()?.totalDue || 0) : 0;
      const newBalance = currentDue + amountDue;

      // Update customer due
      if (customerDoc.exists) {
        batch.update(db.collection('customers').doc(customerId), {
          totalDue: newBalance,
          updatedAt: new Date(),
        });
      }

      // Create udhar transaction
      const udharRef = db.collection('udharTransactions').doc();
      batch.set(udharRef, {
        shopId,
        customerId,
        saleId: saleRef.id,
        type: 'credit',
        amount: amountDue,
        balance: newBalance,
        description: `Sale ${saleNumber}`,
        createdBy: userId,
        createdAt: new Date(),
      });
    }

    // Commit batch
    await batch.commit();

    res.status(201).json({
      success: true,
      data: { id: saleRef.id, ...saleData },
    });
  } catch (error: any) {
    console.error('Error creating sale:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create sale',
    });
  }
};

/**
 * Get all sales for a shop
 */
export const getSales = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate, customerId, paymentMode } = req.query;

    let query = db.collection('sales').where('shopId', '==', shopId);

    if (customerId) {
      query = query.where('customerId', '==', customerId);
    }

    if (paymentMode) {
      query = query.where('paymentMode', '==', paymentMode);
    }

    const salesSnapshot = await query.orderBy('createdAt', 'desc').get();
    let sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by date range if provided
    if (startDate || endDate) {
      sales = sales.filter((sale: any) => {
        const saleDate = sale.createdAt.toDate();
        if (startDate && saleDate < new Date(startDate as string)) return false;
        if (endDate && saleDate > new Date(endDate as string)) return false;
        return true;
      });
    }

    res.json({
      success: true,
      data: sales,
    });
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sales',
    });
  }
};

/**
 * Get sale by ID
 */
export const getSaleById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { saleId } = req.params;

    const saleDoc = await db.collection('sales').doc(saleId).get();

    if (!saleDoc.exists) {
      res.status(404).json({
        success: false,
        error: 'Sale not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { id: saleDoc.id, ...saleDoc.data() },
    });
  } catch (error: any) {
    console.error('Error fetching sale:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sale',
    });
  }
};

/**
 * Update sale payment
 */
export const updateSalePayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { saleId } = req.params;
    const { amountPaid } = req.body;

    const saleDoc = await db.collection('sales').doc(saleId).get();
    if (!saleDoc.exists) {
      res.status(404).json({
        success: false,
        error: 'Sale not found',
      });
      return;
    }

    const saleData = saleDoc.data() as Sale;
    const newAmountPaid = (saleData.amountPaid || 0) + parseFloat(amountPaid);
    const newAmountDue = saleData.total - newAmountPaid;
    const newPaymentStatus = newAmountDue === 0 ? 'paid' : newAmountDue < saleData.total ? 'partial' : 'unpaid';

    await db.collection('sales').doc(saleId).update({
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      paymentStatus: newPaymentStatus,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        id: saleId,
        amountPaid: newAmountPaid,
        amountDue: newAmountDue,
        paymentStatus: newPaymentStatus,
      },
    });
  } catch (error: any) {
    console.error('Error updating sale payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update sale payment',
    });
  }
};
