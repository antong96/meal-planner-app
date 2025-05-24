import { ShoppingItem } from './types';

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  website: string;
  apiKey?: string;
}

const SUPPORTED_STORES: Store[] = [
  {
    id: 'walmart',
    name: 'Walmart',
    logo: '/stores/walmart.png',
    website: 'https://www.walmart.com',
  },
  {
    id: 'target',
    name: 'Target',
    logo: '/stores/target.png',
    website: 'https://www.target.com',
  },
  {
    id: 'kroger',
    name: 'Kroger',
    logo: '/stores/kroger.png',
    website: 'https://www.kroger.com',
  },
];

export class StoreApiClient {
  private store: Store;
  private apiKey?: string;

  constructor(storeId: string, apiKey?: string) {
    const store = SUPPORTED_STORES.find((s) => s.id === storeId);
    if (!store) {
      throw new Error(`Store ${storeId} is not supported`);
    }
    this.store = store;
    this.apiKey = apiKey;
  }

  async searchProducts(query: string): Promise<StoreProduct[]> {
    // TODO: Implement actual API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: query,
            price: 2.99,
            unit: 'each',
            category: 'Produce',
            storeId: this.store.id,
          },
        ]);
      }, 500);
    });
  }

  async addToCart(items: ShoppingItem[]): Promise<{ success: boolean; cartUrl?: string }> {
    // TODO: Implement actual API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          cartUrl: `${this.store.website}/cart`,
        });
      }, 500);
    });
  }

  async getStoreInfo(): Promise<Store> {
    return this.store;
  }
}

export function getSupportedStores(): Store[] {
  return SUPPORTED_STORES;
} 