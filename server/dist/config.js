"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    // Server Configuration
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    // Database
    DATABASE_URL: zod_1.z.string().default('mongodb://localhost:27017/meal-planner'),
    // Authentication
    JWT_SECRET: zod_1.z.string().default('your-secret-key'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    // OpenAI
    OPENAI_API_KEY: zod_1.z.string(),
    // Supabase
    SUPABASE_URL: zod_1.z.string(),
    SUPABASE_KEY: zod_1.z.string(),
});
const env = envSchema.parse(process.env);
exports.config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    databaseUrl: env.DATABASE_URL,
    openaiApiKey: env.OPENAI_API_KEY,
    supabaseUrl: env.SUPABASE_URL,
    supabaseKey: env.SUPABASE_KEY,
};
exports.default = exports.config;
