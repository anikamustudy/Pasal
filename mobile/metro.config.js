const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to prioritize browser field in package.json
// This ensures axios uses its browser build instead of the Node.js build
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
