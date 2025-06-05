
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AnswerType {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  isOfficial?: boolean;
}

interface QuestionItemProps {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  likes: number;
  answers: AnswerType[];
  onLike: (id: string) => void;
  userLiked: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  id,
  text,
  author,
  timestamp,
  likes,
  answers,
  onLike,
  userLiked
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author}`} />
            <AvatarFallback>{author.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium">{author}</p>
              <span className="text-xs text-gray-500">{formatDate(timestamp)}</span>
            </div>
            <p className="mt-2">{text}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between py-2">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${userLiked ? 'text-eventrix' : ''}`}
            onClick={() => onLike(id)}
          >
            <ThumbsUp className="h-4 w-4" /> 
            <span>{likes}</span>
          </Button>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> 
                <span>{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</span>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="mt-4 space-y-4 pl-8 border-l-2 border-gray-100">
                {answers.map(answer => (
                  <div key={answer.id} className="relative">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${answer.author}`} />
                        <AvatarFallback>{answer.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{answer.author}</p>
                          {answer.isOfficial && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Official</span>
                          )}
                          <span className="text-xs text-gray-500">{formatDate(answer.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-sm">{answer.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionItem;
