import { PrismaClient } from '@prisma/client';
import { config } from './config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
});

export interface MealPlan {
  id: string;
  userId: string;
  meals: Array<{
    id: string;
    recipeId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
  }>;
}

export async function getMealPlan(userId: string): Promise<MealPlan | null> {
  return prisma.mealPlan.findUnique({
    where: { userId },
    include: { meals: true },
  });
}

export async function saveMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
  return prisma.mealPlan.create({
    data: {
      ...mealPlan,
      meals: {
        create: mealPlan.meals,
      },
    },
    include: { meals: true },
  });
}

export async function updateMealPlan(id: string, mealPlan: Partial<MealPlan>): Promise<MealPlan> {
  return prisma.mealPlan.update({
    where: { id },
    data: {
      ...mealPlan,
      meals: mealPlan.meals ? {
        deleteMany: {},
        create: mealPlan.meals,
      } : undefined,
    },
    include: { meals: true },
  });
} 