'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ShareRecipe } from '@/components/recipe/ShareRecipe';
import { FavoriteButton } from '@/components/recipe/FavoriteButton';
import { RecipeCategories } from '@/components/recipe/RecipeCategories';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement recipe deletion
      toast({
        title: 'Success',
        description: 'Recipe deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoriesUpdate = async (categories: string[], tags: string[]) => {
    try {
      setIsLoading(true);
      // TODO: Implement categories and tags update
      setRecipe((prev) => prev ? { ...prev, categories, tags } : null);
      toast({
        title: 'Success',
        description: 'Categories and tags updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update categories and tags. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!recipe) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>{recipe.description}</CardDescription>
            </div>
            <div className="flex gap-4">
              <FavoriteButton
                recipeId={params.id}
                initialIsFavorite={recipe.isFavorite}
              />
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(true)}
              >
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Navigate to edit page
                  toast({
                    title: 'Coming Soon',
                    description: 'Recipe editing will be available soon.',
                  });
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Prep Time</p>
              <p className="text-2xl font-bold">{recipe.prepTime} mins</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Cook Time</p>
              <p className="text-2xl font-bold">{recipe.cookTime} mins</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Servings</p>
              <p className="text-2xl font-bold">{recipe.servings}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      <RecipeCategories
        recipeId={params.id}
        initialCategories={recipe.categories}
        initialTags={recipe.tags}
        onUpdate={handleCategoriesUpdate}
      />

      {showShareDialog && (
        <ShareRecipe
          recipeId={params.id}
          recipeName={recipe.name}
          description={recipe.description}
        />
      )}
    </div>
  );
} 