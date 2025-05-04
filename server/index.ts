import express from 'express';
import cors from 'cors';
import { config } from './config';
import mealPlanRoutes from './routes/meal-plan';
import { errorHandler } from './middleware/error';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meal-plan', mealPlanRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 