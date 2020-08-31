const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  testMatch: [
    '**/test/unit/*.js',
    '**/test/unit/**/*.js',
    '**/test/unit/core/system/*.jsx',
    '**/test/unit/xss/*.jsx'
  ],
  // testMatch: ['**/test/unit/core/plugins/auth/selectors.js'],
  // testMatch: [ '**/test/unit/xss/anchor-target-rel/*.jsx'],
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/unit/setup.js',
  ],
};
