import express from 'express';
import { getMealPlan, saveMealPlan, updateMealPlan } from '../storage';
import { getRecipeSuggestions } from '../openai';

const router = express.Router();

// Get meal plan for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const mealPlan = await getMealPlan(userId);
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Error getting meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new meal plan
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const mealPlan = await saveMealPlan({
      userId,
      recipes: [],
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    if (!mealPlan) {
      return res.status(500).json({ error: 'Failed to create meal plan' });
    }

    res.status(201).json(mealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update meal plan
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const mealPlan = await updateMealPlan(req.params.id, {
      recipes: req.body.recipes,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recipe suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const suggestions = await getRecipeSuggestions(req.body.preferences);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 