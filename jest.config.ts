import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/apps/auth-service/@core/jest.config.ts',
    '<rootDir>/apps/task-service/@core/jest.config.ts',
    '<rootDir>/apps/notifications-service/@core/jest.config.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/*/@core/application/**/*.ts',
    'apps/*/@core/domain/**/*.ts',
    '!**/index.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

export default config;
