import { config } from '../../config';

export interface Store {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  storeId: string;
}

export class StoreManager {
  private stores: Map<string, Store> = new Map();

  registerStore(store: Store): void {
    this.stores.set(store.id, store);
  }

  async searchProducts(storeId: string, query: string): Promise<Product[]> {
    const store = this.stores.get(storeId);
    if (!store) {
      throw new Error(`Store ${storeId} not found`);
    }

    try {
      // TODO: Implement actual store API integration
      console.log(`Searching products in ${store.name} for query: ${query}`);
      return [];
    } catch (error) {
      console.error(`Error searching products in ${store.name}:`, error);
      throw error;
    }
  }

  async getProductPrice(storeId: string, productId: string): Promise<number> {
    const store = this.stores.get(storeId);
    if (!store) {
      throw new Error(`Store ${storeId} not found`);
    }

    try {
      // TODO: Implement actual store API integration
      console.log(`Getting price for product ${productId} in ${store.name}`);
      return 0;
    } catch (error) {
      console.error(`Error getting product price in ${store.name}:`, error);
      throw error;
    }
  }
} 