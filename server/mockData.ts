import { RecipeSuggestion } from './openai';

export const mockRecipes: RecipeSuggestion[] = [
  {
    title: 'Vegetable Stir Fry',
    ingredients: [
      '2 cups mixed vegetables',
      '1 tbsp soy sauce',
      '1 tbsp olive oil',
      '2 cloves garlic',
      '1 tsp ginger',
    ],
    instructions: [
      'Heat oil in a pan',
      'Add garlic and ginger',
      'Add vegetables and stir fry',
      'Add soy sauce',
      'Cook for 5 minutes',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
  },
  {
    title: 'Chicken Pasta',
    ingredients: [
      '200g pasta',
      '1 chicken breast',
      '1 cup tomato sauce',
      '1 tbsp olive oil',
      'Salt and pepper',
    ],
    instructions: [
      'Cook pasta according to package',
      'Cook chicken in oil',
      'Add tomato sauce',
      'Combine with pasta',
      'Season to taste',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 2,
  },
];

export const mockMealPlan = {
  id: '1',
  userId: 'user1',
  meals: [
    {
      id: '1',
      recipeId: '1',
      date: '2024-05-04',
      mealType: 'dinner',
    },
    {
      id: '2',
      recipeId: '2',
      date: '2024-05-05',
      mealType: 'lunch',
    },
  ],
}; 