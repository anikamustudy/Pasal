import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';

export const addStockTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { productId, type, quantity, reason } = req.body;

    if (!productId || !type || !quantity) {
      res.status(400).json({ success: false, error: 'ProductId, type, and quantity are required' });
      return;
    }

    const userId = req.user?.uid || 'system';
    const parsedQuantity = parseInt(quantity);

    // Get current product stock
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const currentStock = productDoc.data()?.stockQuantity || 0;
    let newStock = currentStock;

    if (type === 'in') {
      newStock = currentStock + parsedQuantity;
    } else if (type === 'out') {
      newStock = currentStock - parsedQuantity;
      if (newStock < 0) {
        res.status(400).json({ success: false, error: 'Insufficient stock' });
        return;
      }
    } else if (type === 'adjustment') {
      newStock = parsedQuantity; // Direct adjustment to the quantity
    }

    const batch = db.batch();

    // Update product stock
    batch.update(db.collection('products').doc(productId), {
      stockQuantity: newStock,
      updatedAt: new Date(),
    });

    // Create stock transaction record
    const stockTxRef = db.collection('stockTransactions').doc();
    const stockTxData = {
      shopId,
      productId,
      type,
      quantity: parsedQuantity,
      previousStock: currentStock,
      newStock,
      reason: reason || '',
      createdBy: userId,
      createdAt: new Date(),
    };
    batch.set(stockTxRef, stockTxData);

    await batch.commit();

    res.status(201).json({
      success: true,
      data: { id: stockTxRef.id, ...stockTxData },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStockTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { productId } = req.query;

    let query = db.collection('stockTransactions').where('shopId', '==', shopId);

    if (productId) {
      query = query.where('productId', '==', productId);
    }

    const transactionsSnapshot = await query.orderBy('createdAt', 'desc').limit(100).get();
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductStockHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const transactionsSnapshot = await db
      .collection('stockTransactions')
      .where('productId', '==', productId)
      .orderBy('createdAt', 'desc')
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
