import { ToastTheme, ToastAction, ToastAnimation } from '@/lib/types';
import { CheckCircle, AlertCircle, Info, Loader2, Star, Clock, Trash2 } from 'lucide-react';
import React from 'react';

export const animations: Record<string, ToastAnimation> = {
  slideIn: {
    enter: 'animate-slide-in',
    exit: 'animate-slide-out',
    duration: 300,
  },
  fadeIn: {
    enter: 'animate-fade-in',
    exit: 'animate-fade-out',
    duration: 200,
  },
  scaleIn: {
    enter: 'animate-scale-in',
    exit: 'animate-scale-out',
    duration: 250,
  },
  bounceIn: {
    enter: 'animate-bounce-in',
    exit: 'animate-bounce-out',
    duration: 400,
  },
};

export const themePresets: Record<string, ToastTheme> = {
  default: {
    background: 'bg-white dark:bg-gray-800',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'text-gray-500 dark:text-gray-400',
    progress: 'bg-gray-200 dark:bg-gray-700',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-750',
    active: 'active:bg-gray-100 dark:active:bg-gray-700',
  },
  success: {
    background: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-500 dark:text-green-400',
    progress: 'bg-green-200 dark:bg-green-800',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
    active: 'active:bg-green-200 dark:active:bg-green-900/40',
  },
  error: {
    background: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-900 dark:text-red-100',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500 dark:text-red-400',
    progress: 'bg-red-200 dark:bg-red-800',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900/30',
    active: 'active:bg-red-200 dark:active:bg-red-900/40',
  },
  warning: {
    background: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-900 dark:text-yellow-100',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-500 dark:text-yellow-400',
    progress: 'bg-yellow-200 dark:bg-yellow-800',
    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    active: 'active:bg-yellow-200 dark:active:bg-yellow-900/40',
  },
  info: {
    background: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500 dark:text-blue-400',
    progress: 'bg-blue-200 dark:bg-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    active: 'active:bg-blue-200 dark:active:bg-blue-900/40',
  },
  premium: {
    background: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-900 dark:text-purple-100',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-500 dark:text-purple-400',
    progress: 'bg-purple-200 dark:bg-purple-800',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    active: 'active:bg-purple-200 dark:active:bg-purple-900/40',
  },
};

export const actionPresets: Record<string, ToastAction> = {
  view: {
    label: 'View',
    onClick: () => {},
    icon: Info,
  },
  confirm: {
    label: 'Confirm',
    onClick: () => {},
    icon: CheckCircle,
    variant: 'primary',
  },
  delete: {
    label: 'Delete',
    onClick: () => {},
    icon: Trash2,
    variant: 'destructive',
    requiresConfirmation: true,
  },
  schedule: {
    label: 'Schedule',
    onClick: () => {},
    icon: Clock,
    variant: 'secondary',
  },
  favorite: {
    label: 'Favorite',
    onClick: () => {},
    icon: Star,
    variant: 'secondary',
  },
};

export type ToastTemplate = {
  title: string;
  description?: string;
  icon: React.ReactNode;
  theme: ToastTheme;
  animation: ToastAnimation;
  duration: number;
  persistent?: boolean;
  actions?: ToastAction[];
};

export const toastTemplates: Record<string, ToastTemplate> = {
  success: {
    title: 'Success',
    description: 'Operation completed successfully',
    icon: <CheckCircle className="h-5 w-5" />,
    theme: themePresets.success,
    animation: animations.fadeIn,
    duration: 3000,
  },
  error: {
    title: 'Error',
    description: 'An error occurred',
    icon: <AlertCircle className="h-5 w-5" />,
    theme: themePresets.error,
    animation: animations.slideIn,
    duration: 5000,
  },
  warning: {
    title: 'Warning',
    description: 'Please review this action',
    icon: <AlertCircle className="h-5 w-5" />,
    theme: themePresets.warning,
    animation: animations.bounceIn,
    duration: 4000,
  },
  info: {
    title: 'Information',
    description: 'Here is some information',
    icon: <Info className="h-5 w-5" />,
    theme: themePresets.info,
    animation: animations.fadeIn,
    duration: 3000,
  },
  loading: {
    title: 'Loading',
    description: 'Please wait...',
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    theme: themePresets.default,
    animation: animations.scaleIn,
    duration: 0,
    persistent: true,
  },
  notification: {
    title: 'Notification',
    description: 'You have a new notification',
    icon: <Info className="h-5 w-5" />,
    theme: themePresets.premium,
    animation: animations.slideIn,
    duration: 4000,
    actions: [actionPresets.view],
  },
};

export function createToastWithTemplate(
  template: keyof typeof toastTemplates,
  options?: Partial<Omit<ToastTemplate, 'icon' | 'theme' | 'animation'>>
): ToastTemplate {
  const baseTemplate = toastTemplates[template];
  return {
    ...baseTemplate,
    ...options,
  };
} 