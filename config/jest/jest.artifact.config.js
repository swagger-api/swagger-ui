const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/test/build-artifacts/**/*.js'],
  setupFiles: ['<rootDir>/test/unit/jest-shim.js'],
  transformIgnorePatterns: ['/node_modules/(?!(swagger-client|react-syntax-highlighter)/)'],
};
