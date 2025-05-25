"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMealPlan = exports.mockRecipes = void 0;
exports.mockRecipes = [
    {
        id: '1',
        title: 'Pasta Carbonara',
        description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper',
        ingredients: [
            '400g spaghetti',
            '200g pancetta',
            '4 large eggs',
            '100g pecorino cheese',
            '50g parmesan',
            'Black pepper',
            'Salt'
        ],
        instructions: [
            'Cook pasta according to package instructions',
            'Fry pancetta until crispy',
            'Beat eggs with grated cheese and pepper',
            'Drain pasta, mix with pancetta and egg mixture',
            'Serve immediately with extra cheese and pepper'
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        tags: ['italian', 'pasta', 'quick']
    },
    {
        id: '2',
        title: 'Chicken Curry',
        description: 'Spicy Indian-style chicken curry with coconut milk',
        ingredients: [
            '500g chicken breast',
            '1 onion',
            '2 garlic cloves',
            '1 tbsp curry powder',
            '400ml coconut milk',
            '2 tbsp vegetable oil',
            'Fresh coriander'
        ],
        instructions: [
            'Dice chicken and vegetables',
            'Fry onion and garlic until soft',
            'Add chicken and cook until browned',
            'Stir in curry powder and coconut milk',
            'Simmer for 20 minutes',
            'Garnish with coriander'
        ],
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        tags: ['indian', 'curry', 'chicken']
    }
];
exports.mockMealPlan = {
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
