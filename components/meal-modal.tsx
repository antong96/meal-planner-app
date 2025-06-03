import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface MealPlan {
  date: string; // ISO date string
  mealType: "breakfast" | "lunch" | "dinner";
  recipeId: string;
}

export function MealModal({
  open,
  onOpenChange,
  onSave,
  recipes,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (meal: MealPlan) => void;
  recipes: { id: string; title: string }[];
}) {
  const [form, setForm] = React.useState<MealPlan>({
    date: "",
    mealType: "breakfast",
    recipeId: "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan Meal</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
            onOpenChange(false);
          }}
        >
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Meal Type</Label>
            <Select
              value={form.mealType}
              onValueChange={val => setForm(f => ({ ...f, mealType: val as MealPlan["mealType"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Recipe</Label>
            <Select
              value={form.recipeId}
              onValueChange={val => setForm(f => ({ ...f, recipeId: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Plan Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 