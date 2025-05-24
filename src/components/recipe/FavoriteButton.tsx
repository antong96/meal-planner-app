import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ recipeId, initialIsFavorite = false, onToggle }: FavoriteButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement favorite toggle
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      onToggle?.(newIsFavorite);
      toast({
        title: 'Success',
        description: newIsFavorite ? 'Recipe added to favorites' : 'Recipe removed from favorites',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : isFavorite ? (
        <HeartIconSolid className="h-5 w-5" />
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
    </Button>
  );
} 