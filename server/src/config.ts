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
});

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/meal-planner'
};

export default config; 