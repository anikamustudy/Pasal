import axios, { AxiosInstance } from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration (should be loaded from environment variables)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// API client
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async config => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          console.log('Unauthorized - need to re-authenticate');
        }
        return Promise.reject(error);
      }
    );
  }

  // Shop APIs
  async createOrUpdateShop(shopData: any) {
    const response = await this.client.post('/shops', shopData);
    return response.data;
  }

  async getShop() {
    const response = await this.client.get('/shops');
    return response.data;
  }

  async getShopById(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}`);
    return response.data;
  }

  // Product APIs
  async createProduct(shopId: string, productData: any) {
    const response = await this.client.post(`/shops/${shopId}/products`, productData);
    return response.data;
  }

  async getProducts(shopId: string, params?: any) {
    const response = await this.client.get(`/shops/${shopId}/products`, { params });
    return response.data;
  }

  async updateProduct(productId: string, productData: any) {
    const response = await this.client.put(`/products/${productId}`, productData);
    return response.data;
  }

  async deleteProduct(productId: string) {
    const response = await this.client.delete(`/products/${productId}`);
    return response.data;
  }

  async getLowStockProducts(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/products/low-stock`);
    return response.data;
  }

  // Sale APIs
  async createSale(shopId: string, saleData: any) {
    const response = await this.client.post(`/shops/${shopId}/sales`, saleData);
    return response.data;
  }

  async getSales(shopId: string, params?: any) {
    const response = await this.client.get(`/shops/${shopId}/sales`, { params });
    return response.data;
  }

  async getSaleById(saleId: string) {
    const response = await this.client.get(`/sales/${saleId}`);
    return response.data;
  }

  // Customer APIs
  async createCustomer(shopId: string, customerData: any) {
    const response = await this.client.post(`/shops/${shopId}/customers`, customerData);
    return response.data;
  }

  async getCustomers(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/customers`);
    return response.data;
  }

  async updateCustomer(customerId: string, customerData: any) {
    const response = await this.client.put(`/customers/${customerId}`, customerData);
    return response.data;
  }

  // Supplier APIs
  async createSupplier(shopId: string, supplierData: any) {
    const response = await this.client.post(`/shops/${shopId}/suppliers`, supplierData);
    return response.data;
  }

  async getSuppliers(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/suppliers`);
    return response.data;
  }

  // Udhar APIs
  async createUdharTransaction(shopId: string, transactionData: any) {
    const response = await this.client.post(`/shops/${shopId}/udhar`, transactionData);
    return response.data;
  }

  async getUdharTransactions(shopId: string, customerId?: string) {
    const response = await this.client.get(`/shops/${shopId}/udhar`, {
      params: { customerId },
    });
    return response.data;
  }

  async getCustomerUdharSummary(customerId: string) {
    const response = await this.client.get(`/udhar/customer/${customerId}`);
    return response.data;
  }

  // Stock APIs
  async addStockTransaction(shopId: string, transactionData: any) {
    const response = await this.client.post(`/shops/${shopId}/stock`, transactionData);
    return response.data;
  }

  async getStockTransactions(shopId: string, productId?: string) {
    const response = await this.client.get(`/shops/${shopId}/stock`, {
      params: { productId },
    });
    return response.data;
  }

  // Report APIs
  async getSalesReport(shopId: string, startDate: string, endDate: string) {
    const response = await this.client.get(`/shops/${shopId}/reports/sales`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async getProfitLossReport(shopId: string, startDate: string, endDate: string) {
    const response = await this.client.get(`/shops/${shopId}/reports/profit-loss`, {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async getStockReport(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/reports/stock`);
    return response.data;
  }

  async getUdharReport(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/reports/udhar`);
    return response.data;
  }

  async getDashboardStats(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/reports/dashboard`);
    return response.data;
  }

  // Sync APIs
  async syncToCloud(shopId: string, syncData: any) {
    const response = await this.client.post(`/shops/${shopId}/sync/upload`, syncData);
    return response.data;
  }

  async syncFromCloud(shopId: string, lastSyncTimestamp?: string) {
    const response = await this.client.get(`/shops/${shopId}/sync/download`, {
      params: { lastSyncTimestamp },
    });
    return response.data;
  }

  async getLastSyncTimestamp(shopId: string) {
    const response = await this.client.get(`/shops/${shopId}/sync/timestamp`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
