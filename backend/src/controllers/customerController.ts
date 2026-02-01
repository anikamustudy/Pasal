import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { Customer } from '../types';

export const createCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { name, phoneNumber, address } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }

    const customerData: Partial<Customer> = {
      shopId,
      name,
      phoneNumber: phoneNumber || '',
      address: address || '',
      totalPurchases: 0,
      totalDue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const customerRef = await db.collection('customers').add(customerData);

    res.status(201).json({
      success: true,
      data: { id: customerRef.id, ...customerData },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    const customersSnapshot = await db
      .collection('customers')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: customers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    const customerDoc = await db.collection('customers').doc(customerId).get();

    if (!customerDoc.exists || customerDoc.data()?.isDeleted) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }

    res.json({ success: true, data: { id: customerDoc.id, ...customerDoc.data() } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.shopId;
    delete updateData.createdAt;

    await db.collection('customers').doc(customerId).update(updateData);

    res.json({ success: true, data: { id: customerId, ...updateData } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    await db.collection('customers').doc(customerId).update({
      isDeleted: true,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
