import type { Config } from 'jest';

const config: Config = {
  displayName: 'auth-service',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/application/**/*.ts',
    '<rootDir>/domain/**/*.ts',
    '!**/index.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json-summary', 'json', 'text', 'lcov'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core/application/(.*)$': '<rootDir>/application/$1',
    '^@core/domain/(.*)$': '<rootDir>/domain/$1',
    '^@core/infra/(.*)$': '<rootDir>/infra/$1',
  },
  cacheDirectory: '../../../.jest-cache/auth-service',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
