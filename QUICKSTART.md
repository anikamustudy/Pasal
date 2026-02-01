# Quick Start Guide - Smart Pasal

Get Smart Pasal running on your local machine in 15 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- npm or yarn package manager
- A Firebase account (free tier is fine)
- A code editor (VS Code recommended)

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/anikamustudy/Pasal.git
cd Pasal

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

## Step 2: Firebase Setup (5 minutes)

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: "smart-pasal-dev"
4. Disable Google Analytics (optional for dev)
5. Click "Create Project"

### Enable Phone Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Enable "Phone" provider
5. Click "Save"

### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Enable"

### Get Service Account Key (for Backend)
1. Go to **Project Settings** (gear icon)
2. Go to "Service Accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Save it somewhere safe (DON'T commit to Git!)

### Get Web App Config (for Mobile)
1. In **Project Settings**, scroll to "Your apps"
2. Click the web icon `</>`
3. Register app with nickname: "smart-pasal-mobile"
4. Copy the config object that looks like:
```javascript
{
  apiKey: "AIza...",
  authDomain: "smart-pasal-dev.firebaseapp.com",
  projectId: "smart-pasal-dev",
  storageBucket: "smart-pasal-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

## Step 3: Configure Backend (3 minutes)

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```bash
PORT=3000
NODE_ENV=development

# From the service account JSON file you downloaded:
FIREBASE_PROJECT_ID=smart-pasal-dev
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@smart-pasal-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# For local development
ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001
```

**Important**: Replace the private key from your downloaded JSON file. Keep the quotes and `\n` characters.

## Step 4: Configure Mobile App (2 minutes)

```bash
cd mobile
cp .env.example .env
```

Edit `.env` with your Firebase web config:
```bash
# Your backend API (use localhost for iOS simulator, 10.0.2.2 for Android emulator)
API_BASE_URL=http://localhost:3000/api

# From Firebase web app config:
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=smart-pasal-dev.firebaseapp.com
FIREBASE_PROJECT_ID=smart-pasal-dev
FIREBASE_STORAGE_BUCKET=smart-pasal-dev.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Start Backend (1 minute)

```bash
cd backend
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🏪 Smart Pasal API Server                  ║
║                                                   ║
║        Environment: development                   ║
║        Port: 3000                                 ║
║                                                   ║
║        Status: ✅ Running                         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

Test it: Open http://localhost:3000/health in your browser

## Step 6: Start Mobile App (2 minutes)

Open a new terminal:

```bash
cd mobile
npm start
```

This will:
1. Start Expo dev server
2. Show a QR code
3. Provide options to open in emulator/simulator

### Choose Your Platform:

**For Physical Device:**
- Install "Expo Go" app from App Store (iOS) or Play Store (Android)
- Scan the QR code with your camera

**For Android Emulator:**
- Press `a` in the terminal
- Android Studio must be installed with an emulator configured

**For iOS Simulator (Mac only):**
- Press `i` in the terminal
- Xcode must be installed

## Step 7: Use the App! 🎉

1. **Login Screen** will appear
2. Enter any phone number (e.g., +977 9812345678)
3. Click "Send OTP"
4. Enter any 6-digit code (e.g., 123456) - Demo mode accepts any code
5. You're in! Explore the app

### Available Features:
- ✅ Dashboard with stats
- ✅ Product management (placeholder)
- ✅ Billing (placeholder)
- ✅ Udhar/Khata (placeholder)
- ✅ Reports (placeholder)
- ✅ Settings (functional)

## Troubleshooting

### Backend Issues

**"Firebase credentials error"**
```bash
# Check your .env file
# Make sure FIREBASE_PRIVATE_KEY has proper \n for newlines
# Ensure it's wrapped in quotes
```

**"Port already in use"**
```bash
# Change PORT in .env to 3001 or kill the process
kill -9 $(lsof -ti:3000)
```

**"Module not found"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Mobile Issues

**"Unable to resolve module"**
```bash
cd mobile
rm -rf node_modules
npm install
expo start -c  # -c clears cache
```

**"Network request failed"**
```bash
# For Android emulator, use:
API_BASE_URL=http://10.0.2.2:3000/api

# For iOS simulator, use:
API_BASE_URL=http://localhost:3000/api

# For physical device, use your computer's IP:
API_BASE_URL=http://192.168.1.X:3000/api
# (Find your IP with `ipconfig` on Windows or `ifconfig` on Mac/Linux)
```

**"Expo Go not loading"**
```bash
# Make sure phone and computer are on same WiFi
# Try restarting Expo dev server
expo start -c
```

### Firebase Issues

**"Phone authentication not working"**
- Demo mode is enabled, any OTP works
- For production, you need to configure reCAPTCHA

**"Firestore permission denied"**
- Make sure you started in "test mode"
- Test mode rules allow all access for 30 days

## Next Steps

Now that you're running:

1. **Explore the Code**
   - Backend: `backend/src/controllers/` - Business logic
   - Mobile: `mobile/src/screens/` - UI screens
   - API docs: `docs/API.md`

2. **Make Changes**
   - Backend auto-reloads on save
   - Mobile hot-reloads on save
   - Try modifying the Dashboard screen!

3. **Test API Endpoints**
   ```bash
   # Get health status
   curl http://localhost:3000/health
   
   # After login, test authenticated endpoints
   # (You'll need to get the Firebase ID token)
   ```

4. **Read Documentation**
   - `docs/API.md` - All API endpoints
   - `docs/ARCHITECTURE.md` - System design
   - `docs/SETUP.md` - Detailed setup guide

## Development Tips

### Hot Reload
- Backend: Saves automatically restart server (via ts-node-dev)
- Mobile: Saves automatically reload app (via Expo)

### Debugging
- Backend: Use `console.log()` - shows in terminal
- Mobile: Shake device → "Debug Remote JS" → Chrome DevTools

### Code Quality
```bash
# Format code (if you add prettier)
npm run format

# Check types
cd backend && npm run build
cd mobile && tsc --noEmit
```

### View Database
- **Firestore**: Firebase Console → Firestore Database
- **SQLite**: Mobile app's local database (use Expo file system)

## Common Tasks

### Create New API Endpoint
1. Add controller in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Test with curl or Postman

### Create New Screen
1. Add screen file in `mobile/src/screens/`
2. Add route in `mobile/src/navigation/AppNavigator.tsx`
3. Save and test in app

### Add New Package
```bash
# Backend
cd backend
npm install package-name
npm install -D @types/package-name  # if TypeScript types exist

# Mobile
cd mobile
npm install package-name
```

## Help & Resources

- **Documentation**: Check `docs/` folder
- **Issues**: Review error messages carefully
- **Firebase Docs**: https://firebase.google.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org/docs

## What's Working vs. What's Placeholder

### ✅ Fully Working
- Backend API (all 45+ endpoints)
- Authentication flow (demo mode)
- Dashboard with stats
- Settings screen
- Navigation
- Database structure

### 🚧 UI Placeholders (API works, UI pending)
- Product CRUD screens
- Billing workflow
- Udhar management screens
- Reports screens

### ❌ Not Yet Implemented
- Barcode scanner
- PDF invoice generation
- WhatsApp sharing
- Push notifications
- Full offline sync
- Biometric auth

---

**You're all set!** Start building and exploring Smart Pasal! 🚀

For more details, see:
- **Full Setup Guide**: `docs/SETUP.md`
- **API Reference**: `docs/API.md`
- **Architecture**: `docs/ARCHITECTURE.md`

Happy coding! 💻
