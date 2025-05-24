import axios from 'axios';
import { Recipe, MealPlan, ShoppingList, ShoppingItem } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const recipeApi = {
  search: async (query: string) => {
    const response = await api.get<Recipe[]>(`/recipes/search?q=${query}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },
  
  create: async (recipe: Omit<Recipe, 'id'>) => {
    const response = await api.post<Recipe>('/recipes', recipe);
    return response.data;
  },
};

export const mealPlanApi = {
  getCurrent: async () => {
    const response = await api.get<MealPlan>('/meal-plan');
    return response.data;
  },
  
  create: async (mealPlan: Omit<MealPlan, 'id' | 'userId'>) => {
    const response = await api.post<MealPlan>('/meal-plan', mealPlan);
    return response.data;
  },
  
  update: async (id: string, mealPlan: Partial<MealPlan>) => {
    const response = await api.put<MealPlan>(`/meal-plan/${id}`, mealPlan);
    return response.data;
  },
};

export const shoppingListApi = {
  getCurrentShoppingList: async () => {
    const response = await api.get<ShoppingList>('/shopping-list');
    return response.data;
  },
  
  updateShoppingList: async (id: string, data: { items: ShoppingItem[] }) => {
    const response = await api.put<ShoppingList>(`/shopping-list/${id}`, data);
    return response.data;
  },
  
  exportShoppingList: async (id: string, format: 'pdf' | 'csv') => {
    const response = await api.get(`/shopping-list/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, name?: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
}; 