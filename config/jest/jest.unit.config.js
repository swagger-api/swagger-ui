const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..', '..'),
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/test/unit/*.js?(x)',
    '**/test/unit/**/*.js?(x)',
  ],
  setupFiles: ['<rootDir>/test/unit/jest-shim.js'],
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/build-artifacts/',
    '<rootDir>/test/unit/jest-shim.js',
    '<rootDir>/test/unit/setup.js',
  ],
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-transform-stub'
  },
  transformIgnorePatterns: ['/node_modules/(?!(sinon|react-syntax-highlighter)/)'],
  silent: true, // set to `false` to allow console.* calls to be printed
};
