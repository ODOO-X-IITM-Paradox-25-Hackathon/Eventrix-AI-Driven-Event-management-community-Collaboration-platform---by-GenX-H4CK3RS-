
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  replies: number;
  category: string;
  tags?: string[];
  onClick: () => void;
}

const ForumPost: React.FC<ForumPostProps> = ({
  id,
  title,
  content,
  author,
  timestamp,
  likes,
  replies,
  category,
  tags = [],
  onClick
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'announcement':
        return 'bg-red-100 text-red-800';
      case 'question':
        return 'bg-blue-100 text-blue-800';
      case 'discussion':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Truncate content if it's too long
  const truncatedContent = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author}`} />
            <AvatarFallback>{author.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Badge className={getCategoryColor(category)}>{category}</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{truncatedContent}</p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between py-3 text-sm text-gray-500">
        <div>
          <span className="font-medium">{author}</span> • {formatDate(timestamp)}
        </div>
        
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> {replies}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForumPost;
