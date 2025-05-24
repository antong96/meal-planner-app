import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ShareIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ShareRecipeProps {
  recipeId: string;
  recipeName: string;
  description?: string;
}

export function ShareRecipe({ recipeId, recipeName, description }: ShareRecipeProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [shareableLink, setShareableLink] = useState('');

  const handleEmailShare = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement email sharing
      toast({
        title: 'Success',
        description: `Recipe shared with ${email}`,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement link generation
      const link = `${window.location.origin}/recipes/${recipeId}`;
      setShareableLink(link);
      toast({
        title: 'Success',
        description: 'Shareable link generated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: 'Success',
        description: 'Link copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out this recipe: ${recipeName}${description ? ` - ${description}` : ''}`;
    const url = shareableLink || `${window.location.origin}/recipes/${recipeId}`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Recipe</CardTitle>
        <CardDescription>
          Share "{recipeName}" with others
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleEmailShare}
              disabled={isLoading}
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              {isLoading ? <LoadingSpinner size="sm" /> : 'Share via Email'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleGenerateLink}
              disabled={isLoading}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Generate Shareable Link
            </Button>
          </div>

          {shareableLink && (
            <div className="flex gap-4">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Share on Social Media</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              className="bg-[#1DA1F2] text-white hover:bg-[#1a8cd8]"
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('facebook')}
              className="bg-[#4267B2] text-white hover:bg-[#365899]"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('pinterest')}
              className="bg-[#E60023] text-white hover:bg-[#cc001f]"
            >
              Pinterest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 