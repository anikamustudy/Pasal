import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { Supplier } from '../types';

export const createSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { name, phoneNumber, address, email } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }

    const supplierData: Partial<Supplier> = {
      shopId,
      name,
      phoneNumber: phoneNumber || '',
      address: address || '',
      email: email || '',
      totalPurchases: 0,
      totalDue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const supplierRef = await db.collection('suppliers').add(supplierData);

    res.status(201).json({
      success: true,
      data: { id: supplierRef.id, ...supplierData },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSuppliers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    const suppliersSnapshot = await db
      .collection('suppliers')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const suppliers = suppliersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, data: suppliers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSupplierById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { supplierId } = req.params;

    const supplierDoc = await db.collection('suppliers').doc(supplierId).get();

    if (!supplierDoc.exists || supplierDoc.data()?.isDeleted) {
      res.status(404).json({ success: false, error: 'Supplier not found' });
      return;
    }

    res.json({ success: true, data: { id: supplierDoc.id, ...supplierDoc.data() } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { supplierId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.shopId;
    delete updateData.createdAt;

    await db.collection('suppliers').doc(supplierId).update(updateData);

    res.json({ success: true, data: { id: supplierId, ...updateData } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSupplier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { supplierId } = req.params;

    await db.collection('suppliers').doc(supplierId).update({
      isDeleted: true,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
