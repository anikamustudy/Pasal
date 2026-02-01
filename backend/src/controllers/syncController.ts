import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { SyncData } from '../types';

/**
 * Sync data from mobile to cloud
 * Accepts data from mobile and stores it in Firestore
 */
export const syncToCloud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const syncData: Partial<SyncData> = req.body;

    const batch = db.batch();
    const timestamp = new Date();

    // Sync products
    if (syncData.products) {
      for (const product of syncData.products) {
        const productRef = db.collection('products').doc(product.id);
        batch.set(productRef, { ...product, syncedAt: timestamp }, { merge: true });
      }
    }

    // Sync sales
    if (syncData.sales) {
      for (const sale of syncData.sales) {
        const saleRef = db.collection('sales').doc(sale.id);
        batch.set(saleRef, { ...sale, syncedAt: timestamp }, { merge: true });
      }
    }

    // Sync customers
    if (syncData.customers) {
      for (const customer of syncData.customers) {
        const customerRef = db.collection('customers').doc(customer.id);
        batch.set(customerRef, { ...customer, syncedAt: timestamp }, { merge: true });
      }
    }

    // Sync suppliers
    if (syncData.suppliers) {
      for (const supplier of syncData.suppliers) {
        const supplierRef = db.collection('suppliers').doc(supplier.id);
        batch.set(supplierRef, { ...supplier, syncedAt: timestamp }, { merge: true });
      }
    }

    // Sync udhar transactions
    if (syncData.udharTransactions) {
      for (const transaction of syncData.udharTransactions) {
        const txRef = db.collection('udharTransactions').doc(transaction.id);
        batch.set(txRef, { ...transaction, syncedAt: timestamp }, { merge: true });
      }
    }

    // Sync stock transactions
    if (syncData.stockTransactions) {
      for (const transaction of syncData.stockTransactions) {
        const txRef = db.collection('stockTransactions').doc(transaction.id);
        batch.set(txRef, { ...transaction, syncedAt: timestamp }, { merge: true });
      }
    }

    await batch.commit();

    res.json({
      success: true,
      message: 'Data synced successfully',
      syncedAt: timestamp,
    });
  } catch (error: any) {
    console.error('Error syncing to cloud:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to sync data',
    });
  }
};

/**
 * Get data from cloud to sync to mobile
 * Returns all data modified since last sync
 */
export const syncFromCloud = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { lastSyncTimestamp } = req.query;

    const lastSync = lastSyncTimestamp 
      ? new Date(lastSyncTimestamp as string)
      : new Date(0); // If no last sync, get all data

    const syncData: Partial<SyncData> = {
      lastSyncTimestamp: new Date(),
    };

    // Get products
    const productsSnapshot = await db
      .collection('products')
      .where('shopId', '==', shopId)
      .where('updatedAt', '>', lastSync)
      .get();
    syncData.products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Get sales
    const salesSnapshot = await db
      .collection('sales')
      .where('shopId', '==', shopId)
      .where('updatedAt', '>', lastSync)
      .get();
    syncData.sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Get customers
    const customersSnapshot = await db
      .collection('customers')
      .where('shopId', '==', shopId)
      .where('updatedAt', '>', lastSync)
      .get();
    syncData.customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Get suppliers
    const suppliersSnapshot = await db
      .collection('suppliers')
      .where('shopId', '==', shopId)
      .where('updatedAt', '>', lastSync)
      .get();
    syncData.suppliers = suppliersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Get udhar transactions
    const udharSnapshot = await db
      .collection('udharTransactions')
      .where('shopId', '==', shopId)
      .where('createdAt', '>', lastSync)
      .get();
    syncData.udharTransactions = udharSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Get stock transactions
    const stockSnapshot = await db
      .collection('stockTransactions')
      .where('shopId', '==', shopId)
      .where('createdAt', '>', lastSync)
      .get();
    syncData.stockTransactions = stockSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    res.json({
      success: true,
      data: syncData,
    });
  } catch (error: any) {
    console.error('Error syncing from cloud:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sync data',
    });
  }
};

/**
 * Get last sync timestamp for a shop
 */
export const getLastSyncTimestamp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    // Get the most recent update timestamp from any collection
    const collections = ['products', 'sales', 'customers', 'suppliers', 'udharTransactions', 'stockTransactions'];
    let latestTimestamp = new Date(0);

    for (const collectionName of collections) {
      const snapshot = await db
        .collection(collectionName)
        .where('shopId', '==', shopId)
        .orderBy('updatedAt', 'desc')
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const timestamp = snapshot.docs[0].data().updatedAt?.toDate();
        if (timestamp && timestamp > latestTimestamp) {
          latestTimestamp = timestamp;
        }
      }
    }

    res.json({
      success: true,
      data: { lastSyncTimestamp: latestTimestamp },
    });
  } catch (error: any) {
    console.error('Error getting last sync timestamp:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get last sync timestamp',
    });
  }
};
