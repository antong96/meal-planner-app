"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanController = void 0;
const meal_plan_1 = require("../services/meal-plan");
class MealPlanController {
    constructor() {
        this.getAll = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const mealPlans = await this.mealPlanService.getAll(userId);
                res.json(mealPlans);
            }
            catch (error) {
                console.error('Error getting meal plans:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.getById = async (req, res) => {
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
            }
            catch (error) {
                console.error('Error getting meal plan:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.create = async (req, res) => {
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
            }
            catch (error) {
                console.error('Error creating meal plan:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.update = async (req, res) => {
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
            }
            catch (error) {
                console.error('Error updating meal plan:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.delete = async (req, res) => {
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
            }
            catch (error) {
                console.error('Error deleting meal plan:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
        this.mealPlanService = new meal_plan_1.MealPlanService();
    }
}
exports.MealPlanController = MealPlanController;
