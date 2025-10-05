import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  SMSRU_API_KEY: z.string().min(1).default('demo-sms-key'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32)
    .default('0123456789abcdef0123456789abcdef'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32)
    .default('fedcba9876543210fedcba9876543210'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  REFRESH_TOKEN_SALT: z
    .string()
    .min(16)
    .default('unique-device-salt'),
  RATE_LIMIT_WINDOW: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(5),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  PAYMENT_PROVIDER: z.enum(['mock', 'stripe']).default('mock'),
  PUBLIC_WEB_APP_URL: z
    .string()
    .url()
    .default('https://example.com'),
  ADMIN_DEFAULT_PASSWORD: z.string().min(4).default('1234')
});

export const env = envSchema.parse(process.env);
