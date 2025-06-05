
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, ThumbsUp, Users, Star, Heart } from 'lucide-react';

interface EventStatsProps {
  eventId: string;
  totalViews: number;
  upvotes: number;
  attendeesCount: number;
  rating: number;
  userHasUpvoted?: boolean;
  userHasLiked?: boolean;
}

const EventStats: React.FC<EventStatsProps> = ({
  eventId,
  totalViews,
  upvotes,
  attendeesCount,
  rating,
  userHasUpvoted = false,
  userHasLiked = false
}) => {
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentViews, setCurrentViews] = useState(totalViews);
  const [hasUpvoted, setHasUpvoted] = useState(userHasUpvoted);
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const { toast } = useToast();

  // Increment view count when component mounts
  useEffect(() => {
    const viewKey = `event_viewed_${eventId}`;
    const hasViewed = localStorage.getItem(viewKey);
    
    if (!hasViewed) {
      setCurrentViews(prev => prev + 1);
      localStorage.setItem(viewKey, 'true');
    }
  }, [eventId]);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setCurrentUpvotes(prev => prev - 1);
      setHasUpvoted(false);
      localStorage.removeItem(`upvoted_${eventId}`);
      toast({
        title: "Upvote Removed",
        description: "Your upvote has been removed.",
      });
    } else {
      setCurrentUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      localStorage.setItem(`upvoted_${eventId}`, 'true');
      toast({
        title: "Event Upvoted!",
        description: "Thanks for your positive feedback!",
      });
    }
  };

  const handleLike = () => {
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    
    // Update liked events in localStorage
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    if (newLikedState) {
      if (!likedEvents.includes(eventId)) {
        likedEvents.push(eventId);
      }
    } else {
      const index = likedEvents.indexOf(eventId);
      if (index > -1) {
        likedEvents.splice(index, 1);
      }
    }
    localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
    
    toast({
      title: hasLiked ? "Like Removed" : "Event Liked!",
      description: hasLiked ? "Your like has been removed." : "Thanks for showing love for this event!",
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Views */}
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-lg font-bold">{currentViews}</p>
              <p className="text-xs text-gray-600">Views</p>
            </div>
          </div>

          {/* Interactive Upvote */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={`p-1 ${hasUpvoted ? 'text-green-600' : 'text-gray-500'}`}
            >
              <ThumbsUp className={`h-5 w-5 ${hasUpvoted ? 'fill-current' : ''}`} />
            </Button>
            <div>
              <p className="text-lg font-bold">{currentUpvotes}</p>
              <p className="text-xs text-gray-600">Upvotes</p>
            </div>
          </div>

          {/* Registered Users */}
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-lg font-bold">{attendeesCount}</p>
              <p className="text-xs text-gray-600">Registered</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">{getRatingStars(rating)}</div>
            <div>
              <p className="text-lg font-bold">{rating.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
          </div>

          {/* Interactive Like */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-1 ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
            </Button>
            <div>
              <p className="text-xs text-gray-600">
                {hasLiked ? 'Liked' : 'Like'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventStats;
