"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipeSuggestions = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("./config");
const openai = new openai_1.default({
    apiKey: config_1.config.openaiApiKey,
});
const getRecipeSuggestions = async (preferences) => {
    try {
        const prompt = `Generate 3 recipe suggestions based on the following preferences:
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}
- Favorite cuisines: ${preferences.favoriteCuisines.join(', ')}
- Cooking skill level: ${preferences.cookingSkill}
- Time available: ${preferences.timeAvailable} minutes
- Available ingredients: ${preferences.ingredientsAvailable.join(', ')}

Please provide recipes in JSON format with the following structure:
{
  "title": string,
  "description": string,
  "ingredients": string[],
  "instructions": string[],
  "prepTime": number,
  "cookTime": number,
  "servings": number,
  "tags": string[]
}`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful cooking assistant that generates recipe suggestions in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });
        const response = JSON.parse(completion.choices[0].message.content || '{}');
        return response.recipes || [];
    }
    catch (error) {
        console.error('Error getting recipe suggestions:', error);
        return [];
    }
};
exports.getRecipeSuggestions = getRecipeSuggestions;
