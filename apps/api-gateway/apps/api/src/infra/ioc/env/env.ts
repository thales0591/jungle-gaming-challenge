import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string(),
  JWT_TOKEN_EXPIRATION_SECONDS: z.coerce.number().default(900),
  AUTH_SERVICE_URL: z.string().default('http://localhost:3000/api'),
  TASKS_SERVICE_URL: z.string().default('http://localhost:3001/api'),
});

export type Env = z.infer<typeof envSchema>;
