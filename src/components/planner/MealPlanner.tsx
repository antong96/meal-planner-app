import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
];

interface MealPlan {
  id: string;
  day: string;
  mealType: string;
  recipe: Recipe;
}

interface MealPlannerProps {
  onMealPlanUpdate: (mealPlan: MealPlan[]) => void;
  onGenerateShoppingList: () => void;
  isLoading?: boolean;
}

export function MealPlanner({ onMealPlanUpdate, onGenerateShoppingList, isLoading = false }: MealPlannerProps) {
  const { toast } = useToast();
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const [sourceDay, sourceMealType] = source.droppableId.split('-');
    const [destDay, destMealType] = destination.droppableId.split('-');

    const newMealPlan = [...mealPlan];
    const sourceIndex = newMealPlan.findIndex(
      (meal) => meal.day === sourceDay && meal.mealType === sourceMealType
    );
    const destIndex = newMealPlan.findIndex(
      (meal) => meal.day === destDay && meal.mealType === destMealType
    );

    if (sourceIndex !== -1) {
      const [movedMeal] = newMealPlan.splice(sourceIndex, 1);
      movedMeal.day = destDay;
      movedMeal.mealType = destMealType;
      newMealPlan.splice(destIndex, 0, movedMeal);
      setMealPlan(newMealPlan);
      onMealPlanUpdate(newMealPlan);
    }
  };

  const handleAddRecipe = (day: string, mealType: string) => {
    // TODO: Open recipe selection modal
    toast({
      title: 'Coming Soon',
      description: 'Recipe selection will be available soon.',
    });
  };

  const handleRemoveRecipe = (day: string, mealType: string) => {
    const newMealPlan = mealPlan.filter(
      (meal) => !(meal.day === day && meal.mealType === mealType)
    );
    setMealPlan(newMealPlan);
    onMealPlanUpdate(newMealPlan);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Meal Planner</CardTitle>
            <CardDescription>
              Plan your meals for the week
            </CardDescription>
          </div>
          <Button
            onClick={onGenerateShoppingList}
            disabled={isLoading || mealPlan.length === 0}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Generate Shopping List'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="space-y-4">
                <h3 className="font-medium">{day}</h3>
                {MEAL_TYPES.map((mealType) => {
                  const meal = mealPlan.find(
                    (m) => m.day === day && m.mealType === mealType
                  );
                  const droppableId = `${day}-${mealType}`;

                  return (
                    <Droppable key={droppableId} droppableId={droppableId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[100px] p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{mealType}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddRecipe(day, mealType)}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          {meal ? (
                            <Draggable
                              draggableId={`${day}-${mealType}-${meal.recipe.id}`}
                              index={0}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm"
                                >
                                  <p className="font-medium">{meal.recipe.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {meal.recipe.prepTime + meal.recipe.cookTime} mins
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleRemoveRecipe(day, mealType)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ) : (
                            <div className="text-center text-sm text-gray-500 py-4">
                              Drag a recipe here
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ))}
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
} 