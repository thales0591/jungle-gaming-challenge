import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DB_PORT: z.coerce.number(),
  DB_HOST: z.string(),
  NODE_ENV: z.string(),
  AUTH_SECRET: z.string(),
  AUTH_REFRESH_SECRET: z.string(),
  AUTH_ACCESS_EXPIRATION_SECONDS: z.coerce.number(),
  AUTH_REFRESH_EXPIRATION_SECONDS: z.coerce.number(), 
  RABBITMQ_URL: z.string(),
  RABBITMQ_QUEUE: z.string()
});
export type Env = z.infer<typeof envSchema>;
