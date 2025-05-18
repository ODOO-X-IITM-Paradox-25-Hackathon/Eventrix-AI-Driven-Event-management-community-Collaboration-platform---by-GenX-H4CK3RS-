
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RegistrationConfetti from "../components/RegistrationConfetti";
import EventMap from "../components/EventMap";
import EventChatbot from "../components/EventChatbot";
import { getEventById, isUserRegistered, isUserCreator } from "../lib/demoData";
import { formatDate, formatTime } from "../lib/dateUtils";
import { Calendar, MapPin, Clock, Users, ArrowLeft, MessageCircle, MessageSquare, Tag } from "lucide-react";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState(eventId ? getEventById(eventId) : null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userIsRegistered, setUserIsRegistered] = useState(eventId ? isUserRegistered(eventId) : false);
  const [userIsCreator, setUserIsCreator] = useState(eventId ? isUserCreator(eventId) : false);
  const [showChatbot, setShowChatbot] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      const fetchedEvent = getEventById(eventId);
      setEvent(fetchedEvent);
      setUserIsRegistered(isUserRegistered(eventId));
      setUserIsCreator(isUserCreator(eventId));
    }
  }, [eventId]);

  const handleRegister = () => {
    setIsRegistering(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsRegistering(false);
      setUserIsRegistered(true);
      setShowConfetti(true);
      
      toast({
        title: "Registration Successful!",
        description: `You have successfully registered for "${event?.name}".`,
      });
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'tech':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cultural':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'outdoor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'wellness':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="eventrix-container text-center py-12">
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Event not found</h2>
          <p className="mb-6 dark:text-gray-300">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {showConfetti && userIsRegistered && <RegistrationConfetti />}
      
      <main className="eventrix-container">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-eventrix dark:text-gray-300 dark:hover:text-eventrix-light"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Image */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 h-auto">
              <div className="aspect-w-16 aspect-h-9 w-full relative">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-[400px] object-cover"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryColor(event.category)} capitalize text-sm px-3 py-1`}>
                    {event.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Event Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-full dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{event.name}</h1>
              
              {/* Event Time */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="mt-1">
                  <Calendar className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Date & Time</div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {formatDate(event.startTime)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>
              </div>
              
              {/* Event Location */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Location</div>
                  <div className="text-gray-600 dark:text-gray-300">{event.location}</div>
                </div>
              </div>
              
              {/* Registration Period */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="mt-1">
                  <Clock className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Registration</div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Open until {formatDate(event.registrationEnd)}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex items-start space-x-3 mb-6">
                  <div className="mt-1">
                    <Tag className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Tags</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs dark:text-gray-300 dark:border-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Chat with AI about this event */}
              <Button 
                onClick={toggleChatbot}
                variant="outline"
                className="w-full mb-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI about this event
              </Button>
              
              {/* Engagement Button */}
              <Button 
                onClick={() => navigate(`/events/${eventId}/engage`)}
                variant="outline"
                className="w-full mb-4 border-eventrix text-eventrix hover:bg-eventrix hover:text-white dark:border-eventrix-light dark:text-eventrix-light dark:hover:bg-eventrix-dark"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Event Chat & Engagement
              </Button>
              
              {/* Registration Button or Status */}
              {!userIsCreator && !userIsRegistered && (
                <Button 
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full bg-eventrix hover:bg-eventrix-hover dark:bg-eventrix-dark dark:hover:bg-eventrix"
                >
                  {isRegistering ? "Registering..." : "Register for Event"}
                </Button>
              )}
              
              {!userIsCreator && userIsRegistered && (
                <div className="bg-green-50 text-green-700 rounded-md p-3 flex items-center dark:bg-green-900/30 dark:text-green-400">
                  <div className="mr-2 bg-green-100 rounded-full p-1 dark:bg-green-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>You're registered for this event!</span>
                </div>
              )}
              
              {userIsCreator && (
                <div className="bg-blue-50 text-blue-700 rounded-md p-3 flex items-center dark:bg-blue-900/30 dark:text-blue-400">
                  <div className="mr-2 bg-blue-100 rounded-full p-1 dark:bg-blue-800">
                    <Users className="h-4 w-4" />
                  </div>
                  <span>You created this event</span>
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Event Description */}
        <Card className="p-6 mt-8 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">About this event</h2>
          <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{event.description}</p>
        </Card>

        {/* Map Component - Only show if user is not the creator */}
        {!userIsCreator && (
          <EventMap eventLocation={event.location} />
        )}
        
        {/* Chatbot */}
        {showChatbot && (
          <EventChatbot 
            event={event} 
            onClose={() => setShowChatbot(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default EventDetails;
