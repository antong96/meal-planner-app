'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DynamicFormFields } from '@/components/recipe/DynamicFormFields';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const recipeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prepTime: z.number().min(0, 'Prep time must be a positive number'),
  cookTime: z.number().min(0, 'Cook time must be a positive number'),
  servings: z.number().min(1, 'Servings must be at least 1'),
  ingredients: z.array(z.object({
    name: z.string().min(1, 'Ingredient name is required'),
    amount: z.number().min(0, 'Amount must be a positive number'),
    unit: z.string().min(1, 'Unit is required'),
  })),
  instructions: z.array(z.string().min(1, 'Instruction is required')),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsInitialLoading(true);
        // TODO: Fetch recipe data
        const mockRecipe = {
          name: 'Spaghetti Carbonara',
          description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
          prepTime: 15,
          cookTime: 20,
          servings: 4,
          ingredients: [
            { name: 'Spaghetti', amount: 400, unit: 'g' },
            { name: 'Pancetta', amount: 150, unit: 'g' },
            { name: 'Eggs', amount: 4, unit: 'whole' },
            { name: 'Parmesan', amount: 100, unit: 'g' },
          ],
          instructions: [
            'Cook pasta according to package instructions.',
            'Fry pancetta until crispy.',
            'Mix eggs and cheese in a bowl.',
            'Combine hot pasta with egg mixture and pancetta.',
          ],
        };
        reset(mockRecipe);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load recipe. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id, reset, toast]);

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement recipe update
      toast({
        title: 'Success',
        description: 'Recipe updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
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
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Recipe</CardTitle>
          <CardDescription>
            Update your recipe details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Recipe Name"
                type="text"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Description"
                type="text"
                error={errors.description?.message}
                {...register('description')}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Prep Time (mins)"
                  type="number"
                  error={errors.prepTime?.message}
                  {...register('prepTime', { valueAsNumber: true })}
                />
                <Input
                  label="Cook Time (mins)"
                  type="number"
                  error={errors.cookTime?.message}
                  {...register('cookTime', { valueAsNumber: true })}
                />
                <Input
                  label="Servings"
                  type="number"
                  error={errors.servings?.message}
                  {...register('servings', { valueAsNumber: true })}
                />
              </div>
            </div>

            <DynamicFormFields
              name="ingredients"
              label="Ingredients"
              type="ingredient"
            />

            <DynamicFormFields
              name="instructions"
              label="Instructions"
              type="instruction"
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // TODO: Navigate back
                  toast({
                    title: 'Coming Soon',
                    description: 'Navigation will be available soon.',
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : 'Update Recipe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 