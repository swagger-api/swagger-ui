const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  testMatch: ['**/test/mocha/*.js', '**/test/mocha/**/*.js'],
  // testMatch: ['**/test/mocha/core/curlify.js'],
  setupFilesAfterEnv: ['<rootDir>/test/mocha/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/mocha/setup.js',
  ],
};
