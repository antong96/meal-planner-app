'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RecipeSearch, RecipeFilters } from '@/components/recipe/RecipeSearch';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';

export default function RecipesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearch = async (filters: RecipeFilters) => {
    try {
      setIsLoading(true);
      // TODO: Implement recipe search with filters
      toast({
        title: 'Coming Soon',
        description: 'Recipe search functionality will be available soon.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search recipes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <RecipeSearch onSearch={handleSearch} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recipes</CardTitle>
              <CardDescription>
                Browse and manage your recipe collection
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Navigate to new recipe page
                toast({
                  title: 'Coming Soon',
                  description: 'Recipe creation will be available soon.',
                });
              }}
            >
              New Recipe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg font-medium">No recipes found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start by adding your first recipe
                </p>
              </div>
            ) : (
              recipes.map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                    <CardDescription>
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Prep Time:</span> {recipe.prepTime} mins
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Cook Time:</span> {recipe.cookTime} mins
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Servings:</span> {recipe.servings}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 