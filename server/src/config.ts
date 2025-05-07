import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // Database
  DATABASE_URL: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),

  // OpenAI
  OPENAI_API_KEY: z.string(),

  // Authentication
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

export const config = envSchema.parse(process.env);

export default config; 