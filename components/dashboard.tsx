import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { WeeklyCalendar } from "@/components/weekly-calendar";

const mockRecipes = [
  { id: 1, title: "Chicken Alfredo", cookTime: 30 },
  { id: 2, title: "Veggie Stir Fry", cookTime: 20 },
  { id: 3, title: "Beef Tacos", cookTime: 25 },
  { id: 4, title: "Salmon Salad", cookTime: 15 },
];

const mockMeals = {
  Sun: { breakfast: { recipeTitle: "Omelette", cookTime: "10" }, lunch: { recipeTitle: "Chicken Alfredo", cookTime: "30" }, dinner: { recipeTitle: "Beef Tacos", cookTime: "25" } },
  Mon: { breakfast: { recipeTitle: "Pancakes", cookTime: "15" }, lunch: { recipeTitle: "Veggie Stir Fry", cookTime: "20" }, dinner: { recipeTitle: "Salmon Salad", cookTime: "15" } },
  Tue: {},
  Wed: {},
  Thu: {},
  Fri: {},
  Sat: {},
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = React.useState<typeof mockRecipes>([]);
  const [meals, setMeals] = React.useState<any>({});

  React.useEffect(() => {
    setRecipes(mockRecipes);
    setMeals(mockMeals);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur">
        <div className="font-bold text-xl text-orange-600">🍊 Meal Planner</div>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">{user?.name}</span>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </header>
      {/* Main */}
      <main className="flex-1 flex flex-col md:flex-row gap-8 p-6">
        {/* Left: Main content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-orange-600">{recipes.length}</div>
              <div className="text-gray-700">Recipes</div>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-orange-600">{Object.values(meals).reduce((acc, day) => acc + Object.keys(day).length, 0)}</div>
              <div className="text-gray-700">Planned Meals</div>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <div className="text-2xl font-bold text-orange-600">This Week</div>
              <div className="text-gray-700">Overview</div>
            </Card>
          </div>
          {/* Quick actions */}
          <div className="flex gap-4 flex-wrap">
            <Button className="bg-orange-600 hover:bg-orange-700">Add Recipe</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">Plan Meal</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">Shopping List</Button>
          </div>
          {/* Weekly calendar */}
          <WeeklyCalendar meals={meals} />
        </div>
        {/* Right: Recent recipes sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <Card className="p-4">
            <div className="font-bold text-lg mb-2 text-orange-600">Recent Recipes</div>
            <ul className="space-y-2">
              {recipes.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span>{r.title}</span>
                  <Badge className="bg-orange-100 text-orange-700">{r.cookTime} min</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </main>
    </div>
  );
} 