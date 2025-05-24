import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RecipeReviewsProps {
  recipeId: string;
  initialReviews?: Review[];
  onReviewAdded?: (review: Review) => void;
}

export function RecipeReviews({ recipeId, initialReviews = [], onReviewAdded }: RecipeReviewsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement review submission
      const newReview: Review = {
        id: Date.now().toString(),
        userId: 'current-user-id', // TODO: Get from auth context
        userName: 'Current User', // TODO: Get from auth context
        rating: newRating,
        comment: newComment,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [...prev, newReview]);
      onReviewAdded?.(newReview);
      setNewRating(0);
      setNewComment('');

      toast({
        title: 'Success',
        description: 'Review submitted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
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
          <div>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`h-5 w-5 ${
                    rating <= averageRating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setNewRating(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                {rating <= (hoveredRating || newRating) ? (
                  <StarIcon className="h-6 w-6 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="h-6 w-6 text-gray-300" />
                )}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Write your review..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmitReview}
            disabled={isLoading || newRating === 0}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Submit Review'}
          </Button>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`h-4 w-4 ${
                          rating <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 