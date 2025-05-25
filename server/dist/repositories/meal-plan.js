"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealPlanRepository = void 0;
const db_1 = require("../db");
const uuid_1 = require("uuid");
class MealPlanRepository {
    constructor() {
        this.collection = (0, db_1.getDb)().collection('meal-plans');
    }
    async findByUserId(userId) {
        return this.collection.find({ userId }).toArray();
    }
    async findById(id) {
        return this.collection.findOne({ id });
    }
    async create(data) {
        const mealPlan = {
            id: (0, uuid_1.v4)(),
            userId: data.userId,
            recipes: data.recipes || [],
            startDate: data.startDate || new Date(),
            endDate: data.endDate || new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.collection.insertOne(mealPlan);
        return mealPlan;
    }
    async update(id, data) {
        const updateData = {
            ...data,
            updatedAt: new Date()
        };
        const result = await this.collection.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: 'after' });
        if (!result) {
            return null;
        }
        const updatedMealPlan = result;
        return updatedMealPlan;
    }
    async delete(id) {
        const result = await this.collection.deleteOne({ id });
        return result.deletedCount > 0;
    }
}
exports.MealPlanRepository = MealPlanRepository;
