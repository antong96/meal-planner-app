import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
];

const DIETARY_PREFERENCES = [
  'Vegan',
  'Vegetarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Dairy-Free',
  'Nut-Free',
  'Gluten-Free',
];

const COOKING_TIME_RANGES = [
  { label: 'Any', value: 'any' },
  { label: 'Under 15 mins', value: '15' },
  { label: 'Under 30 mins', value: '30' },
  { label: 'Under 45 mins', value: '45' },
  { label: 'Under 60 mins', value: '60' },
];

interface RecipeSearchProps {
  onSearch: (filters: RecipeSearchFilters) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  isLoading?: boolean;
}

export interface RecipeSearchFilters {
  query: string;
  mealTypes: string[];
  dietaryPreferences: string[];
  maxCookingTime: string;
  ingredients: string[];
}

export function RecipeSearch({ onSearch, onRecipeSelect, isLoading = false }: RecipeSearchProps) {
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RecipeSearchFilters>({
    query: '',
    mealTypes: [],
    dietaryPreferences: [],
    maxCookingTime: 'any',
    ingredients: [],
  });
  const [newIngredient, setNewIngredient] = useState('');

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;

    setFilters((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient.trim()],
    }));
    setNewIngredient('');
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ingredient),
    }));
  };

  const handleToggleMealType = (mealType: string) => {
    setFilters((prev) => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter((type) => type !== mealType)
        : [...prev.mealTypes, mealType],
    }));
  };

  const handleToggleDietaryPreference = (preference: string) => {
    setFilters((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Recipes</CardTitle>
        <CardDescription>
          Search and filter recipes to add to your meal plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search recipes..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
          >
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            {isLoading ? <LoadingSpinner size="sm" /> : 'Search'}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Meal Types</h3>
              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map((mealType) => (
                  <Button
                    key={mealType}
                    variant={filters.mealTypes.includes(mealType) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleMealType(mealType)}
                  >
                    {mealType}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {DIETARY_PREFERENCES.map((preference) => (
                  <Button
                    key={preference}
                    variant={filters.dietaryPreferences.includes(preference) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleDietaryPreference(preference)}
                  >
                    {preference}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Cooking Time</h3>
              <Select
                value={filters.maxCookingTime}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, maxCookingTime: value }))}
              >
                {COOKING_TIME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ingredients</h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Add an ingredient..."
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddIngredient}
                  disabled={!newIngredient.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.ingredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                  >
                    <span>{ingredient}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIngredient(ingredient)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 