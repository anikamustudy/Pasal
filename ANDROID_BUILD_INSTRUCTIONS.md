# Android Build Instructions for Smart Pasal

This guide explains how to build and run the Smart Pasal mobile app on Android Studio Emulator.

## ✅ What Has Been Fixed

The following issues have been resolved to make the app runnable on Android emulator:

1. **Environment Configuration**
   - Created `mobile/.env` with Android emulator API URL (`http://10.0.2.2:3000/api`)
   - Created `backend/.env` for demo mode operation

2. **Backend Setup**
   - Fixed Firebase initialization to work without credentials (demo mode)
   - Added null checks in sync controllers for demo mode
   - Backend now starts successfully without Firebase configuration

3. **Mobile App Setup**
   - Fixed empty `index.js` entry point
   - Created placeholder app icons (icon, adaptive-icon, splash, favicon)
   - Generated Android native code using Expo prebuild
   - Installed all required dependencies

4. **Known Issues and Workarounds**
   - **expo-sqlite plugin**: Removed from `app.json` plugins due to ESM import issue with Node 20
     - The module is still installed and will work via React Native auto-linking
     - SQLite functionality will work normally in the built app

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js 18 or 20** (tested with v20.20.0)
2. **npm** (tested with v10.8.2)
3. **Android Studio** with:
   - Android SDK (API level 33 or 34 recommended)
   - Android Emulator
   - At least one AVD (Android Virtual Device) configured
4. **Java JDK** (usually bundled with Android Studio)

## 🚀 Quick Start

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm install  # If not already done
npm run dev
```

The backend should start on port 3000. You'll see:
```
🏪 Smart Pasal API Server
Environment: development
Port: 3000
Status: ✅ Running
```

**Note**: You'll see a warning about Firebase not being configured - this is expected in demo mode.

### 2. Start Android Emulator

1. Open Android Studio
2. Go to **Device Manager** (or **AVD Manager** in older versions)
3. Click the ▶️ play button next to your virtual device
4. Wait for the emulator to fully boot (you'll see the Android home screen)

### 3. Build and Run the App

Open another terminal and run:

```bash
cd mobile
npm install  # If not already done
npm run android
```

This will:
- Build the Android app (first time takes 3-5 minutes)
- Install the app on your emulator
- Launch the app automatically

## 📱 Using the App

Once the app launches:

1. You'll see the **Login Screen**
2. Enter any phone number (e.g., `9876543210`)
3. Click "Send OTP"
4. Enter any 6-digit code (e.g., `123456`)
5. You'll be taken to the **Dashboard**

**Demo Mode**: The app works in demo mode without Firebase. All data is stored locally in SQLite.

## 🔧 Development Workflow

### Recommended Setup

Keep three terminals running:

**Terminal 1** - Backend:
```bash
cd backend
npm run dev
```

**Terminal 2** - Metro bundler:
```bash
cd mobile
npm start
```

**Terminal 3** - For commands:
```bash
cd mobile
# Use for installing packages, checking logs, etc.
```

### Making Changes

- **JavaScript/TypeScript changes**: Auto-reload with Fast Refresh (save file and see changes instantly)
- **Native code changes**: Rebuild with `npm run android`
- **Clear cache if needed**: `npm start -- --clear`

## 🐛 Troubleshooting

### "Could not connect to development server"

**Solution**:
```bash
cd mobile
npm start -- --clear
# Then in another terminal
npm run android
```

### "Network request failed" or Can't reach backend

**Check**:
1. Backend is running: `curl http://localhost:3000/health`
2. `.env` has correct URL: `cat mobile/.env` (should show `http://10.0.2.2:3000/api`)
3. Test from emulator browser: Open Chrome in emulator, go to `http://10.0.2.2:3000/health`

**Solution**:
```bash
# Restart both servers
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd mobile
npm start -c
```

### "Gradle build failed"

**Solution 1** - Clean build:
```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

**Solution 2** - Check Java version:
```bash
java -version
# Should be Java 11 or higher
```

### "SDK location not found"

**Solution**:
Create `mobile/android/local.properties`:
```properties
sdk.dir=/path/to/your/Android/sdk
```

Common SDK locations:
- **Mac**: `/Users/[username]/Library/Android/sdk`
- **Linux**: `/home/[username]/Android/Sdk`
- **Windows**: `C:\Users\[username]\AppData\Local\Android\Sdk`

### Emulator is slow

**Solutions**:
1. Enable hardware acceleration (HAXM/Hyper-V on Windows, KVM on Linux)
2. Allocate more RAM to AVD (2GB+)
3. Use a device with lower resolution
4. Close other applications

### TypeScript warnings

If you see warnings like "All imports in import declaration are unused", these are just warnings and won't prevent the app from running. They can be safely ignored during development.

## 📂 Project Structure

```
mobile/
├── android/           # Generated Android native code
├── assets/           # App icons and splash screen
├── src/
│   ├── screens/      # App screens (Login, Dashboard, etc.)
│   ├── navigation/   # Navigation setup
│   ├── database/     # SQLite database setup
│   ├── services/     # API and Firebase services
│   ├── store/        # State management (Zustand)
│   └── types/        # TypeScript types
├── .env              # Environment variables (API URL, etc.)
├── app.json          # Expo configuration
└── package.json      # Dependencies and scripts
```

## 🔐 Demo Mode vs Production

### Demo Mode (Current Setup)

- No Firebase credentials needed
- All data stored locally in SQLite
- Authentication accepts any OTP
- No cloud sync

### Production Mode

To enable production features:

1. **Setup Firebase**:
   - Create project at https://console.firebase.google.com
   - Enable Phone Authentication
   - Get credentials

2. **Update `.env` files**:
   
   `mobile/.env`:
   ```bash
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   # ... other Firebase configs
   ```
   
   `backend/.env`:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
   ```

3. **Rebuild the app**:
   ```bash
   cd mobile
   npm run android
   ```

## 📝 Available Commands

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build TypeScript
npm start        # Run production build
```

### Mobile
```bash
npm start        # Start Expo dev server
npm run android  # Build and run on Android
npm run ios      # Build and run on iOS (Mac only)
npx expo prebuild --clean  # Regenerate native code
```

## 🎯 Next Steps

1. **Explore the app**: Try different features in the app
2. **Add test data**: Create products, customers, make sales
3. **Check SQLite data**: Use Android Studio's Device File Explorer to see the database
4. **Setup Firebase**: For production features (optional)
5. **Test on physical device**: Install Expo Go and scan QR code

## 📚 Additional Resources

- **Main Documentation**: See [ANDROID_EMULATOR_SETUP.md](ANDROID_EMULATOR_SETUP.md) for detailed setup
- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md) for general quick start guide
- **API Documentation**: See [docs/API.md](docs/API.md) for API reference
- **Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for app architecture

## ⚠️ Important Notes

1. **10.0.2.2 is special**: This IP address is how Android emulator accesses your computer's localhost. Don't change it to `localhost` or `127.0.0.1`.

2. **expo-sqlite plugin**: Currently removed from `app.json` due to an ESM import issue with Node 20. The package is still installed and will work through auto-linking. This doesn't affect functionality.

3. **Demo mode is fine**: The app is fully functional in demo mode. Firebase is only needed for cloud sync and production authentication.

4. **First build is slow**: The first Android build takes 3-5 minutes. Subsequent builds are much faster (~30 seconds).

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide first
2. Check [ANDROID_EMULATOR_SETUP.md](ANDROID_EMULATOR_SETUP.md) for detailed info
3. Look at console logs for error messages
4. Check if backend is running: `curl http://localhost:3000/health`
5. Try clearing cache: `npm start -- --clear`

## ✅ Success Checklist

- [ ] Backend starts without errors (shows green checkmark)
- [ ] Android emulator is running and responsive
- [ ] `npm run android` completes build successfully
- [ ] App launches in emulator
- [ ] Login screen is visible
- [ ] Can enter phone number and OTP
- [ ] Dashboard loads after login

---

**Status**: ✅ App is ready to run on Android emulator!

Built with ❤️ for small businesses in Nepal
