import React from 'react';
import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { formatDuration, formatRelativeTime } from '@/lib/utils';
import { ToastTheme, ToastAnalytics, ToastAction, ToastCallback, ToastAnimation } from '@/lib/types';
import { animations } from '@/lib/toastTemplates';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'info' | 'loading';
  onDismiss: (id: string) => void;
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

// Default themes
const defaultThemes: Record<string, ToastTheme> = {
  default: {
    background: 'bg-white dark:bg-gray-800',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'text-gray-500 dark:text-gray-400',
    progress: 'bg-gray-200 dark:bg-gray-700',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    active: 'active:bg-gray-100 dark:active:bg-gray-600',
  },
  destructive: {
    background: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-900 dark:text-red-100',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500 dark:text-red-400',
    progress: 'bg-red-200 dark:bg-red-800',
    hover: 'hover:bg-red-100 dark:hover:bg-red-800',
    active: 'active:bg-red-200 dark:active:bg-red-700',
  },
  success: {
    background: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-500 dark:text-green-400',
    progress: 'bg-green-200 dark:bg-green-800',
    hover: 'hover:bg-green-100 dark:hover:bg-green-800',
    active: 'active:bg-green-200 dark:active:bg-green-700',
  },
  info: {
    background: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500 dark:text-blue-400',
    progress: 'bg-blue-200 dark:bg-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-800',
    active: 'active:bg-blue-200 dark:active:bg-blue-700',
  },
  loading: {
    background: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-200 dark:border-gray-700',
    icon: 'text-gray-500 dark:text-gray-400',
    progress: 'bg-gray-200 dark:bg-gray-700',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    active: 'active:bg-gray-200 dark:active:bg-gray-700',
  },
};

// Memoize the Toast component to prevent unnecessary re-renders
export const Toast = memo(function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  duration = 3000,
  showProgress = true,
  icon,
  actions,
  createdAt,
  priority,
  groupId,
  persistent,
  theme,
  analytics,
  callbacks,
  animation = animations.fadeIn,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const startTime = useRef(Date.now());
  const remainingTime = useRef(duration);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const dismissTimeout = useRef<NodeJS.Timeout>();

  // Track analytics
  const trackAnalytics = useCallback((event: ToastAnalytics['event'], metadata?: Record<string, any>) => {
    if (analytics) {
      const newAnalytics: ToastAnalytics = {
        id,
        event,
        timestamp: Date.now(),
        metadata,
      };
      analytics.push(newAnalytics);
    }
  }, [analytics, id]);

  // Cleanup function to clear all timeouts and intervals
  const cleanup = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current);
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cleanup();
      onDismiss(id);
      trackAnalytics('dismiss', { reason: 'keyboard' });
    }
  }, [id, onDismiss, cleanup, trackAnalytics]);

  useEffect(() => {
    const element = toastRef.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (element) {
        element.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleKeyDown]);

  // Fade in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      trackAnalytics('show');
      callbacks?.onShow?.();
    }, 100);
    return () => clearTimeout(timer);
  }, [callbacks, trackAnalytics]);

  // Progress bar
  useEffect(() => {
    if (duration <= 0 || !showProgress || persistent) return;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(newProgress);
    };

    progressInterval.current = setInterval(updateProgress, 10);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [duration, showProgress, persistent]);

  // Auto-dismiss with animation
  useEffect(() => {
    if (duration <= 0 || persistent) return;

    dismissTimeout.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        cleanup();
        onDismiss(id);
        trackAnalytics('dismiss', { reason: 'auto' });
        callbacks?.onDismiss?.();
      }, animation.duration); // Wait for exit animation
    }, duration);

    return () => {
      if (dismissTimeout.current) {
        clearTimeout(dismissTimeout.current);
      }
    };
  }, [duration, id, onDismiss, persistent, cleanup, callbacks, trackAnalytics, animation.duration]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleMouseEnter = useCallback(() => {
    if (!persistent) {
      setIsPaused(true);
      remainingTime.current = duration * (progress / 100);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    trackAnalytics('hover');
    callbacks?.onHover?.();
  }, [duration, persistent, progress, callbacks, trackAnalytics]);

  const handleMouseLeave = useCallback(() => {
    if (!persistent) {
      setIsPaused(false);
      startTime.current = Date.now() - (duration - remainingTime.current);
    }
    callbacks?.onLeave?.();
  }, [duration, persistent, callbacks]);

  const handleDismiss = useCallback(() => {
    cleanup();
    onDismiss(id);
    trackAnalytics('dismiss', { reason: 'manual' });
    callbacks?.onDismiss?.();
  }, [cleanup, id, onDismiss, callbacks, trackAnalytics]);

  const handleActionClick = useCallback((action: ToastAction) => {
    if (action.requiresConfirmation && !showConfirmation) {
      setShowConfirmation(action.label);
      return;
    }

    if (action.onClick) {
      action.onClick();
      trackAnalytics('action', {
        action: action.analytics?.action,
        category: action.analytics?.category,
        label: action.analytics?.label,
      });
      callbacks?.onAction?.(action);
      if (!persistent) {
        handleDismiss();
      }
    }
    setShowConfirmation(null);
  }, [persistent, handleDismiss, callbacks, trackAnalytics, showConfirmation]);

  const currentTheme = theme || defaultThemes[variant];

  return (
    <div
      ref={toastRef}
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        'hover:scale-[1.02] active:scale-[0.98]',
        'transform transition-all duration-300 ease-in-out',
        isVisible ? animation.enter : animation.exit,
        currentTheme.background,
        currentTheme.text,
        currentTheme.border,
        currentTheme.hover,
        currentTheme.active,
      )}
      role="alert"
      aria-live="assertive"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start gap-3">
        {icon || <div className={currentTheme.icon}>{getIcon(variant)}</div>}
        <div className="grid gap-1">
          <div className="text-sm font-semibold">{title}</div>
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {actions && (
            <div className="mt-2 flex flex-wrap gap-2">
              {actions.map((action) => (
                <div key={action.label}>
                  {showConfirmation === action.label ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{action.confirmationMessage}</span>
                      <button
                        className={cn(
                          'text-sm font-medium',
                          getActionVariantStyles(action.variant)
                        )}
                        onClick={() => handleActionClick(action)}
                      >
                        Confirm
                      </button>
                      <button
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmation(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className={cn(
                        'text-sm font-medium',
                        getActionVariantStyles(action.variant)
                      )}
                      onClick={() => handleActionClick(action)}
                    >
                      {action.icon && (
                        <span className="mr-1">
                          {typeof action.icon === 'function' ? React.createElement(action.icon, { className: 'h-4 w-4' }) : action.icon}
                        </span>
                      )}
                      {action.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {createdAt && (
            <div className="mt-1 text-xs text-gray-500">
              {formatRelativeTime(new Date(createdAt))}
            </div>
          )}
        </div>
      </div>
      <button
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200',
          variant === 'destructive' && 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200'
        )}
        onClick={handleDismiss}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
      {showProgress && duration > 0 && !persistent && (
        <div className={cn('absolute bottom-0 left-0 h-1', currentTheme.progress)}>
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
});

function getIcon(variant: ToastProps['variant']) {
  switch (variant) {
    case 'destructive':
      return <AlertCircle className="h-5 w-5" />;
    case 'success':
      return <CheckCircle className="h-5 w-5" />;
    case 'info':
      return <Info className="h-5 w-5" />;
    case 'loading':
      return <Loader2 className="h-5 w-5 animate-spin" />;
    default:
      return <Info className="h-5 w-5" />;
  }
}

function getActionVariantStyles(variant?: ToastAction['variant']) {
  switch (variant) {
    case 'primary':
      return 'text-primary hover:text-primary/90';
    case 'secondary':
      return 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200';
    case 'destructive':
      return 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200';
    default:
      return 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200';
  }
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success' | 'info' | 'loading';
    duration?: number;
    showProgress?: boolean;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
    createdAt: number;
    priority?: number;
    groupId?: string;
    persistent?: boolean;
  }>;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Memoize the ToastContainer to prevent unnecessary re-renders
export const ToastContainer = memo(function ToastContainer({ 
  toasts, 
  onDismiss,
  position = 'bottom-right'
}: ToastContainerProps) {
  const positions = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  // Sort toasts by priority and creation time
  const sortedToasts = [...toasts].sort((a, b) => {
    if (a.priority !== b.priority) {
      return (b.priority ?? 0) - (a.priority ?? 0);
    }
    return b.createdAt - a.createdAt;
  });

  return (
    <div 
      className={cn(
        'fixed z-50 flex flex-col gap-2 p-4',
        positions[position]
      )}
      role="region"
      aria-label="Notifications"
    >
      {sortedToasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}); 