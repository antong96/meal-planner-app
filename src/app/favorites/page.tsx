'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function FavoritesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'prepTime':
        return a.prepTime - b.prepTime;
      case 'cookTime':
        return a.cookTime - b.cookTime;
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(recipes.flatMap((recipe) => recipe.categories)));

  if (isLoading) {
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
          <CardTitle>Favorite Recipes</CardTitle>
          <CardDescription>
            Browse and manage your favorite recipes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              className="w-full sm:w-48"
            >
              <option value="name">Sort by Name</option>
              <option value="prepTime">Sort by Prep Time</option>
              <option value="cookTime">Sort by Cook Time</option>
            </Select>
          </div>

          {sortedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No favorite recipes yet</h3>
              <p className="mt-2 text-gray-500">
                Start adding recipes to your favorites to see them here.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  // TODO: Navigate to recipes page
                  toast({
                    title: 'Coming Soon',
                    description: 'Recipe browsing will be available soon.',
                  });
                }}
              >
                Browse Recipes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecipes.map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Prep: {recipe.prepTime} mins
                        </p>
                        <p className="text-sm text-gray-500">
                          Cook: {recipe.cookTime} mins
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // TODO: Navigate to recipe detail page
                          toast({
                            title: 'Coming Soon',
                            description: 'Recipe details will be available soon.',
                          });
                        }}
                      >
                        View Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 