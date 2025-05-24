import { MealPlan } from '../models/meal-plan';
import { getDb } from '../db';
import { v4 as uuidv4 } from 'uuid';

export class MealPlanRepository {
  private collection = getDb().collection<MealPlan>('meal-plans');

  async findByUserId(userId: string): Promise<MealPlan[]> {
    return this.collection.find({ userId }).toArray();
  }

  async findById(id: string): Promise<MealPlan | null> {
    return this.collection.findOne({ id });
  }

  async create(data: Partial<MealPlan>): Promise<MealPlan> {
    const mealPlan: MealPlan = {
      id: uuidv4(),
      userId: data.userId!,
      recipes: data.recipes || [],
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.collection.insertOne(mealPlan);
    return mealPlan;
  }

  async update(id: string, data: Partial<MealPlan>): Promise<MealPlan | null> {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result.value;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
} 