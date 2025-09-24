const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add onnx file extension
config.resolver.assetExts.push('onnx');

// Add model files to asset patterns
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;