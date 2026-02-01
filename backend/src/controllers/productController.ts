import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { Product } from '../types';

/**
 * Create a new product
 */
export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;
    const {
      name,
      category,
      barcode,
      costPrice,
      sellingPrice,
      stockQuantity,
      unit,
      lowStockThreshold,
      description,
      imageUrl,
    } = req.body;

    if (!name || !category || costPrice === undefined || sellingPrice === undefined) {
      res.status(400).json({
        success: false,
        error: 'Name, category, cost price, and selling price are required',
      });
      return;
    }

    const productData: Partial<Product> = {
      shopId,
      name,
      category,
      barcode: barcode || '',
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      stockQuantity: parseInt(stockQuantity) || 0,
      unit: unit || 'pcs',
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      description: description || '',
      imageUrl: imageUrl || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };

    const productRef = await db.collection('products').add(productData);

    res.status(201).json({
      success: true,
      data: { id: productRef.id, ...productData },
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create product',
    });
  }
};

/**
 * Get all products for a shop
 */
export const getProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { category, searchTerm } = req.query;

    let query = db.collection('products')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false);

    if (category) {
      query = query.where('category', '==', category);
    }

    const productsSnapshot = await query.get();
    let products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side filtering for search term (Firestore doesn't support full-text search)
    if (searchTerm) {
      const term = (searchTerm as string).toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(term) ||
        (p.barcode && p.barcode.includes(term))
      );
    }

    res.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch products',
    });
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const productDoc = await db.collection('products').doc(productId).get();

    if (!productDoc.exists || productDoc.data()?.isDeleted) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { id: productDoc.id, ...productDoc.data() },
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product',
    });
  }
};

/**
 * Update a product
 */
export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.shopId;
    delete updateData.createdAt;

    await db.collection('products').doc(productId).update(updateData);

    res.json({
      success: true,
      data: { id: productId, ...updateData },
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update product',
    });
  }
};

/**
 * Delete a product (soft delete)
 */
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    await db.collection('products').doc(productId).update({
      isDeleted: true,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete product',
    });
  }
};

/**
 * Get low stock products
 */
export const getLowStockProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shopId } = req.params;

    const productsSnapshot = await db
      .collection('products')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const lowStockProducts = productsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((p: any) => p.stockQuantity <= p.lowStockThreshold);

    res.json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error: any) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch low stock products',
    });
  }
};
