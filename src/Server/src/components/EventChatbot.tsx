
import React, { useState, useRef, useEffect } from 'react';
import { Event } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

interface EventChatbotProps {
  event: Event;
  onClose: () => void;
}

const GROK_API_KEY = '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';

const EventChatbot: React.FC<EventChatbotProps> = ({ event, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      content: `Hi ${user?.name}! I'm your AI assistant for "${event.name}". Ask me anything about this event!`, 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare context about the event
      const eventDetails = `
Event Name: ${event.name}
Date: ${new Date(event.startTime).toLocaleDateString()} at ${new Date(event.startTime).toLocaleTimeString()}
Location: ${event.location}
Category: ${event.category}
Tags: ${event.tags.join(', ')}
Description: ${event.description}
      `;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GROK_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an event assistant AI for an event platform called Eventrix. 
You need to answer questions specifically about this event. If asked questions that aren't related to the event or platform, politely redirect to event information.
Here are the details about the current event:
${eventDetails}
User question: ${input}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });
      
      const data = await response.json();
      
      let botResponse = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        botResponse = data.candidates[0].content.parts[0].text;
      } else {
        botResponse = "I'm sorry, I couldn't process that request. Please try again.";
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Grok API:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[600px] shadow-xl z-50 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 bg-eventrix/10 dark:bg-eventrix-dark/20">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Event Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="flex-1 overflow-y-auto p-0 max-h-[400px]">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] p-3 rounded-lg
                  ${message.sender === 'user' 
                    ? 'bg-eventrix text-white dark:bg-eventrix-dark rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'
                  }
                `}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/bot-avatar.png" alt="AI" />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">AI</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium opacity-75">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-eventrix dark:text-eventrix-light" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t dark:border-gray-700 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this event..."
          className="flex-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="bg-eventrix hover:bg-eventrix-hover dark:bg-eventrix-dark"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};

export default EventChatbot;
