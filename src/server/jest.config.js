module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Directory where coverage reports are saved
  coverageReporters: ['text', 'lcov'], // Use lcov format for SonarCloud
  testEnvironment: 'node', // Set test environment for server-side
  collectCoverageFrom: [
    'src/server/**/*.{js,ts}', // Specify the files to collect coverage from
    '!src/server/**/*.test.{js,ts}', // Exclude test files from coverage
  ],
};
