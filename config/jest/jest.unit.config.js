const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jsdom',
  testMatch: [
    '**/test/unit/*.js?(x)',
    '**/test/unit/**/*.js?(x)',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/mocha',
    '<rootDir>/test/unit/setup.js',
    '<rootDir>/test/unit/xss/anchor-target-rel/online-validator-badge.jsx',
    '<rootDir>/test/unit/components/online-validator-badge.jsx',
    '<rootDir>/test/unit/components/live-response.jsx',
  ],
  silent: true, // set to `false` to allow console.* calls to be printed
};
