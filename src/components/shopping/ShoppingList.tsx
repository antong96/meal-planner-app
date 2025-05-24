import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/lib/types';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { StoreIntegration } from './StoreIntegration';
import { generateShoppingListPDF } from '@/lib/pdfGenerator';

interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  recipeId?: string;
}

interface ShoppingListProps {
  mealPlan: Array<{
    id: string;
    day: string;
    mealType: string;
    recipe: Recipe;
  }>;
  onUpdate: (items: ShoppingItem[]) => void;
  isLoading?: boolean;
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

export function ShoppingList({ mealPlan, onUpdate, isLoading = false }: ShoppingListProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', amount: '', unit: '', category: '' });
  const [selectedStore, setSelectedStore] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generateShoppingList = () => {
    const newItems: ShoppingItem[] = [];
    mealPlan.forEach((meal) => {
      meal.recipe.ingredients.forEach((ingredient) => {
        const existingItem = newItems.find(
          (item) => item.name === ingredient.name && item.unit === ingredient.unit
        );

        if (existingItem) {
          existingItem.amount += ingredient.amount;
        } else {
          newItems.push({
            id: Date.now().toString(),
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            category: 'Other', // TODO: Implement ingredient categorization
            checked: false,
            recipeId: meal.recipe.id,
          });
        }
      });
    });

    setItems(newItems);
    onUpdate(newItems);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.unit || !newItem.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const newItems = [
      ...items,
      {
        id: Date.now().toString(),
        name: newItem.name,
        amount: parseFloat(newItem.amount),
        unit: newItem.unit,
        category: newItem.category,
        checked: false,
      },
    ];

    setItems(newItems);
    onUpdate(newItems);
    setNewItem({ name: '', amount: '', unit: '', category: '' });
  };

  const handleRemoveItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    onUpdate(newItems);
  };

  const handleToggleItem = (id: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(newItems);
    onUpdate(newItems);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const pdf = await generateShoppingListPDF(items, {
        title: 'Shopping List',
        date: new Date().toLocaleDateString(),
        store: selectedStore,
      });

      // Create download link
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shopping-list.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Shopping list downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExportToStore = async (storeId: string) => {
    try {
      // TODO: Implement store integration
      toast({
        title: 'Coming Soon',
        description: 'Store integration will be available soon.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export to store. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const categorizedItems = CATEGORIES.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isLoading || items.length === 0}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                disabled={isLoading || items.length === 0 || isGeneratingPDF}
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? <LoadingSpinner size="sm" /> : 'Download PDF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) => setNewItem((prev) => ({ ...prev, amount: e.target.value }))}
            />
            <Input
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value }))}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleAddItem} disabled={isLoading}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Button>

          <div className="space-y-6">
            {CATEGORIES.map((category) => {
              const categoryItems = categorizedItems[category];
              if (!categoryItems?.length) return null;

              return (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium">{category}</h3>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggleItem(item.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span className={item.checked ? 'line-through text-gray-500' : ''}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {item.amount} {item.unit}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <StoreIntegration items={items} onExport={handleExportToStore} />
    </div>
  );
} 