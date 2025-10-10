import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DB_PORT: z.coerce.number(),
  DB_HOST: z.string(),
  RABBITMQ_URL: z.string(),
  RABBITMQ_QUEUE: z.string(),
  NODE_ENV: z.string(),
});
export type Env = z.infer<typeof envSchema>;
