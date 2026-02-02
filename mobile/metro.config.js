const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to use browser-compatible versions of packages
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force axios to resolve to the browser build instead of the Node.js build
  if (moduleName === 'axios') {
    // Return the path to the browser-compatible ESM build
    const axiosPath = path.resolve(
      __dirname,
      'node_modules/axios/dist/esm/axios.js'
    );
    
    return {
      type: 'sourceFile',
      filePath: axiosPath,
    };
  }
  
  // Use default resolution for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
