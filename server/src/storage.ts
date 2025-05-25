import { createClient } from '@supabase/supabase-js';
import { config } from './config';
import { mockRecipes } from './mockData';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  tags: string[];
}

export interface MealPlan {
  id: string;
  userId: string;
  recipes: Recipe[];
  startDate: string;
  endDate: string;
}

export const getMealPlan = async (userId: string): Promise<MealPlan | null> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching meal plan:', error);
    return null;
  }

  return data;
};

export const saveMealPlan = async (mealPlan: Omit<MealPlan, 'id'>): Promise<MealPlan | null> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .insert([mealPlan])
    .select()
    .single();

  if (error) {
    console.error('Error saving meal plan:', error);
    return null;
  }

  return data;
};

export const updateMealPlan = async (id: string, mealPlan: Partial<MealPlan>): Promise<MealPlan | null> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .update(mealPlan)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal plan:', error);
    return null;
  }

  return data;
};

export const getRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    return mockRecipes;
  }

  return data;
};

export const addRecipe = async (recipe: Omit<Recipe, 'id'>): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select()
    .single();

  if (error) {
    console.error('Error adding recipe:', error);
    return null;
  }

  return data;
}; 