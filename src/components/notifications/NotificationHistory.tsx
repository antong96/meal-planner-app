import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Notification,
  NotificationStatus,
  NotificationCategory,
  NotificationTag,
} from '@/lib/types';

interface NotificationHistoryProps {
  onRestore: (notificationId: string) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
  categories: NotificationCategory[];
  tags: NotificationTag[];
}

export function NotificationHistory({
  onRestore,
  onDelete,
  categories,
  tags,
}: NotificationHistoryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // TODO: Load notifications from service
    // This would typically be done through a notification service
    // that manages the state of notifications
  }, []);

  const handleRestore = async (notificationId: string) => {
    try {
      setIsLoading(true);
      await onRestore(notificationId);
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, status: 'pending' } : n
      ));
      toast({
        title: 'Success',
        description: 'Notification restored successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore notification.',
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => notification.tags?.includes(tag));

    return matchesSearch && matchesStatus && matchesCategory && matchesTags;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            <CardTitle>Notification History</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as NotificationStatus | 'all')}
                    className="w-full rounded border-gray-300 mt-1"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="snoozed">Snoozed</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded border-gray-300 mt-1"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-1"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            const newTags = e.target.checked
                              ? [...selectedTags, tag.id]
                              : selectedTags.filter(t => t !== tag.id);
                            setSelectedTags(newTags);
                          }}
                          className="rounded border-gray-300"
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
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
                        {notification.category && (
                          <span>Category: {notification.category}</span>
                        )}
                        {notification.tags && notification.tags.length > 0 && (
                          <span>Tags: {notification.tags.join(', ')}</span>
                        )}
                      </div>
                      {notification.history && notification.history.length > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>History:</p>
                          <ul className="list-disc list-inside">
                            {notification.history.map((entry, index) => (
                              <li key={index}>
                                {entry.action} at{' '}
                                {new Date(entry.timestamp).toLocaleString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.status === 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(notification.id)}
                        >
                          Restore
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 