import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const mealTypes = [
  { key: "breakfast", label: "Breakfast", color: "bg-yellow-100 text-yellow-800" },
  { key: "lunch", label: "Lunch", color: "bg-green-100 text-green-800" },
  { key: "dinner", label: "Dinner", color: "bg-blue-100 text-blue-800" },
];

type Meal = {
  recipeTitle: string;
  cookTime: string;
};

type MealsByDay = {
  [day: string]: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
};

export function WeeklyCalendar({ meals }: { meals: MealsByDay }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="w-24"></th>
            {days.map((day) => (
              <th key={day} className="px-2 py-2 text-center font-semibold text-gray-700">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealTypes.map((mealType) => (
            <tr key={mealType.key}>
              <td className="px-2 py-2 text-right align-top">
                <Badge className={mealType.color}>{mealType.label}</Badge>
              </td>
              {days.map((day) => {
                const meal = meals[day]?.[mealType.key as keyof typeof meals[typeof day]];
                return (
                  <td key={day} className="px-2 py-2 align-top">
                    <Card className="p-2 min-h-[60px] flex flex-col items-center justify-center">
                      {meal ? (
                        <>
                          <div className="font-medium text-sm text-gray-900 text-center">{meal.recipeTitle}</div>
                          <div className="text-xs text-gray-500">{meal.cookTime} min</div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 text-center">No meal planned</div>
                      )}
                    </Card>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 