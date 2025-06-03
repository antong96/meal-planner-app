import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Recipe {
  title: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export function RecipeModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (recipe: Recipe) => void;
}) {
  const [form, setForm] = React.useState<Recipe>({
    title: "",
    description: "",
    cookTime: 0,
    servings: 1,
    difficulty: "Easy",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recipe</DialogTitle>
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
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="cookTime">Cook Time (min)</Label>
              <Input
                id="cookTime"
                name="cookTime"
                type="number"
                min={1}
                value={form.cookTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                name="servings"
                type="number"
                min={1}
                value={form.servings}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select
              value={form.difficulty}
              onValueChange={val => setForm(f => ({ ...f, difficulty: val as Recipe["difficulty"] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 