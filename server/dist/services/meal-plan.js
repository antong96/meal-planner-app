"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanService = void 0;
const meal_plan_1 = require("../repositories/meal-plan");
class MealPlanService {
    constructor() {
        this.mealPlanRepository = new meal_plan_1.MealPlanRepository();
    }
    async getAll(userId) {
        return this.mealPlanRepository.findByUserId(userId);
    }
    async getById(id, userId) {
        const mealPlan = await this.mealPlanRepository.findById(id);
        if (!mealPlan || mealPlan.userId !== userId) {
            return null;
        }
        return mealPlan;
    }
    async create(data) {
        return this.mealPlanRepository.create(data);
    }
    async update(id, userId, data) {
        const mealPlan = await this.mealPlanRepository.findById(id);
        if (!mealPlan || mealPlan.userId !== userId) {
            return null;
        }
        return this.mealPlanRepository.update(id, data);
    }
    async delete(id, userId) {
        const mealPlan = await this.mealPlanRepository.findById(id);
        if (!mealPlan || mealPlan.userId !== userId) {
            return false;
        }
        return this.mealPlanRepository.delete(id);
    }
}
exports.MealPlanService = MealPlanService;
