'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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

export default function NewRecipePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ name: '', amount: 0, unit: '' }],
      instructions: [''],
    },
  });

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement recipe creation
      toast({
        title: 'Success',
        description: 'Recipe created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Recipe</CardTitle>
          <CardDescription>
            Create a new recipe for your collection
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ingredients</h3>
              {/* TODO: Implement dynamic ingredient fields */}
              <div className="space-y-2">
                <Input
                  label="Ingredient Name"
                  type="text"
                  error={errors.ingredients?.[0]?.name?.message}
                  {...register('ingredients.0.name')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Amount"
                    type="number"
                    error={errors.ingredients?.[0]?.amount?.message}
                    {...register('ingredients.0.amount', { valueAsNumber: true })}
                  />
                  <Input
                    label="Unit"
                    type="text"
                    error={errors.ingredients?.[0]?.unit?.message}
                    {...register('ingredients.0.unit')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Instructions</h3>
              {/* TODO: Implement dynamic instruction fields */}
              <Input
                label="Step 1"
                type="text"
                error={errors.instructions?.[0]?.message}
                {...register('instructions.0')}
              />
            </div>

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
                {isLoading ? <LoadingSpinner size="sm" /> : 'Create Recipe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 