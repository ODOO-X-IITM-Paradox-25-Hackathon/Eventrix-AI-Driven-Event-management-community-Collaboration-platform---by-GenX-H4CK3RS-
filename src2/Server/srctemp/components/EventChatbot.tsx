
import React, { useState, useRef, useEffect } from 'react';
import { Event } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Bot, Send, X, Loader2, Map } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { getAllStoredEvents } from '../lib/eventStorage';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

interface EventChatbotProps {
  event: Event;
  onClose: () => void;
}

const GEMINI_API_KEY = 'AIzaSyA7fQKCBtHPQUHGX1nZXDOWiJMlO31-uk8';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBfd1bm_3mxeU8VhNwt2GE9-h0BtMT2Sv4';

const EventChatbot: React.FC<EventChatbotProps> = ({ event, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      content: `Hi ${user?.name}! I'm your AI assistant for "${event.name}". Ask me anything about this event or switch to map mode to see nearby events!`, 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMapMode, setShowMapMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Center map on IIT Madras
    const iitMadras = { lat: 12.9916, lng: 80.2336 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: iitMadras,
      zoom: 13,
    });

    // Get all events and show them on map
    const allEvents = getAllStoredEvents();
    
    allEvents.forEach((eventItem, index) => {
      // For demo purposes, place events randomly around IIT Madras
      const randomLat = iitMadras.lat + (Math.random() - 0.5) * 0.02;
      const randomLng = iitMadras.lng + (Math.random() - 0.5) * 0.02;
      
      const marker = new window.google.maps.Marker({
        position: { lat: randomLat, lng: randomLng },
        map: map,
        title: eventItem.name,
        icon: {
          url: eventItem.id === event.id ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #333;">${eventItem.name}</h3>
            <p style="margin: 0 0 5px 0; color: #666;">${eventItem.location}</p>
            <p style="margin: 0 0 5px 0; color: #666;">${new Date(eventItem.startTime).toLocaleDateString()}</p>
            <span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${eventItem.category}</span>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    // Add user location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      });
    }
  };

  const loadGoogleMaps = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const toggleMapMode = () => {
    setShowMapMode(!showMapMode);
    if (!showMapMode) {
      setTimeout(loadGoogleMaps, 100);
    }
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      const eventDetails = `
Event Name: ${event.name}
Date: ${new Date(event.startTime).toLocaleDateString()} at ${new Date(event.startTime).toLocaleTimeString()}
Location: ${event.location}
Category: ${event.category}
Tags: ${event.tags.join(', ')}
Description: ${event.description}
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an event assistant AI for an event platform called Eventrix. 
You need to answer questions specifically about this event. If asked questions that aren't related to the event or platform, politely redirect to event information.
Here are the details about the current event:
${eventDetails}
User question: ${currentInput}`
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
      console.log('Gemini API Response:', data);
      
      let botResponse = '';
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        botResponse = data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected API response structure:', data);
        botResponse = "I'm sorry, I couldn't process that request. Please try again.";
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
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
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMapMode}
            className="h-8 w-8"
            title={showMapMode ? "Switch to Chat Mode" : "Switch to Map Mode"}
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="flex-1 overflow-y-auto p-0 max-h-[400px]">
        {showMapMode ? (
          <div className="p-4">
            <h4 className="font-medium mb-2 dark:text-gray-100">Nearby Events Map</h4>
            <div 
              ref={mapRef} 
              className="h-[320px] w-full rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700" 
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Red pin: Current event, Blue pins: Other events, Green pin: Your location
            </p>
          </div>
        ) : (
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
        )}
      </CardContent>
      
      {!showMapMode && (
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
      )}
    </Card>
  );
};

export default EventChatbot;
