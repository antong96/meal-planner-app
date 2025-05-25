"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_plan_1 = require("../controllers/meal-plan");
const router = (0, express_1.Router)();
const mealPlanController = new meal_plan_1.MealPlanController();
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
exports.default = router;
