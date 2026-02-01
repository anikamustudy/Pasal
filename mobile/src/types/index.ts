// TypeScript type definitions for Smart Pasal Mobile App

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
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
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
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
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
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
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
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
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
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
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
  createdAt: string;
  syncedAt?: string;
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
  createdAt: string;
  syncedAt?: string;
}

export interface User {
  uid: string;
  phoneNumber: string;
  role: 'admin' | 'staff';
  shopId?: string;
  displayName?: string;
  isActive: boolean;
}

export interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  lowStockCount: number;
  totalUdhar: number;
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

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  shop: Shop | null;
  isPinSet: boolean;
  lastSyncTimestamp: string | null;
}
