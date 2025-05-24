import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  BellIcon,
  PlusIcon,
  TrashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';
import {
  NotificationTemplate,
  NotificationPriority,
  NotificationChannel,
} from '@/lib/types';

interface NotificationTemplatesProps {
  onSaveTemplate: (template: NotificationTemplate) => Promise<void>;
  onDeleteTemplate: (templateId: string) => Promise<void>;
}

const DEFAULT_SOUNDS = [
  { id: 'default', name: 'Default' },
  { id: 'gentle', name: 'Gentle' },
  { id: 'urgent', name: 'Urgent' },
  { id: 'success', name: 'Success' },
  { id: 'warning', name: 'Warning' },
];

export function NotificationTemplates({
  onSaveTemplate,
  onDeleteTemplate,
}: NotificationTemplatesProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    title: '',
    body: '',
    priority: 'normal',
    sound: 'default',
    channels: ['in-app'],
  });
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.body) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const template: NotificationTemplate = {
        id: Date.now().toString(),
        ...newTemplate as NotificationTemplate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await onSaveTemplate(template);
      setTemplates([...templates, template]);
      setNewTemplate({
        title: '',
        body: '',
        priority: 'normal',
        sound: 'default',
        channels: ['in-app'],
      });

      toast({
        title: 'Success',
        description: 'Template created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      await onDeleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast({
        title: 'Success',
        description: 'Template deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySound = (soundId: string) => {
    if (isPlaying === soundId) {
      // Stop playing
      setIsPlaying(null);
      // TODO: Stop sound
    } else {
      setIsPlaying(soundId);
      // TODO: Play sound
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            <CardTitle>Notification Templates</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Create New Template */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-4">Create New Template</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTemplate.title}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, title: e.target.value })
                  }
                  placeholder="Enter template title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Input
                  value={newTemplate.body}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, body: e.target.value })
                  }
                  placeholder="Enter template message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={newTemplate.priority}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        priority: e.target.value as NotificationPriority,
                      })
                    }
                    className="w-full rounded border-gray-300"
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sound</label>
                  <div className="flex gap-2">
                    <select
                      value={newTemplate.sound}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, sound: e.target.value })
                      }
                      className="flex-1 rounded border-gray-300"
                    >
                      {DEFAULT_SOUNDS.map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlaySound(newTemplate.sound!)}
                    >
                      {isPlaying === newTemplate.sound ? (
                        <SpeakerXMarkIcon className="h-4 w-4" />
                      ) : (
                        <SpeakerWaveIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Channels</label>
                <div className="flex gap-2 mt-1">
                  {['in-app', 'push', 'calendar'].map((channel) => (
                    <label
                      key={channel}
                      className="flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        checked={newTemplate.channels?.includes(channel)}
                        onChange={(e) => {
                          const channels = e.target.checked
                            ? [...(newTemplate.channels || []), channel]
                            : (newTemplate.channels || []).filter(c => c !== channel);
                          setNewTemplate({ ...newTemplate, channels });
                        }}
                        className="rounded border-gray-300"
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreateTemplate}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Template
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Existing Templates */}
          <div className="space-y-4">
            <h3 className="font-medium">Existing Templates</h3>
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-sm text-gray-500">{template.body}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Priority: {template.priority}</span>
                  <span>Sound: {template.sound}</span>
                  <span>Channels: {template.channels.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 