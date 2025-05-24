import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  TrashIcon,
  BellSlashIcon,
} from '@heroicons/react/24/outline';
import {
  Notification,
  NotificationPriority,
  NotificationAction,
} from '@/lib/types';

interface NotificationCenterProps {
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onSnooze: (notificationId: string, duration: number) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
  onClearAll: () => Promise<void>;
}

const SNOOZE_OPTIONS = [
  { label: '5 minutes', value: 5 * 60 * 1000 },
  { label: '15 minutes', value: 15 * 60 * 1000 },
  { label: '30 minutes', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '2 hours', value: 2 * 60 * 60 * 1000 },
];

export function NotificationCenter({
  onMarkAsRead,
  onSnooze,
  onDelete,
  onClearAll,
}: NotificationCenterProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Load notifications from service
    // This would typically be done through a notification service
    // that manages the state of notifications
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setIsLoading(true);
      await onMarkAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      toast({
        title: 'Success',
        description: 'Notification marked as read.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnooze = async (notificationId: string, duration: number) => {
    try {
      setIsLoading(true);
      await onSnooze(notificationId, duration);
      setSelectedNotification(null);
      toast({
        title: 'Success',
        description: 'Notification snoozed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to snooze notification.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      setIsLoading(true);
      await onDelete(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast({
        title: 'Success',
        description: 'Notification deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      await onClearAll();
      setNotifications([]);
      toast({
        title: 'Success',
        description: 'All notifications cleared.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || !n.read
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              className="rounded border-gray-300"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isLoading || notifications.length === 0}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BellSlashIcon className="h-8 w-8 mx-auto mb-2" />
              <p>No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.read
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'bg-blue-50 dark:bg-blue-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{notification.title}</h4>
                      {notification.priority === 'high' && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.body}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      {notification.groupId && (
                        <span>Group: {notification.groupId}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNotification(
                        selectedNotification === notification.id ? null : notification.id
                      )}
                    >
                      <ClockIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedNotification === notification.id && (
                  <div className="mt-2 flex gap-2">
                    {SNOOZE_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSnooze(notification.id, option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 