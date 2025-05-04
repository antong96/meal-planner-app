import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export interface RecipeSuggestion {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
}

export async function getRecipeSuggestions(
  preferences: string[],
  dietaryRestrictions: string[],
  ingredients: string[]
): Promise<RecipeSuggestion[]> {
  const prompt = `Suggest 3 recipes based on the following:
    Preferences: ${preferences.join(', ')}
    Dietary Restrictions: ${dietaryRestrictions.join(', ')}
    Available Ingredients: ${ingredients.join(', ')}
    
    Format each recipe as a JSON object with:
    - title
    - ingredients (array)
    - instructions (array)
    - prepTime (minutes)
    - cookTime (minutes)
    - servings`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });

  const response = JSON.parse(completion.choices[0].message.content || '{}');
  return response.recipes || [];
} 