import { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  preferences: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
    favoriteStores: string[];
  };
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  categories: string[];
  tags: string[];
  isFavorite: boolean;
  rating?: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface MealPlan {
  id: string;
  day: string;
  mealType: string;
  recipe: Recipe;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  recipeId?: string;
  price?: number;
  storeId?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationChannel {
  id: string;
  type: 'in-app' | 'calendar' | 'push';
  enabled: boolean;
  settings: {
    sound?: boolean;
    vibration?: boolean;
    calendarSync?: boolean;
    reminderTime?: string;
    calendarProvider?: CalendarProvider;
    priority?: NotificationPriority;
    groupId?: string;
  };
}

export interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  priority?: NotificationPriority;
  groupId?: string;
  actions?: NotificationAction[];
}

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  reminderTime?: string;
  location?: string;
  attendees?: string[];
  recurrence?: RecurrenceRule;
  provider?: CalendarProvider;
  color?: string;
  isAllDay?: boolean;
}

export type CalendarProvider = 'google' | 'apple' | 'outlook' | 'local';

export type NotificationPriority = 'high' | 'normal' | 'low';

export interface NotificationAction {
  id: string;
  label: string;
  handler: () => void;
  icon?: string;
  type: NotificationActionType;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export type NotificationActionType = 
  | 'mark_as_done'
  | 'snooze'
  | 'add_to_calendar'
  | 'delete'
  | 'archive'
  | 'share'
  | 'custom';

export interface NotificationCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultPriority?: NotificationPriority;
  defaultActions?: NotificationActionType[];
}

export interface NotificationTag {
  id: string;
  name: string;
  color?: string;
}

export type ToastVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

export type ToastTheme = {
  background: string;
  text: string;
  border: string;
  icon: string;
  progress: string;
  hover: string;
  active: string;
};

export type ToastAnimation = {
  enter: string;
  exit: string;
  duration: number;
};

export type Toast = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  theme?: ToastTheme;
  animation?: ToastAnimation;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
  createdAt: number;
  onShow?: () => void;
  onDismiss?: () => void;
  onAction?: (action: ToastAction) => void;
};

export type Notification = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  theme?: ToastTheme;
  animation?: ToastAnimation;
  duration?: number;
  persistent?: boolean;
  actions?: (NotificationAction | ToastAction)[];
  createdAt: number;
  onShow?: () => void;
  onDismiss?: () => void;
  onAction?: (action: NotificationAction | ToastAction) => void;
};

export type ToastAction = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: ToastVariant;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  analytics?: {
    category: string;
    action: string;
    label?: string;
  };
};

export type NotificationStatus = 'pending' | 'snoozed' | 'completed' | 'archived';

export interface NotificationHistoryEntry {
  timestamp: number;
  action: NotificationHistoryAction;
  details?: Record<string, any>;
}

export type NotificationHistoryAction = 
  | 'created'
  | 'read'
  | 'snoozed'
  | 'completed'
  | 'archived'
  | 'deleted'
  | 'action_taken';

export interface NotificationGroup {
  id: string;
  title: string;
  priority: NotificationPriority;
  notifications: Notification[];
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  sound: string;
  channels: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  monthsOfYear?: number[];
  endDate?: Date;
  count?: number;
  exceptions?: Date[];
}

export type ToastAnalytics = {
  id: string;
  event: 'show' | 'dismiss' | 'action' | 'hover' | 'click';
  timestamp: number;
  metadata?: Record<string, any>;
};

export type ToastCallback = {
  onShow?: () => void;
  onDismiss?: () => void;
  onAction?: (action: ToastAction) => void;
  onHover?: () => void;
  onLeave?: () => void;
}; 