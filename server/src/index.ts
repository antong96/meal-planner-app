import express from 'express';
import cors from 'cors';
import { config } from './config';
import { initDatabase } from './db';
import mealPlanRoutes from './routes/meal-plan';
import { errorHandler } from './middleware/error';
import { authMiddleware } from './middleware/auth';

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
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(errorHandler);

const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 