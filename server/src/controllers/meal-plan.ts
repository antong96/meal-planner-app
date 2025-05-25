import { Request, Response } from 'express';
import { MealPlanService } from '../services/meal-plan';

export class MealPlanController {
  private mealPlanService: MealPlanService;

  constructor() {
    this.mealPlanService = new MealPlanService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlans = await this.mealPlanService.getAll(userId);
      res.json(mealPlans);
    } catch (error) {
      console.error('Error getting meal plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlan = await this.mealPlanService.getById(req.params.id, userId);
      if (!mealPlan) {
        res.status(404).json({ error: 'Meal plan not found' });
        return;
      }

      res.json(mealPlan);
    } catch (error) {
      console.error('Error getting meal plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlan = await this.mealPlanService.create({
        userId,
        ...req.body
      });

      res.status(201).json(mealPlan);
    } catch (error) {
      console.error('Error creating meal plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlan = await this.mealPlanService.update(req.params.id, userId, req.body);
      if (!mealPlan) {
        res.status(404).json({ error: 'Meal plan not found' });
        return;
      }

      res.json(mealPlan);
    } catch (error) {
      console.error('Error updating meal plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const success = await this.mealPlanService.delete(req.params.id, userId);
      if (!success) {
        res.status(404).json({ error: 'Meal plan not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 