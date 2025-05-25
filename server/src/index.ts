import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import mealPlanRoutes from './routes/meal-plan';
import { errorHandler } from './middleware/error';
import { authMiddleware } from './middleware/auth';
import { config } from './config';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
if (process.env.NODE_ENV !== 'production') {
  initDatabase().catch(console.error);
}

// Routes
app.use('/api/meal-plan', authMiddleware, mealPlanRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Debug endpoint til að skoða environment breytur (án viðkvæmra lykla)
app.get('/env-debug', (_req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'not set',
    SUPABASE_KEY: process.env.SUPABASE_KEY ? 'set' : 'not set',
  });
});

app.get('/db-debug', async (_req, res) => {
  // Prófa MongoDB
  let mongoStatus = 'not checked';
  try {
    const client = new MongoClient(config.databaseUrl);
    await client.connect();
    await client.db().admin().ping();
    mongoStatus = 'connected';
    await client.close();
  } catch (err) {
    mongoStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
  }

  // Prófa Supabase
  let supabaseStatus = 'not checked';
  try {
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);
    const { error } = await supabase.from('meal_plans').select('*').limit(1);
    if (error) {
      supabaseStatus = 'error: ' + error.message;
    } else {
      supabaseStatus = 'connected';
    }
  } catch (err) {
    supabaseStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
  }

  res.json({
    mongodb: mongoStatus,
    supabase: supabaseStatus
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 