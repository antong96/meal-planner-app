import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItem } from '@/lib/types';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface IngredientCategorizerProps {
  items: ShoppingItem[];
  onUpdateCategory: (itemId: string, category: string) => void;
}

const CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat & Seafood',
  'Bakery',
  'Frozen',
  'Canned Goods',
  'Dry Goods',
  'Spices & Condiments',
  'Beverages',
  'Other',
];

// Simple ingredient categorization rules
const CATEGORY_RULES: Record<string, string[]> = {
  'Produce': ['apple', 'banana', 'lettuce', 'tomato', 'onion', 'garlic', 'potato', 'carrot'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream'],
  'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'turkey'],
  'Bakery': ['bread', 'roll', 'bun', 'bagel', 'muffin', 'cake', 'cookie'],
  'Frozen': ['frozen', 'ice cream', 'pizza', 'vegetables'],
  'Canned Goods': ['canned', 'soup', 'beans', 'tuna', 'corn'],
  'Dry Goods': ['pasta', 'rice', 'flour', 'sugar', 'cereal', 'crackers'],
  'Spices & Condiments': ['salt', 'pepper', 'spice', 'sauce', 'ketchup', 'mustard'],
  'Beverages': ['water', 'juice', 'soda', 'coffee', 'tea', 'wine', 'beer'],
};

export function IngredientCategorizer({ items, onUpdateCategory }: IngredientCategorizerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const suggestCategory = (itemName: string): string => {
    const lowerName = itemName.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
      if (keywords.some(keyword => lowerName.includes(keyword))) {
        return category;
      }
    }
    
    return 'Other';
  };

  const handleAutoCategorize = () => {
    setIsLoading(true);
    try {
      items.forEach(item => {
        const suggestedCategory = suggestCategory(item.name);
        onUpdateCategory(item.id, suggestedCategory);
      });

      toast({
        title: 'Success',
        description: 'Ingredients categorized successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to categorize ingredients. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ingredient Categories</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoCategorize}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <SparklesIcon className="h-4 w-4 mr-2" />
            )}
            Auto-Categorize
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.amount} {item.unit}
                  </p>
                </div>
                <select
                  value={item.category}
                  onChange={(e) => onUpdateCategory(item.id, e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-center text-gray-500">No ingredients found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 