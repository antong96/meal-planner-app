import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingList } from '@/lib/types';
import { formatDate, calculateTotalPrice } from '@/lib/utils';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ShoppingListHistoryProps {
  lists: ShoppingList[];
  onDeleteList: (listId: string) => Promise<void>;
  onRestoreList: (list: ShoppingList) => void;
}

export function ShoppingListHistory({
  lists,
  onDeleteList,
  onRestoreList,
}: ShoppingListHistoryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);

  const handleDelete = async (listId: string) => {
    try {
      setIsLoading(true);
      await onDeleteList(listId);
      toast({
        title: 'Success',
        description: 'Shopping list deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete shopping list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (list: ShoppingList) => {
    onRestoreList(list);
    toast({
      title: 'Success',
      description: 'Shopping list restored successfully.',
    });
  };

  const filteredLists = lists.filter((list) =>
    list.items.some((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shopping List History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedList(null)}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <ArrowPathIcon className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2">
            {filteredLists.map((list) => (
              <div
                key={list.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSelectedList(list)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {formatDate(list.createdAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {list.items.length} items
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(list);
                      }}
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(list.id);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedList?.id === list.id && (
                  <div className="mt-4 space-y-2">
                    {list.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.amount} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${item.price?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 p-2 bg-primary/10 rounded">
                      <p className="font-medium">
                        Total: ${calculateTotalPrice(list.items).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredLists.length === 0 && (
            <p className="text-center text-gray-500">No shopping lists found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 