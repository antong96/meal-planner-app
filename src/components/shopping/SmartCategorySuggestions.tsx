import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingItem } from '@/lib/types';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface SmartCategorySuggestionsProps {
  items: ShoppingItem[];
  onUpdateCategory: (itemId: string, category: string) => void;
}

interface CategoryPrediction {
  category: string;
  confidence: number;
}

export function SmartCategorySuggestions({
  items,
  onUpdateCategory,
}: SmartCategorySuggestionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<Map<string, CategoryPrediction[]>>(new Map());

  const predictCategory = async (itemName: string): Promise<CategoryPrediction[]> => {
    // TODO: Replace with actual ML model prediction
    // This is a mock implementation that simulates ML predictions
    const mockPredictions: CategoryPrediction[] = [
      { category: 'Produce', confidence: 0.8 },
      { category: 'Dairy', confidence: 0.1 },
      { category: 'Other', confidence: 0.1 },
    ];
    return mockPredictions;
  };

  const handleSmartSuggest = async () => {
    setIsLoading(true);
    try {
      const newPredictions = new Map<string, CategoryPrediction[]>();
      
      for (const item of items) {
        const predictions = await predictCategory(item.name);
        newPredictions.set(item.id, predictions);
        
        // Auto-apply highest confidence prediction
        const bestPrediction = predictions[0];
        if (bestPrediction.confidence > 0.7) {
          onUpdateCategory(item.id, bestPrediction.category);
        }
      }
      
      setPredictions(newPredictions);
      
      toast({
        title: 'Success',
        description: 'Smart category suggestions applied successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate smart suggestions. Please try again.',
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
          <CardTitle>Smart Category Suggestions</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSmartSuggest}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <SparklesIcon className="h-4 w-4 mr-2" />
            )}
            Generate Suggestions
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
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
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
                    <option value="">Select category</option>
                    {predictions.get(item.id)?.map((prediction) => (
                      <option key={prediction.category} value={prediction.category}>
                        {prediction.category} ({(prediction.confidence * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                </div>

                {predictions.has(item.id) && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium">Suggested Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {predictions.get(item.id)?.map((prediction) => (
                        <div
                          key={prediction.category}
                          className="px-2 py-1 bg-primary/10 rounded text-sm"
                          style={{
                            opacity: prediction.confidence,
                          }}
                        >
                          {prediction.category} ({(prediction.confidence * 100).toFixed(0)}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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