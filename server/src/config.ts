import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // Database
  DATABASE_URL: z.string().default('mongodb://localhost:27017/meal-planner'),

  // Authentication
  JWT_SECRET: z.string().default('your-secret-key'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // OpenAI
  OPENAI_API_KEY: z.string(),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  databaseUrl: env.DATABASE_URL,
  openaiApiKey: env.OPENAI_API_KEY,
  supabaseUrl: env.SUPABASE_URL,
  supabaseKey: env.SUPABASE_KEY,
};

export default config; 