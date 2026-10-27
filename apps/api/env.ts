import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  //production
  PRODUCTION: z
    .enum(['true', 'false', '1', '0'])
    .transform(value => value === 'true' || value === '1'),
  //SERVER
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string(),
  // JWT TOKENS
  JWT_SECRET: z.string().min(32, { message: 'JWT_SECRET must be at least 32 characters' }),
  JWT_REFRESH: z.string().min(32, { message: 'JWT_REFRESH must be at least 32 characters' }),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  // LOGGING
  LOG_TO_FILE: z
    .enum(['true', 'false', '1', '0'])
    .transform(value => value === 'true' || value === '1'),
}).refine(env => env.JWT_SECRET !== env.JWT_REFRESH, {
  message: 'JWT_SECRET and JWT_REFRESH must be different',
  path: ['JWT_REFRESH'],
});

export const ENV = envSchema.parse(process.env);
