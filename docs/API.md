# Smart Pasal API Documentation

Base URL: `http://localhost:3000/api`

All endpoints (except health check) require authentication via Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Health Check

### GET /health
Check API server status
- **Auth Required**: No
- **Response**: Server status and timestamp

## Shop Management

### POST /shops
Create or update shop profile
- **Body**: `{ name, ownerName, phoneNumber, address, pan?, vat? }`
- **Response**: Shop object with ID

### GET /shops
Get current user's shop
- **Response**: Shop object

### GET /shops/:shopId
Get shop by ID
- **Response**: Shop object

## Products

### POST /shops/:shopId/products
Create a new product
- **Body**: `{ name, category, barcode?, costPrice, sellingPrice, stockQuantity?, unit?, lowStockThreshold?, description?, imageUrl? }`
- **Response**: Product object with ID

### GET /shops/:shopId/products
Get all products for a shop
- **Query Params**: `category?, searchTerm?`
- **Response**: Array of products

### GET /products/:productId
Get product by ID
- **Response**: Product object

### PUT /products/:productId
Update a product
- **Body**: Any product fields to update
- **Response**: Updated product object

### DELETE /products/:productId
Delete a product (soft delete)
- **Response**: Success message

### GET /shops/:shopId/products/low-stock
Get low stock products
- **Response**: Array of products with low stock

## Sales

### POST /shops/:shopId/sales
Create a new sale
- **Body**: `{ customerId?, items[], subtotal, discount?, discountType?, total, paymentMode, amountPaid?, notes? }`
- **Item Format**: `{ productId, productName, quantity, unit, price, total }`
- **Response**: Sale object with ID
- **Note**: Automatically updates stock and creates udhar transaction if applicable

### GET /shops/:shopId/sales
Get all sales for a shop
- **Query Params**: `startDate?, endDate?, customerId?, paymentMode?`
- **Response**: Array of sales

### GET /sales/:saleId
Get sale by ID
- **Response**: Sale object

### PATCH /sales/:saleId/payment
Update sale payment
- **Body**: `{ amountPaid }`
- **Response**: Updated payment status

## Customers

### POST /shops/:shopId/customers
Create a customer
- **Body**: `{ name, phoneNumber?, address? }`
- **Response**: Customer object with ID

### GET /shops/:shopId/customers
Get all customers
- **Response**: Array of customers

### GET /customers/:customerId
Get customer by ID
- **Response**: Customer object

### PUT /customers/:customerId
Update customer
- **Body**: Customer fields to update
- **Response**: Updated customer object

### DELETE /customers/:customerId
Delete customer (soft delete)
- **Response**: Success message

## Suppliers

### POST /shops/:shopId/suppliers
Create a supplier
- **Body**: `{ name, phoneNumber?, address?, email? }`
- **Response**: Supplier object with ID

### GET /shops/:shopId/suppliers
Get all suppliers
- **Response**: Array of suppliers

### GET /suppliers/:supplierId
Get supplier by ID
- **Response**: Supplier object

### PUT /suppliers/:supplierId
Update supplier
- **Body**: Supplier fields to update
- **Response**: Updated supplier object

### DELETE /suppliers/:supplierId
Delete supplier (soft delete)
- **Response**: Success message

## Udhar (Credit) Management

### POST /shops/:shopId/udhar
Create udhar transaction
- **Body**: `{ customerId, type: 'credit'|'payment', amount, description?, paymentMode? }`
- **Response**: Transaction object with ID
- **Note**: Automatically updates customer balance

### GET /shops/:shopId/udhar
Get udhar transactions
- **Query Params**: `customerId?`
- **Response**: Array of transactions

### GET /udhar/customer/:customerId
Get customer udhar summary
- **Response**: `{ customer, totalDue, transactions[] }`

## Stock Management

### POST /shops/:shopId/stock
Add stock transaction
- **Body**: `{ productId, type: 'in'|'out'|'adjustment', quantity, reason }`
- **Response**: Transaction object with ID
- **Note**: Automatically updates product stock

### GET /shops/:shopId/stock
Get stock transactions
- **Query Params**: `productId?`
- **Response**: Array of transactions (latest 100)

### GET /stock/product/:productId
Get product stock history
- **Response**: Array of stock transactions

## Reports & Analytics

### GET /shops/:shopId/reports/sales
Get sales report
- **Query Params**: `startDate (required), endDate (required)`
- **Response**: Sales report with totals, payment modes, top products

### GET /shops/:shopId/reports/profit-loss
Get profit & loss report
- **Query Params**: `startDate (required), endDate (required)`
- **Response**: Revenue, cost, profit, and margin

### GET /shops/:shopId/reports/stock
Get stock report
- **Response**: Total products, stock value, low stock and out of stock items

### GET /shops/:shopId/reports/udhar
Get udhar report
- **Response**: Total outstanding, overdue amount, top debtors

### GET /shops/:shopId/reports/dashboard
Get dashboard statistics
- **Response**: Today's sales, revenue, low stock count, total udhar

## Data Synchronization

### POST /shops/:shopId/sync/upload
Sync data from mobile to cloud
- **Body**: `{ products?, sales?, customers?, suppliers?, udharTransactions?, stockTransactions? }`
- **Response**: Success with sync timestamp

### GET /shops/:shopId/sync/download
Get data from cloud to sync to mobile
- **Query Params**: `lastSyncTimestamp?`
- **Response**: All data modified since last sync

### GET /shops/:shopId/sync/timestamp
Get last sync timestamp
- **Response**: Last update timestamp across all collections

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Data Models

### Product
```typescript
{
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
  isDeleted: boolean;
}
```

### Sale
```typescript
{
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
}
```

### Customer
```typescript
{
  id: string;
  shopId: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  totalPurchases: number;
  totalDue: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
```

## Notes

1. **Offline-First**: Mobile app should cache all data locally in SQLite and sync periodically
2. **Conflict Resolution**: Last-write-wins strategy (based on updatedAt timestamp)
3. **Soft Deletes**: Most entities use soft delete (isDeleted flag) to preserve data integrity
4. **Timestamps**: All dates are stored as Firebase Timestamps and returned as ISO strings
5. **Currency**: All amounts are in NPR (Nepalese Rupees)
