# Running Smart Pasal on Android Studio Emulator

This guide provides step-by-step instructions for running the Smart Pasal mobile app on Android Studio Emulator.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **Android Studio** installed with:
   - Android SDK
   - Android Emulator
   - At least one Android Virtual Device (AVD) configured
3. **Java Development Kit (JDK)** - Usually bundled with Android Studio
4. **Backend server** running on your machine

## Quick Start

If you're in a hurry, here's the fastest way to get running:

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install dependencies (if not already done)
npm install

# 3. Environment is already configured for Android emulator!
# The .env file is set up with API_BASE_URL=http://10.0.2.2:3000/api

# 4. Start the backend server (in a separate terminal)
cd ../backend
npm install
npm run dev

# 5. Launch Android emulator from Android Studio, then run:
cd ../mobile
npm run android
```

## Detailed Setup Instructions

### Step 1: Install Android Studio

If you haven't installed Android Studio yet:

1. Download from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Install Android Studio
3. During installation, ensure the following components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Step 2: Configure Android SDK

1. Open Android Studio
2. Go to **Settings/Preferences → Appearance & Behavior → System Settings → Android SDK**
3. Install the following:
   - **SDK Platforms**: Android 13.0 (Tiramisu) or Android 14.0 (API 34)
   - **SDK Tools**: 
     - Android SDK Build-Tools
     - Android Emulator
     - Android SDK Platform-Tools

### Step 3: Create Android Virtual Device (AVD)

1. In Android Studio, go to **Tools → Device Manager**
2. Click **Create Device**
3. Select a device definition (e.g., **Pixel 5**)
4. Choose a system image:
   - Recommended: **Android 13 (API 33)** or **Android 14 (API 34)**
   - Download if necessary
5. Configure AVD settings (defaults are usually fine)
6. Click **Finish**

### Step 4: Configure Environment Variables

The environment is already pre-configured for Android emulator! The `.env` file in the `mobile/` directory contains:

```bash
API_BASE_URL=http://10.0.2.2:3000/api
```

**Why 10.0.2.2?**
- `10.0.2.2` is a special IP address that the Android emulator uses to access the host machine's localhost
- This allows your app running in the emulator to connect to the backend server on your computer

**For other platforms:**
- iOS Simulator: Use `http://localhost:3000/api`
- Physical Device: Use your computer's IP (e.g., `http://192.168.1.100:3000/api`)

### Step 5: Install Dependencies

```bash
cd mobile
npm install
```

This will install all required dependencies including:
- Expo SDK 50
- React Native 0.73
- Firebase SDK
- Navigation libraries
- And more...

### Step 6: Start the Backend Server

The mobile app needs the backend API to function. In a **separate terminal**:

```bash
cd backend
npm install  # If not already done
npm run dev
```

Verify the backend is running by opening [http://localhost:3000/health](http://localhost:3000/health) in your browser.

### Step 7: Configure Firebase (Optional for Development)

For full functionality, you'll need Firebase credentials. However, the app will work in demo mode without them.

To configure Firebase (recommended):

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Phone Authentication
3. Get your web app configuration
4. Update the `.env` file with your Firebase credentials:

```bash
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### Step 8: Launch the App

1. **Start the Android Emulator:**
   - Open Android Studio → **Device Manager**
   - Click the ▶️ (Play) button next to your AVD
   - Wait for the emulator to fully boot (you'll see the home screen)

2. **Run the app:**
   ```bash
   cd mobile
   npm run android
   ```

   Or alternatively:
   ```bash
   npm start
   # Then press 'a' for Android
   ```

3. **Wait for the build:**
   - First time will take 3-5 minutes (subsequent runs are faster)
   - The app will automatically install and launch on the emulator

## Verification

Once the app launches:

1. You should see the **Login Screen**
2. Try entering a phone number (any number works in demo mode)
3. Click "Send OTP"
4. Enter any 6-digit code (e.g., 123456)
5. You should see the **Dashboard**

## Troubleshooting

### "Could not connect to development server"

**Problem:** The app can't find the Expo dev server.

**Solution:**
```bash
# Stop the app and restart with:
npm start -- --tunnel
```

### "Network request failed" or "Unable to connect to backend"

**Problem:** The app can't reach the backend API.

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check .env configuration:**
   ```bash
   cd mobile
   cat .env
   # Should show: API_BASE_URL=http://10.0.2.2:3000/api
   ```

3. **Test connection from emulator:**
   - Open Chrome browser in the emulator
   - Navigate to `http://10.0.2.2:3000/health`
   - You should see: `{"status":"ok"}`

4. **Restart both servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Mobile
   cd mobile
   npm start -c  # -c clears cache
   ```

### "SDK location not found"

**Problem:** Android SDK path not configured.

**Solution:**

1. Find your Android SDK location:
   - **Mac:** Usually `/Users/[username]/Library/Android/sdk`
   - **Windows:** Usually `C:\Users\[username]\AppData\Local\Android\Sdk`
   - **Linux:** Usually `/home/[username]/Android/Sdk`

2. Create `local.properties` in the `android` folder (if it exists):
   ```bash
   cd mobile/android
   echo "sdk.dir=/path/to/your/Android/sdk" > local.properties
   ```

### "Unable to load script from assets"

**Problem:** Metro bundler not running or app not finding the bundle.

**Solution:**
```bash
cd mobile
# Stop any running processes
# Clear cache and restart
npm start -- --clear
```

### "Gradle build failed"

**Problem:** Issues with Android build system.

**Solutions:**

1. **Clean Gradle cache:**
   ```bash
   cd mobile/android
   ./gradlew clean
   cd ..
   ```

2. **Check Java version:**
   ```bash
   java -version
   # Should be Java 11 or higher
   ```

3. **Update Gradle wrapper:**
   ```bash
   cd mobile/android
   ./gradlew wrapper --gradle-version=8.0.2
   ```

### "Emulator is slow or laggy"

**Solutions:**

1. **Enable Hardware Acceleration:**
   - **Windows:** Install Intel HAXM or configure Hyper-V
   - **Mac:** Ensure Hypervisor.framework is enabled
   - **Linux:** Ensure KVM is enabled

2. **Allocate more resources to AVD:**
   - Edit AVD in Device Manager
   - Increase RAM to 2GB or more
   - Increase VM heap to 512MB

3. **Use a device with lower resolution:**
   - Create a new AVD with smaller screen (e.g., Nexus 5)

### "Firebase authentication not working"

**Problem:** Firebase credentials not configured or incorrect.

**Solution:**

1. **For demo mode:** The app works without Firebase in demo mode
2. **For production:**
   - Verify Firebase credentials in `.env`
   - Check Firebase Console that Phone Auth is enabled
   - Add your app's SHA-1 fingerprint to Firebase (for Android)

## Performance Tips

### Faster Development

1. **Use Fast Refresh:** Changes to JS code hot-reload instantly
2. **Keep Emulator Running:** Don't close between sessions
3. **Use Expo Go** (optional): Faster for quick testing, but some features may not work

### Recommended Emulator Settings

- **API Level:** 33 (Android 13) or 34 (Android 14)
- **RAM:** 2048 MB minimum
- **Internal Storage:** 2048 MB minimum
- **Graphics:** Automatic or Hardware (if supported)

## Development Workflow

Typical workflow when developing:

```bash
# Terminal 1: Keep backend running
cd backend
npm run dev

# Terminal 2: Keep mobile running
cd mobile
npm start

# Make changes to code
# → App auto-reloads
# → View changes in emulator
# → Repeat
```

## Running Release Build

To test the production build:

```bash
cd mobile
npm run android -- --variant=release
```

Note: Release builds take longer but run faster and closer to production.

## Additional Resources

- **Expo Documentation:** [https://docs.expo.dev](https://docs.expo.dev)
- **React Native Documentation:** [https://reactnative.dev](https://reactnative.dev)
- **Android Developer Guide:** [https://developer.android.com](https://developer.android.com)
- **Project Documentation:**
  - [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
  - [README.md](README.md) - Project overview
  - [docs/SETUP.md](docs/SETUP.md) - Detailed setup guide

## Common Commands Reference

```bash
# Start Expo dev server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Clear cache and restart
npm start -- --clear

# Check installed packages
npm list

# Update dependencies
npm update

# Install a new package
npm install package-name
```

## Next Steps

Once you have the app running on Android emulator:

1. **Explore the features:** Navigate through the dashboard, settings, etc.
2. **Try the API:** Make test API calls from the app
3. **Make changes:** Edit code and see hot-reload in action
4. **Read the docs:** Check out [docs/API.md](docs/API.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
5. **Test on real device:** Install Expo Go and test on your phone

## Support

If you encounter issues not covered here:

1. Check the main [QUICKSTART.md](QUICKSTART.md) guide
2. Review [docs/SETUP.md](docs/SETUP.md) for detailed setup
3. Search existing GitHub issues
4. Create a new issue with details about your problem

---

**Happy Development!** 🚀

Built with ❤️ for small businesses in Nepal
