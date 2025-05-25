"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRecipe = exports.getRecipes = exports.updateMealPlan = exports.saveMealPlan = exports.getMealPlan = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("./config");
const mockData_1 = require("./mockData");
const supabase = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseKey);
const getMealPlan = async (userId) => {
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
exports.getMealPlan = getMealPlan;
const saveMealPlan = async (mealPlan) => {
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
exports.saveMealPlan = saveMealPlan;
const updateMealPlan = async (id, mealPlan) => {
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
exports.updateMealPlan = updateMealPlan;
const getRecipes = async () => {
    const { data, error } = await supabase
        .from('recipes')
        .select('*');
    if (error) {
        console.error('Error fetching recipes:', error);
        return mockData_1.mockRecipes;
    }
    return data;
};
exports.getRecipes = getRecipes;
const addRecipe = async (recipe) => {
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
exports.addRecipe = addRecipe;
