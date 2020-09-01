/* eslint-disable indent */
module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  verbose: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    '!**/controllers/**',
    '!**/models/**',
    '**/services/**',
    '!**/data-seed/**',
    '!**/node_modules/**',
    '!**/lib/**'
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      lines: 85,
      functions: 85,
      branch: 70
    }
  }
};
