import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// Initialize database tables if they don't exist
export const initDatabase = async () => {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError) {
      console.error('Error creating users table:', usersError);
    }

    // Create recipes table
    const { error: recipesError } = await supabase.rpc('create_recipes_table');
    if (recipesError) {
      console.error('Error creating recipes table:', recipesError);
    }

    // Create meal_plans table
    const { error: mealPlansError } = await supabase.rpc('create_meal_plans_table');
    if (mealPlansError) {
      console.error('Error creating meal_plans table:', mealPlansError);
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}; 