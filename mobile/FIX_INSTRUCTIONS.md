# Instructions to Fix the Axios Crypto Import Error

## Problem Summary
You're seeing this error when trying to run the mobile app on Android:
```
Android Bundling failed
The package at "node_modules/axios/dist/node/axios.cjs" attempted to import 
the Node standard library module "crypto".
```

## The Fix
The issue has been resolved by updating the `metro.config.js` file to properly configure Metro bundler to use the browser/React Native version of axios instead of the Node.js version.

## Steps to Apply the Fix

### 1. Ensure You Have the Latest Code
```bash
git pull origin copilot/fix-android-bundling-issue
```

### 2. Clean and Reinstall Dependencies
```bash
cd mobile
rm -rf node_modules
npm install
```

### 3. Clear Metro Bundler Cache
```bash
# Clear all caches
npx expo start --clear

# Or if you prefer to clear manually:
rm -rf .expo
rm -rf node_modules/.cache
```

### 4. Start the Development Server
```bash
npm start
```

### 5. Run on Android
Once the server is running, press `a` to open on Android, or in a new terminal:
```bash
cd mobile
npm run android
```

## What Was Changed?

The `mobile/metro.config.js` file was updated with three key configurations:

1. **Resolver Main Fields** - Prioritizes react-native and browser builds
2. **Package Exports Support** - Enables support for modern "exports" field (axios 1.6+)
3. **Source Extensions** - Adds `.cjs` support for CommonJS modules

## Verification

After following these steps, you should see:
- ✅ Metro bundler starts successfully
- ✅ No crypto module errors
- ✅ App bundles for Android without issues
- ✅ App launches on the emulator

## Troubleshooting

### If you still see the error:

1. **Make sure you pulled the latest changes:**
   ```bash
   cd /path/to/Pasal
   git status
   git pull origin copilot/fix-android-bundling-issue
   ```

2. **Verify metro.config.js exists:**
   ```bash
   cd mobile
   cat metro.config.js
   ```
   
   It should contain:
   ```javascript
   config.resolver.unstable_enablePackageExports = true;
   ```

3. **Clean everything and start fresh:**
   ```bash
   cd mobile
   rm -rf node_modules
   rm -rf .expo
   rm -rf android/build
   rm -rf android/app/build
   npm install
   npx expo start --clear
   ```

4. **Make sure your Android emulator is running:**
   ```bash
   emulator -list-avds  # List available emulators
   emulator @Pixel_8 &  # Start your emulator (replace Pixel_8 with your emulator name)
   ```

### If the app builds but has runtime issues:

1. Check that the backend server is running on the correct address
2. Update the API_BASE_URL in your `.env` file or the default in `src/services/api.ts`
3. Make sure your emulator can reach the backend (use `10.0.2.2` for Android emulator to access localhost)

## Additional Documentation

- See `AXIOS_FIX.md` for detailed technical explanation
- See `ANDROID_BUNDLING_FIX.md` for the complete fix documentation
- See `ANDROID_SETUP.md` for general Android setup instructions

## Need More Help?

If you're still experiencing issues after following these steps, please provide:
1. The exact error message
2. Your Node.js version (`node --version`)
3. Your npm version (`npm --version`)
4. Your expo version (`npx expo --version`)
5. The output of `cd mobile && npm list axios`
