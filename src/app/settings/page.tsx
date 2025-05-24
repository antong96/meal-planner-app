'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeChange = async (value: string) => {
    try {
      setIsLoading(true);
      setTheme(value);
      // TODO: Save theme preference to user settings
      toast({
        title: 'Success',
        description: 'Theme preference updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update theme preference. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>
            Customize your app preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose your preferred theme for the application
            </p>
            <Select
              value={theme}
              onChange={handleThemeChange}
              options={themeOptions}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your notification preferences
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email updates about your meal plans
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement email notification toggle
                    toast({
                      title: 'Coming Soon',
                      description: 'This feature will be available soon.',
                    });
                  }}
                >
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications on your device
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement push notification toggle
                    toast({
                      title: 'Coming Soon',
                      description: 'This feature will be available soon.',
                    });
                  }}
                >
                  Enable
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Data & Privacy</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your data and privacy settings
            </p>
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement data export
                  toast({
                    title: 'Coming Soon',
                    description: 'This feature will be available soon.',
                  });
                }}
              >
                Export My Data
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // TODO: Implement account deletion
                  toast({
                    title: 'Coming Soon',
                    description: 'This feature will be available soon.',
                  });
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 