import { config } from '../config';

export class StoreManager {
  private static instance: StoreManager;
  
  private constructor() {}
  
  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  public async getStores() {
    // TODO: Implement store fetching logic
    return [];
  }
}

export default StoreManager.getInstance(); 