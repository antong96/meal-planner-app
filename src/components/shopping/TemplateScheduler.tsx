import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingListTemplate } from '@/lib/types';
import { CalendarIcon, BellIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TemplateSchedule {
  id: string;
  templateId: string;
  nextRun: Date;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  reminderTime: string;
  reminderDays: number;
  isActive: boolean;
}

interface TemplateSchedulerProps {
  template: ShoppingListTemplate;
  onSchedule: (schedule: TemplateSchedule) => Promise<void>;
  onUpdateSchedule: (scheduleId: string, updates: Partial<TemplateSchedule>) => Promise<void>;
  onDeleteSchedule: (scheduleId: string) => Promise<void>;
}

export function TemplateScheduler({
  template,
  onSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}: TemplateSchedulerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<TemplateSchedule[]>([]);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderDays, setReminderDays] = useState(1);

  const handleCreateSchedule = async () => {
    try {
      setIsLoading(true);
      const schedule: TemplateSchedule = {
        id: Date.now().toString(),
        templateId: template.id,
        nextRun: calculateNextRun(template.frequency),
        frequency: template.frequency,
        reminderTime,
        reminderDays,
        isActive: true,
      };

      await onSchedule(schedule);
      setSchedules([...schedules, schedule]);

      toast({
        title: 'Success',
        description: 'Schedule created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSchedule = async (scheduleId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      await onUpdateSchedule(scheduleId, { isActive });
      setSchedules(schedules.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, isActive }
          : schedule
      ));

      toast({
        title: 'Success',
        description: `Schedule ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      setIsLoading(true);
      await onDeleteSchedule(scheduleId);
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));

      toast({
        title: 'Success',
        description: 'Schedule deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextRun = (frequency: string): Date => {
    const now = new Date();
    switch (frequency) {
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'biweekly':
        return new Date(now.setDate(now.getDate() + 14));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      default:
        return new Date(now.setDate(now.getDate() + reminderDays));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Schedule Template</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateSchedule}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CalendarIcon className="h-4 w-4 mr-2" />
              )}
              Create Schedule
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Time</label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Days Before</label>
              <Input
                type="number"
                min="1"
                max="30"
                value={reminderDays}
                onChange={(e) => setReminderDays(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Active Schedules</h3>
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Next Run: {new Date(schedule.nextRun).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {schedule.frequency} • Reminder at {schedule.reminderTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleSchedule(schedule.id, !schedule.isActive)}
                    >
                      <BellIcon className={`h-4 w-4 ${schedule.isActive ? 'text-primary' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      <ClockIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {schedules.length === 0 && (
            <p className="text-center text-gray-500">No schedules created yet.</p>
          )}

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Template Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {template.name}</p>
              <p><span className="font-medium">Items:</span> {template.items.length}</p>
              <p><span className="font-medium">Frequency:</span> {template.frequency}</p>
              {template.lastUsed && (
                <p>
                  <span className="font-medium">Last Used:</span>{' '}
                  {new Date(template.lastUsed).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 