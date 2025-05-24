import React, { createContext, useContext, useCallback, useState, ReactNode, useEffect, useMemo, useRef } from 'react';
import { ToastContainer } from './Toast';
import { generateId, deepClone } from '@/lib/utils';
import { ToastErrorBoundary } from './ToastErrorBoundary';
import { ToastTheme, ToastAnalytics, ToastAction, ToastCallback, ToastAnimation } from '@/lib/types';
import { createToastWithTemplate, toastTemplates, animations } from '@/lib/toastTemplates';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info' | 'loading';
  duration?: number;
  showProgress?: boolean;
  icon?: React.ReactNode;
  actions?: ToastAction[];
  createdAt: number;
  priority?: number;
  groupId?: string;
  persistent?: boolean;
  theme?: ToastTheme;
  analytics?: ToastAnalytics[];
  callbacks?: ToastCallback;
  animation?: ToastAnimation;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: Omit<Toast, 'id' | 'createdAt'>) => string;
  dismiss: (id: string) => void;
  dismissGroup: (groupId: string) => void;
  clearToasts: () => void;
  getAnalytics: () => ToastAnalytics[];
  clearAnalytics: () => void;
  setDefaultTheme: (theme: ToastTheme) => void;
  getDefaultTheme: () => ToastTheme | undefined;
  toastTemplate: (template: keyof typeof toastTemplates, options?: Partial<Omit<Toast, 'id' | 'createdAt'>>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  defaultDuration?: number;
  maxToasts?: number;
  persistToasts?: boolean;
  storageKey?: string;
  defaultTheme?: ToastTheme;
  onAnalytics?: (analytics: ToastAnalytics) => void;
}

const STORAGE_KEY = 'toast-storage';
const MAX_STORAGE_SIZE = 1024 * 1024; // 1MB

export function ToastProvider({
  children,
  position = 'bottom-right',
  defaultDuration = 3000,
  maxToasts = 5,
  persistToasts = false,
  storageKey = STORAGE_KEY,
  defaultTheme,
  onAnalytics,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queue, setQueue] = useState<Toast[]>([]);
  const [analytics, setAnalytics] = useState<ToastAnalytics[]>([]);
  const [theme, setTheme] = useState<ToastTheme | undefined>(defaultTheme);

  // Load persisted toasts on mount
  useEffect(() => {
    if (persistToasts) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          if (stored.length > MAX_STORAGE_SIZE) {
            console.warn('Stored toasts exceed maximum size, clearing storage');
            localStorage.removeItem(storageKey);
            return;
          }

          const parsed = JSON.parse(stored);
          const validToasts = parsed
            .filter((toast: any) => {
              const isValid = (
                toast &&
                typeof toast === 'object' &&
                typeof toast.id === 'string' &&
                typeof toast.title === 'string' &&
                typeof toast.createdAt === 'number'
              );
              if (!isValid) {
                console.warn('Invalid toast found in storage:', toast);
              }
              return isValid;
            })
            .map((toast: any) => ({
              ...toast,
              createdAt: new Date(toast.createdAt).getTime(),
            }));

          setToasts(validToasts);
        }
      } catch (error) {
        console.error('Failed to load persisted toasts:', error);
        // Clear corrupted storage
        localStorage.removeItem(storageKey);
      }
    }
  }, [persistToasts, storageKey]);

  // Save toasts to storage when they change
  useEffect(() => {
    if (persistToasts) {
      try {
        const toastsToStore = toasts.filter(t => t.persistent);
        const serialized = JSON.stringify(toastsToStore);
        
        if (serialized.length > MAX_STORAGE_SIZE) {
          console.warn('Toasts exceed maximum storage size, removing oldest toasts');
          const oldestToasts = toastsToStore
            .sort((a, b) => a.createdAt - b.createdAt)
            .slice(0, Math.floor(toastsToStore.length / 2));
          setToasts(prev => prev.filter(t => !oldestToasts.includes(t)));
          return;
        }

        localStorage.setItem(storageKey, serialized);
      } catch (error) {
        console.error('Failed to persist toasts:', error);
      }
    }
  }, [toasts, persistToasts, storageKey]);

  const processQueue = useCallback(() => {
    if (queue.length > 0 && toasts.length < maxToasts) {
      const nextToast = queue[0];
      setToasts(prev => [...prev, nextToast]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, toasts.length, maxToasts]);

  useEffect(() => {
    processQueue();
  }, [processQueue]);

  const toast = useCallback((options: Omit<Toast, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      createdAt: Date.now(),
      ...options,
    };

    if (toasts.length >= maxToasts) {
      setQueue(prev => [...prev, newToast]);
    } else {
      setToasts(prev => [...prev, newToast]);
    }

    return id;
  }, [toasts.length, maxToasts]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
    setQueue([]);
  }, []);

  const dismissGroup = useCallback((groupId: string) => {
    setToasts(prev => prev.filter(toast => toast.groupId !== groupId));
    setQueue(prev => prev.filter(toast => toast.groupId !== groupId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const getAnalytics = useCallback(() => {
    return analytics;
  }, [analytics]);

  const clearAnalytics = useCallback(() => {
    setAnalytics([]);
  }, []);

  const setDefaultTheme = useCallback((newTheme: ToastTheme) => {
    setTheme(newTheme);
  }, []);

  const getDefaultTheme = useCallback(() => {
    return theme;
  }, [theme]);

  const toastTemplate = useCallback((template: keyof typeof toastTemplates, options?: Partial<Omit<Toast, 'id' | 'createdAt'>>) => {
    try {
      const toastOptions = createToastWithTemplate(template, options);
      if (!toastOptions) {
        console.warn(`Template "${template}" not found`);
        return '';
      }
      return toast(toastOptions);
    } catch (error) {
      console.error('Error creating toast from template:', error);
      return '';
    }
  }, [toast]);

  const value = useMemo(() => ({
    toasts,
    toast,
    dismiss,
    dismissGroup,
    clearToasts: dismissAll,
    getAnalytics,
    clearAnalytics,
    setDefaultTheme,
    getDefaultTheme,
    toastTemplate,
  }), [
    toasts,
    toast,
    dismiss,
    dismissGroup,
    dismissAll,
    getAnalytics,
    clearAnalytics,
    setDefaultTheme,
    getDefaultTheme,
    toastTemplate,
  ]);

  return (
    <ToastErrorBoundary>
      <ToastContext.Provider value={value}>
        {children}
        <ToastContainer
          toasts={toasts}
          onDismiss={dismiss}
          position={position}
        />
      </ToastContext.Provider>
    </ToastErrorBoundary>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Convenience methods for common toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'title' | 'description' | 'variant'>>) => ({
    title,
    description,
    variant: 'success' as const,
    ...options,
  }),
  error: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'title' | 'description' | 'variant'>>) => ({
    title,
    description,
    variant: 'destructive' as const,
    ...options,
  }),
  info: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'title' | 'description' | 'variant'>>) => ({
    title,
    description,
    variant: 'info' as const,
    ...options,
  }),
  loading: (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'createdAt' | 'title' | 'description' | 'variant'>>) => ({
    title,
    description,
    variant: 'loading' as const,
    ...options,
  }),
  group: (groupId: string, toasts: Array<Omit<Toast, 'id' | 'createdAt' | 'groupId'>>) => ({
    groupId,
    toasts,
  }),
}; 