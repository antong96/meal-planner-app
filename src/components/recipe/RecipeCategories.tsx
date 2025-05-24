import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RecipeCategoriesProps {
  recipeId: string;
  initialCategories?: string[];
  initialTags?: string[];
  onUpdate?: (categories: string[], tags: string[]) => void;
}

export function RecipeCategories({
  recipeId,
  initialCategories = [],
  initialTags = [],
  onUpdate,
}: RecipeCategoriesProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setIsLoading(true);
      // TODO: Implement category addition
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory('');
      onUpdate?.(updatedCategories, tags);
      toast({
        title: 'Success',
        description: 'Category added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (category: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement category removal
      const updatedCategories = categories.filter((c) => c !== category);
      setCategories(updatedCategories);
      onUpdate?.(updatedCategories, tags);
      toast({
        title: 'Success',
        description: 'Category removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      setIsLoading(true);
      // TODO: Implement tag addition
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      onUpdate?.(categories, updatedTags);
      toast({
        title: 'Success',
        description: 'Tag added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add tag. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement tag removal
      const updatedTags = tags.filter((t) => t !== tag);
      setTags(updatedTags);
      onUpdate?.(categories, updatedTags);
      toast({
        title: 'Success',
        description: 'Tag removed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove tag. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories & Tags</CardTitle>
        <CardDescription>
          Organize your recipe with categories and tags
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Add a category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddCategory}
              disabled={isLoading || !newCategory.trim()}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
              >
                <span>{category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCategory(category)}
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddTag}
              disabled={isLoading || !newTag.trim()}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
              >
                <span>{tag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 