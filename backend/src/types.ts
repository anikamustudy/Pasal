// TypeScript type definitions for the Smart Pasal backend

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  ownerName: string;
  phoneNumber: string;
  address: string;
  pan?: string;
  vat?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  category: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  unit: 'pcs' | 'kg' | 'liter' | 'gram' | 'meter';
  lowStockThreshold: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  isDeleted: boolean;
}

export interface Sale {
  id: string;
  shopId: string;
  customerId?: string;
  saleNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  discountType: 'amount' | 'percentage';
  total: number;
  paymentMode: 'cash' | 'udhar' | 'esewa' | 'khalti';
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  amountPaid: number;
  amountDue: number;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  totalPurchases: number;
  totalDue: number;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  isDeleted: boolean;
}

export interface Supplier {
  id: string;
  shopId: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  totalPurchases: number;
  totalDue: number;
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  isDeleted: boolean;
}

export interface UdharTransaction {
  id: string;
  shopId: string;
  customerId: string;
  saleId?: string;
  type: 'credit' | 'payment';
  amount: number;
  balance: number;
  description?: string;
  paymentMode?: string;
  createdBy: string;
  createdAt: Date;
  syncedAt?: Date;
}

export interface StockTransaction {
  id: string;
  shopId: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  createdBy: string;
  createdAt: Date;
  syncedAt?: Date;
}

export interface User {
  uid: string;
  phoneNumber: string;
  role: 'admin' | 'staff';
  shopId?: string;
  displayName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncData {
  lastSyncTimestamp: Date;
  products?: Product[];
  sales?: Sale[];
  customers?: Customer[];
  suppliers?: Supplier[];
  udharTransactions?: UdharTransaction[];
  stockTransactions?: StockTransaction[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ReportQuery {
  shopId: string;
  startDate: Date;
  endDate: Date;
  type: 'sales' | 'profit' | 'stock' | 'udhar' | 'supplier';
}

export interface SalesReport {
  totalSales: number;
  totalAmount: number;
  totalDiscount: number;
  paymentModes: {
    cash: number;
    udhar: number;
    esewa: number;
    khalti: number;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
}

export interface ProfitLossReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface StockReport {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
  }>;
  outOfStockProducts: Array<{
    productId: string;
    productName: string;
  }>;
}

export interface UdharReport {
  totalCustomers: number;
  totalOutstanding: number;
  overdueAmount: number;
  topDebtors: Array<{
    customerId: string;
    customerName: string;
    outstanding: number;
  }>;
}
