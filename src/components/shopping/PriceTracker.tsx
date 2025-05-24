import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { StoreApiClient, getSupportedStores } from '@/lib/storeApiClient';
import { ShoppingItem } from '@/lib/types';
import { ArrowPathIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface PriceTrackerProps {
  items: ShoppingItem[];
  onUpdatePrices: (prices: Map<string, number>) => void;
}

interface PriceHistory {
  date: string;
  prices: Map<string, number>;
}

export function PriceTracker({ items, onUpdatePrices }: PriceTrackerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [selectedStore, setSelectedStore] = useState('');

  const stores = getSupportedStores();

  const fetchPrices = async () => {
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
      const client = new StoreApiClient(selectedStore);
      const prices = await client.getProductPrices(items);

      // Update current prices
      onUpdatePrices(prices);

      // Add to price history
      setPriceHistory((prev) => [
        {
          date: new Date().toISOString(),
          prices,
        },
        ...prev,
      ]);

      toast({
        title: 'Success',
        description: 'Prices updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch prices. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSavings = () => {
    if (priceHistory.length < 2) return 0;

    const currentPrices = priceHistory[0].prices;
    const previousPrices = priceHistory[1].prices;
    let totalSavings = 0;

    items.forEach((item) => {
      const currentPrice = currentPrices.get(item.id) || 0;
      const previousPrice = previousPrices.get(item.id) || 0;
      if (currentPrice < previousPrice) {
        totalSavings += (previousPrice - currentPrice) * item.amount;
      }
    });

    return totalSavings;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Price Tracker</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPrices}
              disabled={isLoading || !selectedStore}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <ArrowPathIcon className="h-4 w-4 mr-2" />
              )}
              Update Prices
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement price history chart
                toast({
                  title: 'Coming Soon',
                  description: 'Price history chart will be available soon.',
                });
              }}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {priceHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Price History</h3>
              <div className="grid gap-2">
                {items.map((item) => {
                  const currentPrice = priceHistory[0].prices.get(item.id);
                  const previousPrice = priceHistory[1]?.prices.get(item.id);
                  const priceChange = previousPrice
                    ? ((currentPrice || 0) - previousPrice) / previousPrice
                    : 0;

                  return (
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
                      <div className="text-right">
                        <p className="font-medium">${currentPrice?.toFixed(2)}</p>
                        {priceChange !== 0 && (
                          <p
                            className={`text-sm ${
                              priceChange < 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {priceChange > 0 ? '+' : ''}
                            {(priceChange * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {priceHistory.length > 1 && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Potential Savings: ${calculateSavings().toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Compared to last price check
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 