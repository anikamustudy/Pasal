# Smart Pasal - Architecture Documentation

## System Overview

Smart Pasal is a full-stack mobile application designed for small shop management in Nepal. The architecture follows a modern, scalable approach with offline-first capabilities.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native + Expo)     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  UI Layer (Screens & Components)                  │  │
│  └───────────────────┬──────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  State Management (Zustand)                       │  │
│  └───────────────────┬──────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Services Layer (API, Sync, Auth)                 │  │
│  └─────────┬──────────────────┬─────────────────────┘  │
│  ┌──────────────────┐  ┌───────────────────────────┐  │
│  │ SQLite Database   │  │ Firebase Authentication   │  │
│  │ (Offline Storage) │  │                           │  │
│  └──────────────────┘  └───────────────────────────┘  │
└─────────────┬──────────────────┬──────────────────────┘
              │                  │
              │ HTTP/REST        │ Firebase Auth
              │                  │
┌─────────────▼──────────────────▼──────────────────────┐
│           Backend API (Node.js + Express)              │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Controllers (Business Logic)                     │ │
│  └───────────────────┬──────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Middleware (Auth, Error Handling)                │ │
│  └───────────────────┬──────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Services (Firebase Admin, Data Processing)       │ │
│  └───────────────────┬──────────────────────────────┘ │
└─────────────────────┬────────────────────────────────┘
                      │
                      │ Firebase Admin SDK
                      │
┌─────────────────────▼────────────────────────────────┐
│              Firebase Services                        │
│  ┌────────────────────┐  ┌────────────────────────┐ │
│  │ Firestore Database │  │ Authentication Service  │ │
│  │ (Cloud Storage)    │  │ (Phone OTP)            │ │
│  └────────────────────┘  └────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper, Expo Vector Icons
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand
- **Local Database**: Expo SQLite
- **Authentication**: Firebase Authentication (Phone OTP)
- **Offline Storage**: AsyncStorage, SecureStore

### Backend (API Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: Firebase Admin SDK
- **Database**: Firebase Firestore
- **Middleware**: CORS, Helmet, Compression, Morgan

### Infrastructure
- **Cloud Platform**: Firebase (Google Cloud)
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Phone Auth
- **Storage**: Firebase Storage (for images)
- **Hosting**: Can be deployed on Heroku, DigitalOcean, AWS, etc.

## Data Flow

### 1. Authentication Flow
```
User → Enter Phone Number → Firebase Auth → Send OTP
User → Enter OTP → Verify → Get ID Token
Mobile App → Store Token → Include in API Requests
Backend → Verify Token → Allow/Deny Access
```

### 2. Offline-First Data Flow
```
User Action → Update SQLite (Local)
           → Queue Sync Request
           → When Online → Sync to Firestore
           → Confirm Success → Update Local Sync Status
```

### 3. Data Synchronization
```
Mobile App:
1. Detect online/offline status
2. Store all changes locally in SQLite
3. When online, send changes to backend
4. Backend validates and stores in Firestore
5. Pull changes from Firestore based on timestamp
6. Merge with local data (conflict resolution)
7. Update local sync timestamp
```

## Key Design Decisions

### 1. Offline-First Architecture
**Decision**: All data operations happen locally first, then sync to cloud

**Rationale**:
- Internet connectivity is unreliable in many areas of Nepal
- Users should be able to use the app without internet
- Better user experience with instant responses

**Implementation**:
- SQLite for local storage
- Background sync when online
- Timestamp-based conflict resolution

### 2. Separate Backend API
**Decision**: Use a dedicated Node.js backend instead of direct Firebase access

**Rationale**:
- Better security (API keys not exposed in mobile app)
- Complex business logic on server
- Easier to add features and integrate services
- Better control over data validation

### 3. Firebase for Authentication
**Decision**: Use Firebase Phone Authentication

**Rationale**:
- Phone-based auth is common in Nepal
- Reliable OTP delivery
- Built-in security features
- Easy integration

### 4. TypeScript Everywhere
**Decision**: Use TypeScript for both frontend and backend

**Rationale**:
- Type safety prevents bugs
- Better IDE support
- Easier refactoring
- Self-documenting code

### 5. Zustand for State Management
**Decision**: Use Zustand instead of Redux

**Rationale**:
- Simpler API and less boilerplate
- Good TypeScript support
- Sufficient for app complexity
- Easier to learn and maintain

## Database Schema Design

### Firestore Collections

#### shops
```typescript
{
  id: string (auto-generated)
  ownerId: string (user uid)
  name: string
  ownerName: string
  phoneNumber: string
  address: string
  pan?: string
  vat?: string
  currency: string (default: "NPR")
  createdAt: Timestamp
  updatedAt: Timestamp
  syncedAt?: Timestamp
}
```

#### products
```typescript
{
  id: string (auto-generated)
  shopId: string (reference)
  name: string
  category: string
  barcode?: string
  costPrice: number
  sellingPrice: number
  stockQuantity: number
  unit: 'pcs' | 'kg' | 'liter' | 'gram' | 'meter'
  lowStockThreshold: number
  description?: string
  imageUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  syncedAt?: Timestamp
  isDeleted: boolean
}
```

#### sales
```typescript
{
  id: string (auto-generated)
  shopId: string (reference)
  customerId?: string (reference)
  saleNumber: string (unique)
  items: SaleItem[]
  subtotal: number
  discount: number
  discountType: 'amount' | 'percentage'
  total: number
  paymentMode: 'cash' | 'udhar' | 'esewa' | 'khalti'
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  amountPaid: number
  amountDue: number
  notes?: string
  createdBy: string (user uid)
  createdAt: Timestamp
  updatedAt: Timestamp
  syncedAt?: Timestamp
}
```

### SQLite Schema
- Mirrors Firestore structure
- Additional fields for sync status
- Timestamps stored as ISO strings

## Security Considerations

### 1. Authentication & Authorization
- All API endpoints require valid Firebase ID token
- Token verified on every request
- Role-based access control (Admin/Staff)

### 2. Data Security
- Sensitive data encrypted in SecureStore
- API keys not stored in source code
- HTTPS for all API communication

### 3. Input Validation
- Server-side validation for all inputs
- SQL injection prevention (parameterized queries)
- XSS protection with proper escaping

## Scalability

### Current Scale
- Designed for single shop with 1-10 users
- Handles 100-1000 products
- Supports 50-100 sales per day

### Future Scaling Options
1. **Multi-shop Support**: Add shop isolation in queries
2. **Sharding**: Partition data by shop or region
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Use CDN for static assets and images
5. **Load Balancing**: Multiple backend instances

## Performance Optimizations

### Mobile App
- Lazy loading for screens
- Image optimization and caching
- Pagination for large lists
- Debounced search
- Local-first data access

### Backend
- Database indexing on frequently queried fields
- Compression middleware
- Efficient query patterns
- Connection pooling

## Monitoring & Logging

### Mobile App
- Error logging to console
- Analytics for user behavior
- Crash reporting (can add Sentry)

### Backend
- Morgan for HTTP request logging
- Console logging for errors
- Can integrate with cloud logging services

## Future Enhancements

1. **Push Notifications**: Low stock alerts, payment reminders
2. **Analytics Dashboard**: Advanced charts and insights
3. **Multi-language**: Full Nepali language support
4. **Barcode Generation**: Generate barcodes for products
5. **Email/SMS**: Send invoices via email/SMS
6. **Expense Tracking**: Track shop expenses
7. **Employee Management**: Track staff performance
8. **Web Dashboard**: Admin panel for shop owners

---

This architecture provides a solid foundation for a production-ready shop management system while maintaining flexibility for future enhancements.
