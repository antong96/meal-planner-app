import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  JWT_SECRET: z.string(),
  EID_CLIENT_ID: z.string(),
  EID_CLIENT_SECRET: z.string(),
  EID_REDIRECT_URI: z.string(),
});

export const config = envSchema.parse(process.env);

export default config; 