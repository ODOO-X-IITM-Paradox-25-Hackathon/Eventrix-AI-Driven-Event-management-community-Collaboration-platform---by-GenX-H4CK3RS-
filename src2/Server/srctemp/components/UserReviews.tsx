
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  category: 'organization' | 'content' | 'venue' | 'speaker' | 'overall';
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

interface UserReviewsProps {
  eventId: string;
}

const UserReviews: React.FC<UserReviewsProps> = ({ eventId }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c7df?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Excellent speaker and well-organized event. Learned a lot about the latest tech trends. Would definitely attend more events like this!',
      category: 'overall',
      date: '2024-01-15',
      helpful: 12,
      notHelpful: 1,
      verified: true
    },
    {
      id: '2',
      userName: 'Arjun Patel',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 4,
      comment: 'Great content and networking opportunities. The venue was a bit crowded but overall a good experience.',
      category: 'content',
      date: '2024-01-14',
      helpful: 8,
      notHelpful: 2,
      verified: true
    },
    {
      id: '3',
      userName: 'Sneha Kumar',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Amazing speaker! Very knowledgeable and engaging. The Q&A session was particularly insightful.',
      category: 'speaker',
      date: '2024-01-13',
      helpful: 15,
      notHelpful: 0,
      verified: true
    },
    {
      id: '4',
      userName: 'Rahul Singh',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 3,
      comment: 'The event was okay. Content was good but the organization could be improved. Had to wait too long for registration.',
      category: 'organization',
      date: '2024-01-12',
      helpful: 5,
      notHelpful: 3,
      verified: false
    },
    {
      id: '5',
      userName: 'Kavya Nair',
      userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: 4,
      comment: 'Loved the venue and the technical content. The speaker was very interactive and answered all questions thoroughly.',
      category: 'venue',
      date: '2024-01-11',
      helpful: 10,
      notHelpful: 1,
      verified: true
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    category: 'overall' as Review['category']
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review before submitting.",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      rating: newReview.rating,
      comment: newReview.comment,
      category: newReview.category,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0,
      verified: true
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '', category: 'overall' });
    setShowReviewForm(false);

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful: isHelpful ? review.helpful + 1 : review.helpful,
          notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
        };
      }
      return review;
    }));

    toast({
      title: "Thank you!",
      description: `Your feedback has been recorded.`,
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'organization': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'content': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'venue': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'speaker': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'overall': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Event Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{getAverageRating().toFixed(1)}</div>
              <div className="flex justify-center mb-1">{getRatingStars(Math.round(getAverageRating()))}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reviews.filter(r => r.verified).length}</div>
              <div className="text-sm text-gray-600">Verified Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Positive Reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-eventrix hover:bg-eventrix-hover"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 cursor-pointer ${
                        star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                value={newReview.category}
                onChange={(e) => setNewReview({ ...newReview, category: e.target.value as Review['category'] })}
                className="w-full p-2 border rounded-md"
              >
                <option value="overall">Overall Experience</option>
                <option value="speaker">Speaker</option>
                <option value="content">Content</option>
                <option value="organization">Organization</option>
                <option value="venue">Venue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience about this event..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} className="bg-eventrix hover:bg-eventrix-hover">
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Verified
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getCategoryColor(review.category)}`}>
                      {review.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{getRatingStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <button 
                      onClick={() => handleHelpful(review.id, true)}
                      className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                    <button 
                      onClick={() => handleHelpful(review.id, false)}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Not Helpful ({review.notHelpful})
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;
