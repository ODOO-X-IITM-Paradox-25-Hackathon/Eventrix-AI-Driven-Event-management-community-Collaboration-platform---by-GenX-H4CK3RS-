import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Send, X, Loader2, MessageCircle, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { VoiceTranslationService, SUPPORTED_LANGUAGES } from '../services/voiceService';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

const GEMINI_API_KEY = 'AIzaSyA7fQKCBtHPQUHGX1nZXDOWiJMlO31-uk8';

const InteractiveChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceService = useRef(new VoiceTranslationService());
  
  // Only add welcome message when user manually opens the chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Hi ${user?.name || 'there'}! 👋 I'm your Eventrix assistant. Ask me anything about events, technology, or any questions you have!`,
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user?.name]);
  
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      // Translate user input to English for processing if needed
      const englishInput = selectedLanguage !== 'en' 
        ? await voiceService.current.translateText(currentInput, 'en')
        : currentInput;

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
                  text: `You are a helpful assistant for Eventrix, an event management platform. Answer the user's question in a friendly and informative way. If the question is about technology or events, provide clear explanations that help users understand the topic.

User question: ${englishInput}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
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
        botResponse = "I'm sorry, I couldn't process that request. Please try asking something else!";
      }

      // Translate response to selected language if needed
      const translatedResponse = selectedLanguage !== 'en'
        ? await voiceService.current.translateText(botResponse, selectedLanguage)
        : botResponse;
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: translatedResponse,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        voiceService.current.speakText(translatedResponse, selectedLanguage);
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later!",
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    voiceService.current.startVoiceRecognition(
      (transcript) => {
        setInput(transcript);
        setIsListening(false);
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const stopVoiceInput = () => {
    setIsListening(false);
    voiceService.current.stopVoiceRecognition();
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      voiceService.current.stopSpeaking();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-eventrix hover:bg-eventrix-hover shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[700px] shadow-xl z-50 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 bg-eventrix/10 dark:bg-eventrix-dark/20">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Eventrix Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            className="h-8 w-8"
            title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code} className="text-xs">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                      <AvatarFallback className="bg-blue-600 text-white text-xs">🤖</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium opacity-75">Assistant</span>
                    {voiceEnabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0"
                        onClick={() => voiceService.current.speakText(message.content, selectedLanguage)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
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
          placeholder={`Ask me anything in ${SUPPORTED_LANGUAGES[selectedLanguage]}...`}
          className="flex-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          disabled={isLoading || isListening}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={isListening ? stopVoiceInput : startVoiceInput}
          className={isListening ? "bg-red-500 hover:bg-red-600 text-white" : ""}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
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

export default InteractiveChatbot;
