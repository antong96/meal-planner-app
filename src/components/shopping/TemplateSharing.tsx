import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShoppingListTemplate } from '@/lib/types';
import { ShareIcon, LinkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface TemplateSharingProps {
  template: ShoppingListTemplate;
  onShare: (template: ShoppingListTemplate, emails: string[]) => Promise<void>;
  onGenerateLink: (template: ShoppingListTemplate) => Promise<string>;
}

export function TemplateSharing({
  template,
  onShare,
  onGenerateLink,
}: TemplateSharingProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleShare = async () => {
    if (!emails.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter at least one email address.',
        variant: 'destructive',
      });
      return;
    }

    const emailList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    try {
      setIsLoading(true);
      await onShare(template, emailList);
      setEmails('');
      toast({
        title: 'Success',
        description: 'Template shared successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setIsLoading(true);
      const link = await onGenerateLink(template);
      setShareLink(link);
      toast({
        title: 'Success',
        description: 'Share link generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate share link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Success',
        description: 'Link copied to clipboard.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Share Template</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateLink}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <LinkIcon className="h-4 w-4 mr-2" />
              )}
              Generate Link
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Share with Users</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email addresses (comma-separated)"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                )}
                Share
              </Button>
            </div>
          </div>

          {shareLink && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Anyone with this link can view and import this template.
              </p>
            </div>
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