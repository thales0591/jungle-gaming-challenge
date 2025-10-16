import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/apps/auth-service/@core/jest.config.ts',
    '<rootDir>/apps/task-service/@core/jest.config.ts',
    '<rootDir>/apps/notifications-service/@core/jest.config.ts',
  ],
};

export default config;
