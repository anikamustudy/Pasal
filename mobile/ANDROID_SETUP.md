# Android Emulator Quick Start

## TL;DR - Get Running Fast

```bash
# 1. Make sure backend is running
cd ../backend && npm run dev

# 2. Start Android emulator from Android Studio

# 3. Run the app
npm run android
```

That's it! The environment is pre-configured for Android emulator.

## Important: API Configuration

The `.env` file is already configured with:
```
API_BASE_URL=http://10.0.2.2:3000/api
```

**Why 10.0.2.2?**
- This is the special IP that Android emulator uses to access your computer's localhost
- DO NOT use `localhost` - it won't work on Android emulator

## Platform-Specific URLs

```bash
# Android Emulator (default in .env)
API_BASE_URL=http://10.0.2.2:3000/api

# iOS Simulator
API_BASE_URL=http://localhost:3000/api

# Physical Device (find your computer's IP)
API_BASE_URL=http://192.168.1.X:3000/api
```

To find your computer's IP:
- **Windows:** `ipconfig` → Look for IPv4 Address
- **Mac/Linux:** `ifconfig` → Look for inet address

## Troubleshooting

### "Network request failed"
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check `.env` has: `API_BASE_URL=http://10.0.2.2:3000/api`
3. Test from emulator browser: `http://10.0.2.2:3000/health`

### "Module not found"
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### "Build failed"
```bash
npm start -- --clear
# Wait for cache to clear, then try again
```

## Full Documentation

For detailed setup instructions, see:
- [../ANDROID_EMULATOR_SETUP.md](../ANDROID_EMULATOR_SETUP.md) - Complete Android setup guide
- [../QUICKSTART.md](../QUICKSTART.md) - General quick start
- [../docs/SETUP.md](../docs/SETUP.md) - Detailed setup guide

## First Time Setup

If this is your first time:

1. **Install Android Studio**
   - Download from https://developer.android.com/studio
   - Install Android SDK and create an AVD (Virtual Device)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (optional for demo mode)
   - Edit `.env` with your Firebase credentials
   - App works in demo mode without Firebase

4. **Start Backend**
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

5. **Run App**
   ```bash
   npm run android
   ```

---

For more help, see [../ANDROID_EMULATOR_SETUP.md](../ANDROID_EMULATOR_SETUP.md)
