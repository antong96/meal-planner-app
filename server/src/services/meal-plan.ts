import { MealPlan } from '../models/meal-plan';
import { MealPlanRepository } from '../repositories/meal-plan';

export class MealPlanService {
  private mealPlanRepository: MealPlanRepository;

  constructor() {
    this.mealPlanRepository = new MealPlanRepository();
  }

  async getAll(userId: string): Promise<MealPlan[]> {
    return this.mealPlanRepository.findByUserId(userId);
  }

  async getById(id: string, userId: string): Promise<MealPlan | null> {
    const mealPlan = await this.mealPlanRepository.findById(id);
    if (!mealPlan || mealPlan.userId !== userId) {
      return null;
    }
    return mealPlan;
  }

  async create(data: Partial<MealPlan>): Promise<MealPlan> {
    return this.mealPlanRepository.create(data);
  }

  async update(id: string, userId: string, data: Partial<MealPlan>): Promise<MealPlan | null> {
    const mealPlan = await this.mealPlanRepository.findById(id);
    if (!mealPlan || mealPlan.userId !== userId) {
      return null;
    }
    return this.mealPlanRepository.update(id, data);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const mealPlan = await this.mealPlanRepository.findById(id);
    if (!mealPlan || mealPlan.userId !== userId) {
      return false;
    }
    return this.mealPlanRepository.delete(id);
  }
} 