import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { UdharTransaction } from '../types';

export const createUdharTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { customerId, type, amount, description, paymentMode } = req.body;

    if (!customerId || !type || !amount) {
      res.status(400).json({ success: false, error: 'CustomerId, type, and amount are required' });
      return;
    }

    const userId = req.user?.uid || 'system';

    // Get current customer balance
    const customerDoc = await db.collection('customers').doc(customerId).get();
    if (!customerDoc.exists) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    const currentDue = customerDoc.data()?.totalDue || 0;
    const parsedAmount = parseFloat(amount);
    
    // Calculate new balance based on transaction type
    const newBalance = type === 'credit' 
      ? currentDue + parsedAmount 
      : currentDue - parsedAmount;

    if (newBalance < 0) {
      res.status(400).json({ success: false, error: 'Payment amount exceeds current due' });
      return;
    }

    const batch = db.batch();

    // Create udhar transaction
    const udharRef = db.collection('udharTransactions').doc();
    const udharData: Partial<UdharTransaction> = {
      shopId,
      customerId,
      type,
      amount: parsedAmount,
      balance: newBalance,
      description: description || '',
      paymentMode: paymentMode || '',
      createdBy: userId,
      createdAt: new Date(),
    };
    batch.set(udharRef, udharData);

    // Update customer balance
    batch.update(db.collection('customers').doc(customerId), {
      totalDue: newBalance,
      updatedAt: new Date(),
    });

    await batch.commit();

    res.status(201).json({
      success: true,
      data: { id: udharRef.id, ...udharData },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUdharTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { customerId } = req.query;

    let query = db.collection('udharTransactions').where('shopId', '==', shopId);

    if (customerId) {
      query = query.where('customerId', '==', customerId);
    }

    const transactionsSnapshot = await query.orderBy('createdAt', 'desc').get();
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomerUdharSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    const customerDoc = await db.collection('customers').doc(customerId).get();
    if (!customerDoc.exists) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    const customerData = customerDoc.data();
    
    const transactionsSnapshot = await db
      .collection('udharTransactions')
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: {
        customer: { id: customerDoc.id, ...customerData },
        totalDue: customerData?.totalDue || 0,
        transactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
