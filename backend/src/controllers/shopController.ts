import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { Shop, User } from '../types';

/**
 * Create or update shop profile
 */
export const createOrUpdateShop = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { name, ownerName, phoneNumber, address, pan, vat } = req.body;

    if (!name || !ownerName || !phoneNumber) {
      res.status(400).json({
        success: false,
        error: 'Name, owner name, and phone number are required',
      });
      return;
    }

    const shopData: Partial<Shop> = {
      ownerId: userId,
      name,
      ownerName,
      phoneNumber,
      address: address || '',
      pan: pan || '',
      vat: vat || '',
      currency: 'NPR',
      updatedAt: new Date(),
    };

    // Check if shop exists for this user
    const shopsSnapshot = await db
      .collection('shops')
      .where('ownerId', '==', userId)
      .limit(1)
      .get();

    let shopId: string;

    if (shopsSnapshot.empty) {
      // Create new shop
      shopData.createdAt = new Date();
      const shopRef = await db.collection('shops').add(shopData);
      shopId = shopRef.id;

      // Update user document with shopId
      await db.collection('users').doc(userId).set({
        uid: userId,
        phoneNumber: req.user?.phoneNumber,
        role: 'admin',
        shopId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing shop
      shopId = shopsSnapshot.docs[0].id;
      await db.collection('shops').doc(shopId).update(shopData);
    }

    res.json({
      success: true,
      data: { shopId, ...shopData },
    });
  } catch (error: any) {
    console.error('Error creating/updating shop:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create/update shop',
    });
  }
};

/**
 * Get shop profile
 */
export const getShop = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const shopsSnapshot = await db
      .collection('shops')
      .where('ownerId', '==', userId)
      .limit(1)
      .get();

    if (shopsSnapshot.empty) {
      res.status(404).json({
        success: false,
        error: 'Shop not found',
      });
      return;
    }

    const shopDoc = shopsSnapshot.docs[0];
    const shopData = { id: shopDoc.id, ...shopDoc.data() };

    res.json({
      success: true,
      data: shopData,
    });
  } catch (error: any) {
    console.error('Error fetching shop:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch shop',
    });
  }
};

/**
 * Get shop by ID (for staff members)
 */
export const getShopById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;

    const shopDoc = await db.collection('shops').doc(shopId).get();

    if (!shopDoc.exists) {
      res.status(404).json({
        success: false,
        error: 'Shop not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { id: shopDoc.id, ...shopDoc.data() },
    });
  } catch (error: any) {
    console.error('Error fetching shop:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch shop',
    });
  }
};
