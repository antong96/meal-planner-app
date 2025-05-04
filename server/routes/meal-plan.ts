import express from 'express';
import { getMealPlan, saveMealPlan, updateMealPlan } from '../storage';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mealPlan = await getMealPlan();
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

router.post('/', async (req, res) => {
  try {
    const mealPlan = req.body;
    await saveMealPlan(mealPlan);
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save meal plan' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mealPlan = req.body;
    await updateMealPlan(id, mealPlan);
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
});

export default router; 