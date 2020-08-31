const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  testMatch: [
    '**/test/mocha/*.js',
    '**/test/mocha/**/*.js',
    '**/test/mocha/core/system/*.jsx',
    '**/test/mocha/xss/*.jsx'
  ],
  // testMatch: ['**/test/mocha/core/plugins/auth/selectors.js'],
  // testMatch: [ '**/test/mocha/xss/**/*.jsx'],
  setupFilesAfterEnv: ['<rootDir>/test/mocha/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/mocha/setup.js',
  ],
};
