
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const ChatInterface: React.FC<{ eventId?: string }> = ({ eventId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate receiving messages
  useEffect(() => {
    // Demo messages
    const demoMessages = [
      {
        id: "1",
        message: "Welcome to the event chat! Ask questions or share your thoughts here.",
        sender: "EventHost",
        timestamp: new Date(Date.now() - 3600000),
        isCurrentUser: false,
      },
      {
        id: "2",
        message: "Looking forward to this event! Anyone here from Chennai?",
        sender: "TamilUser",
        timestamp: new Date(Date.now() - 1800000),
        isCurrentUser: false,
      }
    ];
    
    setMessages(demoMessages);
    
    // Simulate receiving a new message after 5 seconds
    const timer = setTimeout(() => {
      const newIncomingMessage = {
        id: Date.now().toString(),
        message: "Don't forget to check out the Q&A section for important updates!",
        sender: "EventHost",
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages(prev => [...prev, newIncomingMessage]);
      
      toast({
        title: "New message",
        description: "You have a new message in the chat"
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      message: newMessage,
      sender: "You",
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.timestamp}
            isCurrentUser={msg.isCurrentUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-eventrix hover:bg-eventrix-hover"
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
