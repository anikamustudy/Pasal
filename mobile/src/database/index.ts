import * as SQLite from 'expo-sqlite';
import { Product, Sale, Customer, Supplier, UdharTransaction, StockTransaction } from '../types';

// Open database
const db = SQLite.openDatabase('smartpasal.db');

/**
 * Initialize database tables
 */
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Products table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          barcode TEXT,
          costPrice REAL NOT NULL,
          sellingPrice REAL NOT NULL,
          stockQuantity INTEGER DEFAULT 0,
          unit TEXT DEFAULT 'pcs',
          lowStockThreshold INTEGER DEFAULT 5,
          description TEXT,
          imageUrl TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncedAt TEXT,
          isDeleted INTEGER DEFAULT 0
        )`,
        [],
        () => console.log('Products table created'),
        (_, error) => { console.error('Error creating products table:', error); return false; }
      );

      // Sales table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sales (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          customerId TEXT,
          saleNumber TEXT NOT NULL,
          items TEXT NOT NULL,
          subtotal REAL NOT NULL,
          discount REAL DEFAULT 0,
          discountType TEXT DEFAULT 'amount',
          total REAL NOT NULL,
          paymentMode TEXT NOT NULL,
          paymentStatus TEXT NOT NULL,
          amountPaid REAL DEFAULT 0,
          amountDue REAL DEFAULT 0,
          notes TEXT,
          createdBy TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncedAt TEXT
        )`,
        []
      );

      // Customers table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          name TEXT NOT NULL,
          phoneNumber TEXT,
          address TEXT,
          totalPurchases REAL DEFAULT 0,
          totalDue REAL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncedAt TEXT,
          isDeleted INTEGER DEFAULT 0
        )`,
        []
      );

      // Suppliers table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS suppliers (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          name TEXT NOT NULL,
          phoneNumber TEXT,
          address TEXT,
          email TEXT,
          totalPurchases REAL DEFAULT 0,
          totalDue REAL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncedAt TEXT,
          isDeleted INTEGER DEFAULT 0
        )`,
        []
      );

      // Udhar transactions table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS udhar_transactions (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          customerId TEXT NOT NULL,
          saleId TEXT,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          balance REAL NOT NULL,
          description TEXT,
          paymentMode TEXT,
          createdBy TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          syncedAt TEXT
        )`,
        []
      );

      // Stock transactions table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS stock_transactions (
          id TEXT PRIMARY KEY,
          shopId TEXT NOT NULL,
          productId TEXT NOT NULL,
          type TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          previousStock INTEGER NOT NULL,
          newStock INTEGER NOT NULL,
          reason TEXT NOT NULL,
          reference TEXT,
          createdBy TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          syncedAt TEXT
        )`,
        []
      );

      // App settings table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )`,
        [],
        () => {
          console.log('Database initialized successfully');
          resolve();
        },
        (_, error) => {
          console.error('Error initializing database:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

/**
 * Generic function to execute SQL queries
 */
export const executeSql = (
  sql: string,
  params: any[] = []
): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

/**
 * Clear all data (for logout or reset)
 */
export const clearAllData = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const tables = [
        'products',
        'sales',
        'customers',
        'suppliers',
        'udhar_transactions',
        'stock_transactions',
      ];

      tables.forEach(table => {
        tx.executeSql(`DELETE FROM ${table}`, []);
      });

      tx.executeSql(
        `DELETE FROM app_settings WHERE key != 'pin_code'`,
        [],
        () => {
          console.log('All data cleared');
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export default db;
