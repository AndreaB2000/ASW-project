module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testMatch: ['**/test/**/*.{test,spec}.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.ts'],
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/test/**/*', '!src/server.ts', '!jest.config.ts'],
};
