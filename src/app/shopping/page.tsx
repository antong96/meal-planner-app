import { useState } from 'react';
import { ShoppingList } from '@/components/shopping/ShoppingList';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';

// TODO: Replace with actual data fetching
const MOCK_MEAL_PLAN = [
  {
    id: '1',
    day: 'Monday',
    mealType: 'Breakfast',
    recipe: {
      id: '1',
      name: 'Oatmeal with Berries',
      ingredients: [
        { name: 'Oats', amount: 1, unit: 'cup' },
        { name: 'Milk', amount: 2, unit: 'cups' },
        { name: 'Berries', amount: 1, unit: 'cup' },
      ],
    } as Recipe,
  },
  {
    id: '2',
    day: 'Monday',
    mealType: 'Lunch',
    recipe: {
      id: '2',
      name: 'Chicken Salad',
      ingredients: [
        { name: 'Chicken Breast', amount: 2, unit: 'pieces' },
        { name: 'Lettuce', amount: 1, unit: 'head' },
        { name: 'Tomatoes', amount: 2, unit: 'pieces' },
      ],
    } as Recipe,
  },
];

export default function ShoppingListPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateItems = async (items: any[]) => {
    try {
      setIsLoading(true);
      // TODO: Implement saving to backend
      toast({
        title: 'Success',
        description: 'Shopping list updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update shopping list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping List</h1>
      <ShoppingList
        mealPlan={MOCK_MEAL_PLAN}
        onUpdate={handleUpdateItems}
        isLoading={isLoading}
      />
    </div>
  );
} 