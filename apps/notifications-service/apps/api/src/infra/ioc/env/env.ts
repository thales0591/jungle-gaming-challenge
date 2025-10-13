import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3335),
  NODE_ENV: z.string().default('development'),
  JWT_SECRET: z.string(),
  RABBITMQ_URL: z.string(),
  RABBITMQ_NOTIFICATIONS_QUEUE: z.string().default('notifications_queue'),
});

export type Env = z.infer<typeof envSchema>;
