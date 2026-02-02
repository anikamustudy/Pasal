# Axios Android Bundling Fix

## Problem

When running the Smart Pasal mobile app on an Android emulator, the app failed to bundle with the following error:

```
Android Bundling failed
The package at "node_modules/axios/dist/node/axios.cjs" attempted to import 
the Node standard library module "crypto".
It failed because the native React runtime does not include the Node standard library.
```

## Root Cause

The issue occurred because Metro bundler (used by Expo/React Native) was resolving the **Node.js version** of Axios (`axios/dist/node/axios.cjs`) instead of the **browser-compatible version**.

Axios v1.6+ uses conditional exports in its package.json to provide different builds:
- **Node.js build** (`dist/node/axios.cjs`): Uses Node.js APIs like `crypto`, `http`, `https`
- **Browser build**: Uses browser-compatible APIs (XMLHttpRequest, fetch)

Metro's default module resolution was not properly handling these conditional exports, leading to the wrong build being selected.

## Solution

Created a `metro.config.js` file that configures Metro's resolver to prioritize the `browser` field in package.json files:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to prioritize browser field in package.json
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

### How It Works

The `resolverMainFields` option tells Metro which fields to check in a package's `package.json` when resolving imports:

1. **`react-native`** - Check for React Native-specific builds first
2. **`browser`** - Check for browser-compatible builds (like Axios browser version)
3. **`main`** - Fallback to the default main entry point

By prioritizing `browser` before `main`, Metro will use Axios's browser build instead of the Node.js build.

## Why This Is the Right Solution

This approach is:

✅ **Production-safe**: Uses the officially supported browser build of Axios
✅ **Standard practice**: This is the recommended way to handle browser vs Node.js packages in React Native
✅ **Maintainable**: Works with all versions of Axios and other packages with similar issues
✅ **Non-invasive**: Doesn't require modifying Axios or any application code
✅ **Future-proof**: Will work with Axios updates and other packages that use conditional exports

## Alternative Solutions Considered

### ❌ Downgrade Axios
- Would lose new features and security updates
- Not a long-term solution

### ❌ Custom resolver with hardcoded paths
- Brittle and breaks with Axios updates
- Requires manual maintenance

### ❌ Polyfill Node.js modules
- Adds unnecessary bundle size
- More complex setup
- Not the intended use case

## Testing

To verify the fix works:

1. Ensure backend is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the mobile app:
   ```bash
   cd mobile
   npm start
   ```

3. Open on Android emulator:
   ```bash
   npm run android
   ```

The app should now bundle successfully without the crypto module error.

## Additional Notes

- This fix applies to **Axios v1.6.0+** which introduced conditional exports
- The same solution works for other packages that have separate Node.js and browser builds
- No changes to application code or imports are required
- The metro.config.js file is automatically picked up by Expo

## References

- [Metro Bundler Configuration](https://facebook.github.io/metro/docs/configuration)
- [Axios GitHub Issue #5523](https://github.com/axios/axios/issues/5523) - Similar issue discussion
- [React Native Module Resolution](https://reactnative.dev/docs/metro)
