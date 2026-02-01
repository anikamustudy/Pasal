import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { SalesReport, ProfitLossReport, StockReport, UdharReport } from '../types';

export const getSalesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ success: false, error: 'Start date and end date are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const salesSnapshot = await db
      .collection('sales')
      .where('shopId', '==', shopId)
      .where('createdAt', '>=', start)
      .where('createdAt', '<=', end)
      .get();

    const sales = salesSnapshot.docs.map(doc => doc.data());

    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const totalDiscount = sales.reduce((sum: number, sale: any) => sum + (sale.discount || 0), 0);

    const paymentModes = {
      cash: sales.filter((s: any) => s.paymentMode === 'cash').reduce((sum: number, s: any) => sum + s.total, 0),
      udhar: sales.filter((s: any) => s.paymentMode === 'udhar').reduce((sum: number, s: any) => sum + s.total, 0),
      esewa: sales.filter((s: any) => s.paymentMode === 'esewa').reduce((sum: number, s: any) => sum + s.total, 0),
      khalti: sales.filter((s: any) => s.paymentMode === 'khalti').reduce((sum: number, s: any) => sum + s.total, 0),
    };

    // Calculate top products
    const productMap = new Map();
    sales.forEach((sale: any) => {
      sale.items?.forEach((item: any) => {
        const existing = productMap.get(item.productId) || {
          productId: item.productId,
          productName: item.productName,
          quantitySold: 0,
          revenue: 0,
        };
        existing.quantitySold += item.quantity;
        existing.revenue += item.total;
        productMap.set(item.productId, existing);
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    const report: SalesReport = {
      totalSales,
      totalAmount,
      totalDiscount,
      paymentModes,
      topProducts,
    };

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfitLossReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ success: false, error: 'Start date and end date are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const salesSnapshot = await db
      .collection('sales')
      .where('shopId', '==', shopId)
      .where('createdAt', '>=', start)
      .where('createdAt', '<=', end)
      .get();

    let totalRevenue = 0;
    let totalCost = 0;

    // Get product costs for calculation
    const productIds = new Set<string>();
    salesSnapshot.docs.forEach(doc => {
      const sale = doc.data();
      sale.items?.forEach((item: any) => productIds.add(item.productId));
    });

    const productCosts = new Map();
    for (const productId of productIds) {
      const productDoc = await db.collection('products').doc(productId).get();
      if (productDoc.exists) {
        productCosts.set(productId, productDoc.data()?.costPrice || 0);
      }
    }

    // Calculate revenue and cost
    salesSnapshot.docs.forEach(doc => {
      const sale = doc.data();
      totalRevenue += sale.total || 0;
      
      sale.items?.forEach((item: any) => {
        const costPrice = productCosts.get(item.productId) || 0;
        totalCost += costPrice * item.quantity;
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const report: ProfitLossReport = {
      totalRevenue,
      totalCost,
      grossProfit,
      profitMargin,
      period: {
        startDate: start,
        endDate: end,
      },
    };

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStockReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    const productsSnapshot = await db
      .collection('products')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum: number, p: any) => 
      sum + (p.stockQuantity * p.costPrice), 0
    );

    const lowStockProducts = products
      .filter((p: any) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0)
      .map((p: any) => ({
        productId: p.id,
        productName: p.name,
        currentStock: p.stockQuantity,
        threshold: p.lowStockThreshold,
      }));

    const outOfStockProducts = products
      .filter((p: any) => p.stockQuantity === 0)
      .map((p: any) => ({
        productId: p.id,
        productName: p.name,
      }));

    const report: StockReport = {
      totalProducts,
      totalStockValue,
      lowStockProducts,
      outOfStockProducts,
    };

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUdharReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    const customersSnapshot = await db
      .collection('customers')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .where('totalDue', '>', 0)
      .get();

    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalCustomers = customers.length;
    const totalOutstanding = customers.reduce((sum: number, c: any) => sum + (c.totalDue || 0), 0);

    // For simplicity, consider overdue as those with any outstanding (can be enhanced with date logic)
    const overdueAmount = totalOutstanding;

    const topDebtors = customers
      .sort((a: any, b: any) => b.totalDue - a.totalDue)
      .slice(0, 10)
      .map((c: any) => ({
        customerId: c.id,
        customerName: c.name,
        outstanding: c.totalDue,
      }));

    const report: UdharReport = {
      totalCustomers,
      totalOutstanding,
      overdueAmount,
      topDebtors,
    };

    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;

    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySalesSnapshot = await db
      .collection('sales')
      .where('shopId', '==', shopId)
      .where('createdAt', '>=', today)
      .where('createdAt', '<', tomorrow)
      .get();

    const todaySales = todaySalesSnapshot.docs.length;
    const todayRevenue = todaySalesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);

    // Get low stock count
    const productsSnapshot = await db
      .collection('products')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const lowStockCount = productsSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.stockQuantity <= data.lowStockThreshold;
    }).length;

    // Get total udhar
    const customersSnapshot = await db
      .collection('customers')
      .where('shopId', '==', shopId)
      .where('isDeleted', '==', false)
      .get();

    const totalUdhar = customersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalDue || 0), 0);

    res.json({
      success: true,
      data: {
        todaySales,
        todayRevenue,
        lowStockCount,
        totalUdhar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
