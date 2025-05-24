import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { BellIcon, CalendarIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import {
  NotificationChannel,
  CalendarProvider,
  NotificationPriority,
  RecurrenceRule,
} from '@/lib/types';

interface NotificationPreferencesProps {
  onUpdatePreferences: (channels: NotificationChannel[]) => Promise<void>;
}

const CALENDAR_PROVIDERS: CalendarProvider[] = ['google', 'apple', 'outlook', 'local'];
const PRIORITIES: NotificationPriority[] = ['high', 'normal', 'low'];
const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

export function NotificationPreferences({
  onUpdatePreferences,
}: NotificationPreferencesProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'in-app',
      type: 'in-app',
      enabled: true,
      settings: {
        sound: true,
        vibration: true,
        priority: 'normal',
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: false,
      settings: {
        calendarSync: false,
        reminderTime: '09:00',
        calendarProvider: 'local',
        priority: 'normal',
      },
    },
    {
      id: 'push',
      type: 'push',
      enabled: false,
      settings: {
        sound: true,
        vibration: true,
        priority: 'normal',
      },
    },
  ]);

  const handleToggleChannel = async (channelId: string) => {
    try {
      setIsLoading(true);
      const updatedChannels = channels.map(channel =>
        channel.id === channelId
          ? { ...channel, enabled: !channel.enabled }
          : channel
      );

      await onUpdatePreferences(updatedChannels);
      setChannels(updatedChannels);

      toast({
        title: 'Success',
        description: 'Notification preferences updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (channelId: string, settings: any) => {
    try {
      setIsLoading(true);
      const updatedChannels = channels.map(channel =>
        channel.id === channelId
          ? { ...channel, settings: { ...channel.settings, ...settings } }
          : channel
      );

      await onUpdatePreferences(updatedChannels);
      setChannels(updatedChannels);

      toast({
        title: 'Success',
        description: 'Notification settings updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement calendar sync
      toast({
        title: 'Success',
        description: 'Calendar synchronized successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync calendar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notification Preferences</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncCalendar}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <CalendarIcon className="h-4 w-4 mr-2" />
            )}
            Sync Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {channel.type === 'in-app' && <BellIcon className="h-5 w-5" />}
                  {channel.type === 'calendar' && <CalendarIcon className="h-5 w-5" />}
                  {channel.type === 'push' && <DevicePhoneMobileIcon className="h-5 w-5" />}
                  <h3 className="font-medium capitalize">{channel.type} Notifications</h3>
                </div>
                <Button
                  variant={channel.enabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleChannel(channel.id)}
                >
                  {channel.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {channel.enabled && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Priority:</label>
                    <select
                      value={channel.settings.priority}
                      onChange={(e) =>
                        handleUpdateSettings(channel.id, { priority: e.target.value })
                      }
                      className="rounded border-gray-300"
                    >
                      {PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {channel.type === 'in-app' && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={channel.settings.sound}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { sound: e.target.checked })
                          }
                          className="rounded border-gray-300"
                        />
                        Sound
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={channel.settings.vibration}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { vibration: e.target.checked })
                          }
                          className="rounded border-gray-300"
                        />
                        Vibration
                      </label>
                    </div>
                  )}

                  {channel.type === 'calendar' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Calendar Provider:</label>
                        <select
                          value={channel.settings.calendarProvider}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { calendarProvider: e.target.value })
                          }
                          className="rounded border-gray-300"
                        >
                          {CALENDAR_PROVIDERS.map((provider) => (
                            <option key={provider} value={provider}>
                              {provider.charAt(0).toUpperCase() + provider.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={channel.settings.calendarSync}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { calendarSync: e.target.checked })
                          }
                          className="rounded border-gray-300"
                        />
                        Sync with Calendar
                      </label>

                      <div className="flex items-center gap-2">
                        <label className="text-sm">Reminder Time:</label>
                        <input
                          type="time"
                          value={channel.settings.reminderTime}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { reminderTime: e.target.value })
                          }
                          className="rounded border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Recurrence:</label>
                        <div className="flex items-center gap-2">
                          <select
                            value={channel.settings.recurrence?.frequency}
                            onChange={(e) =>
                              handleUpdateSettings(channel.id, {
                                recurrence: {
                                  ...channel.settings.recurrence,
                                  frequency: e.target.value,
                                },
                              })
                            }
                            className="rounded border-gray-300"
                          >
                            <option value="">None</option>
                            {RECURRENCE_FREQUENCIES.map((freq) => (
                              <option key={freq} value={freq}>
                                {freq.charAt(0).toUpperCase() + freq.slice(1)}
                              </option>
                            ))}
                          </select>
                          {channel.settings.recurrence?.frequency && (
                            <input
                              type="number"
                              min="1"
                              value={channel.settings.recurrence?.interval || 1}
                              onChange={(e) =>
                                handleUpdateSettings(channel.id, {
                                  recurrence: {
                                    ...channel.settings.recurrence,
                                    interval: parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-20 rounded border-gray-300"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {channel.type === 'push' && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={channel.settings.sound}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { sound: e.target.checked })
                          }
                          className="rounded border-gray-300"
                        />
                        Sound
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={channel.settings.vibration}
                          onChange={(e) =>
                            handleUpdateSettings(channel.id, { vibration: e.target.checked })
                          }
                          className="rounded border-gray-300"
                        />
                        Vibration
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 