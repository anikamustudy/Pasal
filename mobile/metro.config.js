const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to prioritize browser/react-native field in package.json
// This ensures axios uses its browser build instead of the Node.js build
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Support for package exports field (used by axios 1.6+)
config.resolver.unstable_enablePackageExports = true;

// Explicitly configure source extensions for better module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
