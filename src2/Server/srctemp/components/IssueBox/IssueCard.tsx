
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Issue } from './types';
import { MapPin, ThumbsUp, Clock, User, Phone, Mail, Heart } from 'lucide-react';
import { T } from '../../hooks/useTranslation';

interface IssueCardProps {
  issue: Issue;
  onVote?: (issueId: string) => void;
  onView?: (issue: Issue) => void;
  onLike?: (issueId: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onVote, onView, onLike }) => {
  const likedIssues = JSON.parse(localStorage.getItem('likedIssues') || '[]');
  const isLiked = likedIssues.includes(issue.id);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'road': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'electricity': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'garbage': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'water': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'infrastructure': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '📋';
      default: return '📋';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reported': return 'Reported';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'road': return 'Road';
      case 'electricity': return 'Electricity';
      case 'garbage': return 'Garbage';
      case 'water': return 'Water';
      case 'infrastructure': return 'Infrastructure';
      default: return category;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onView?.(issue)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getCategoryColor(issue.category)}>
            <T>{getCategoryText(issue.category)}</T>
          </Badge>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(issue.status)}>
              <T>{getStatusText(issue.status)}</T>
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(issue.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          {getPriorityIcon(issue.priority)}
          <T>{issue.title}</T>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Issue Image */}
        {issue.images && issue.images.length > 0 && (
          <div className="w-full h-32 rounded-lg overflow-hidden">
            <img 
              src={issue.images[0]} 
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          <T>{issue.description}</T>
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="truncate"><T>{issue.location}</T></span>
          {issue.distance && (
            <Badge variant="outline" className="ml-auto text-xs">
              {issue.distance}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span><T>{issue.reportedBy.name}</T></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(issue.reportedDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Contact Information */}
        {issue.contactInfo && (
          <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <Mail className="h-3 w-3" />
              <span className="truncate">{issue.contactInfo}</span>
            </div>
          </div>
        )}
        
        {issue.tags && issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #<T>{tag}</T>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onVote?.(issue.id);
            }}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            {issue.votes}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(issue);
            }}
          >
            <T>View Details</T>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
