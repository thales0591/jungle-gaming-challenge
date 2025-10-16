import type { Config } from 'jest';

const config: Config = {
  displayName: 'task-service',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/application/usecases/**/*.ts',
    '<rootDir>/domain/entities/**/*.ts',
    '<rootDir>/domain/validators/**/*.ts',
    '<rootDir>/domain/value-objects/**/*.ts',
    '!**/index.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/domain/ports/',
    '/domain/exceptions/',
    '/application/ports/',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json-summary', 'json', 'text', 'lcov'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/$1',
  },
};

export default config;
