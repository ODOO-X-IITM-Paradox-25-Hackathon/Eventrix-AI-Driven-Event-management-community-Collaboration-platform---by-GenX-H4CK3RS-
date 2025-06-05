
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  sender, 
  timestamp, 
  isCurrentUser 
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${sender}`} />
          <AvatarFallback>{sender.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className={`rounded-lg px-4 py-2 shadow-sm ${
          isCurrentUser 
            ? 'bg-eventrix text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          <p className="text-sm">{message}</p>
          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-200' : 'text-gray-500'}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
