import { Router } from 'express';
import { MealPlanController } from '../controllers/meal-plan';

const router = Router();
const mealPlanController = new MealPlanController();

// Get all meal plans for the authenticated user
router.get('/', mealPlanController.getAll);

// Get a specific meal plan by ID
router.get('/:id', mealPlanController.getById);

// Create a new meal plan
router.post('/', mealPlanController.create);

// Update a meal plan
router.put('/:id', mealPlanController.update);

// Delete a meal plan
router.delete('/:id', mealPlanController.delete);

export default router; 