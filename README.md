# Smart Pasal - Shop Management System

A complete, production-ready cross-platform mobile application for small shops in Nepal.

## 🎯 Overview

Smart Pasal is a comprehensive shop management solution designed specifically for small businesses in Nepal (grocery, hardware, stationery, medical stores). The app features offline-first architecture, digital khata (udhar), billing, inventory management, and much more.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Node.js + Express (TypeScript)
- **Database**: 
  - Offline: SQLite (mobile)
  - Cloud Sync: Firebase Firestore
- **Authentication**: Firebase Phone OTP
- **Payments**: eSewa & Khalti integration
- **State Management**: Zustand
- **UI**: Optimized for low-end devices

## 📁 Project Structure

```
Pasal/
├── backend/          # Node.js + Express API server
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── models/   # Data models
│   │   ├── routes/   # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Express middleware
│   │   ├── services/    # External services
│   │   └── utils/       # Helper functions
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/           # React Native + Expo app
│   ├── src/
│   │   ├── screens/  # App screens
│   │   ├── components/ # Reusable components
│   │   ├── navigation/ # Navigation setup
│   │   ├── store/    # State management
│   │   ├── services/ # API & sync services
│   │   ├── database/ # SQLite setup
│   │   ├── utils/    # Helper functions
│   │   └── types/    # TypeScript types
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
└── docs/             # Documentation
    ├── API.md
    ├── SETUP.md
    └── ARCHITECTURE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Firebase account
- Android Studio / Xcode (for mobile development)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your Firebase credentials in .env
npm run dev
```

The API server will start at `http://localhost:3000`

### Mobile App Setup

```bash
cd mobile
npm install
cp .env.example .env
# Configure your API endpoint in .env
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## ✨ Features

### Core Features
- ✅ Phone OTP Authentication (Firebase)
- ✅ Shop Profile Management
- ✅ Product Management with Categories
- ✅ Barcode Scanning
- ✅ Fast Billing (<20 seconds)
- ✅ Multiple Payment Modes (Cash, Udhar, eSewa, Khalti)
- ✅ Digital Khata (Udhar Management)
- ✅ Customer Management
- ✅ Supplier Management
- ✅ Stock Management with Alerts
- ✅ Reports & Analytics
- ✅ PDF Invoice Generation
- ✅ WhatsApp Sharing
- ✅ Offline-First Architecture
- ✅ Auto Sync
- ✅ Backup & Restore
- ✅ Multi-language (English & Nepali)
- ✅ Push Notifications
- ✅ PIN/Biometric Lock

### Security Features
- Role-based access control (Admin, Staff)
- Secure local storage encryption
- Firebase authentication
- PIN/Biometric app lock

### Offline Capabilities
- Full app functionality without internet
- Auto-sync when connection restored
- Conflict resolution for concurrent edits
- Local SQLite database

## 📱 Screens

1. **Authentication**: Login with phone OTP
2. **Dashboard**: Sales overview, quick actions
3. **Products**: Add, edit, list products with barcode
4. **Billing**: Fast checkout with multiple payment options
5. **Udhar (Khata)**: Customer credit management
6. **Customers**: Customer list and purchase history
7. **Suppliers**: Supplier management and dues
8. **Stock**: Inventory tracking and alerts
9. **Reports**: Sales, profit/loss, analytics
10. **Settings**: Shop profile, backup, language

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Phone Authentication
3. Create a Firestore database
4. Download service account key for backend
5. Get web config for mobile app

### Payment Integration
- **eSewa**: Configure merchant credentials
- **Khalti**: Configure public/secret keys
- Mock integration available for testing

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [Architecture Details](docs/ARCHITECTURE.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile app tests
cd mobile
npm test
```

## 🚢 Deployment

### Backend Deployment
- Deploy to services like Heroku, DigitalOcean, AWS
- Ensure environment variables are configured
- Enable HTTPS

### Mobile App Deployment
```bash
cd mobile
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🤝 Contributing

This is a production application designed for small shops in Nepal. Contributions are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🌟 Future Enhancements

- Multi-store support
- Advanced analytics with charts
- Email invoice sending
- SMS notifications
- Loyalty program
- Expense tracking
- Employee attendance
- Credit card payment integration
- Web dashboard for shop owners

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for small businesses in Nepal
