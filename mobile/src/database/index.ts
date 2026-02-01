import SQLite from 'react-native-sqlite-storage';
import { Product, Sale, Customer, Supplier, UdharTransaction, StockTransaction } from '../types';

// Enable promise API
SQLite.enablePromise(true);

// Open database
let db: SQLite.SQLiteDatabase;

/**
 * Open or create the database
 */
const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabase({
    name: 'smartpasal.db',
    location: 'default',
  });
  return db;
};

/**
 * Initialize database tables
 */
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await openDatabase();
    
    await database.transaction(async (tx) => {
      // Products table
      await tx.executeSql(
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
        )`
      );
      console.log('Products table created');

      // Sales table
      await tx.executeSql(
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
        )`
      );

      // Customers table
      await tx.executeSql(
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
        )`
      );

      // Suppliers table
      await tx.executeSql(
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
        )`
      );

      // Udhar transactions table
      await tx.executeSql(
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
        )`
      );

      // Stock transactions table
      await tx.executeSql(
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
        )`
      );

      // App settings table
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )`
      );
      
      console.log('Database initialized successfully');
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Generic function to execute SQL queries
 */
export const executeSql = async (
  sql: string,
  params: any[] = []
): Promise<any> => {
  try {
    const database = await openDatabase();
    const [result] = await database.executeSql(sql, params);
    return result;
  } catch (error) {
    console.error('SQL execution error:', error);
    throw error;
  }
};

/**
 * Clear all data (for logout or reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const database = await openDatabase();
    
    await database.transaction(async (tx) => {
      const tables = [
        'products',
        'sales',
        'customers',
        'suppliers',
        'udhar_transactions',
        'stock_transactions',
      ];

      for (const table of tables) {
        await tx.executeSql(`DELETE FROM ${table}`);
      }

      await tx.executeSql(`DELETE FROM app_settings WHERE key != 'pin_code'`);
      console.log('All data cleared');
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export { openDatabase };
export default { openDatabase, initDatabase, executeSql, clearAllData };
