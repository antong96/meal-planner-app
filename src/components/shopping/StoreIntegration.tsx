import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { StoreApiClient, getSupportedStores, StoreProduct } from '@/lib/storeApiClient';
import { ShoppingItem } from '@/lib/types';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface StoreIntegrationProps {
  items: ShoppingItem[];
  onExport: (storeId: string) => Promise<void>;
}

export function StoreIntegration({ items, onExport }: StoreIntegrationProps) {
  const { toast } = useToast();
  const [selectedStore, setSelectedStore] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StoreProduct[]>([]);
  const [storeClient, setStoreClient] = useState<StoreApiClient | null>(null);

  const stores = getSupportedStores();

  const handleStoreSelect = async (storeId: string) => {
    try {
      setIsLoading(true);
      const client = new StoreApiClient(storeId);
      setStoreClient(client);
      setSelectedStore(storeId);
      const storeInfo = await client.getStoreInfo();
      toast({
        title: 'Store Connected',
        description: `Successfully connected to ${storeInfo.name}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to store. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!storeClient || !searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const results = await storeClient.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedStore) {
      toast({
        title: 'Error',
        description: 'Please select a store first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await onExport(selectedStore);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export to store. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Integration</CardTitle>
        <CardDescription>
          Export your shopping list to your favorite grocery store
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Button
              key={store.id}
              variant={selectedStore === store.id ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleStoreSelect(store.id)}
              disabled={isLoading}
            >
              <img
                src={store.logo}
                alt={store.name}
                className="h-8 w-8 object-contain"
              />
              <span>{store.name}</span>
            </Button>
          ))}
        </div>

        {selectedStore && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Search Results</h3>
                <div className="grid gap-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          ${product.price} per {product.unit}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(product.storeId, '_blank')}
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isLoading || items.length === 0}
              className="w-full"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                `Export to ${stores.find((s) => s.id === selectedStore)?.name}`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 