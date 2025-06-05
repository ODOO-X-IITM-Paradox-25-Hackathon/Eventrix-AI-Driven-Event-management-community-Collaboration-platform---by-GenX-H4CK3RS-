import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import EventBreadcrumbs from "../components/EventBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RegistrationConfetti from "../components/RegistrationConfetti";
import EnhancedEventMap from "../components/EnhancedEventMap";
import EventChatbot from "../components/EventChatbot";
import EventAnalytics from "../components/EventAnalytics";
import SocialShare from "../components/SocialShare";
import EventStats from "../components/EventStats";
import FeedbackInterface from "../components/Feedback/FeedbackInterface";
import UserReviews from "../components/UserReviews";
import DynamicEventBackground from "../components/DynamicEventBackground";
import { getEventById, isUserRegistered, isUserCreator } from "../lib/demoData";
import { getAllStoredEvents } from "../lib/eventStorage";
import { formatDate, formatTime } from "../lib/dateUtils";
import { Calendar, MapPin, Clock, Users, ArrowLeft, MessageCircle, MessageSquare, Tag, BarChart3, Star, Share2, CalendarPlus } from "lucide-react";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userIsRegistered, setUserIsRegistered] = useState(false);
  const [userIsCreator, setUserIsCreator] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      let fetchedEvent = getEventById(eventId);
      
      if (!fetchedEvent) {
        const allStoredEvents = getAllStoredEvents();
        fetchedEvent = allStoredEvents.find(e => e.id === eventId);
      }
      
      console.log('Fetched event:', fetchedEvent);
      
      if (fetchedEvent) {
        setEvent(fetchedEvent);
        setUserIsRegistered(isUserRegistered(eventId));
        setUserIsCreator(isUserCreator(eventId));
      }
    }
  }, [eventId]);

  const handleRegister = () => {
    setIsRegistering(true);
    
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

  const addToCalendar = (type: 'google' | 'outlook' | 'apple') => {
    if (!event) return;
    
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    let calendarUrl = '';
    
    switch (type) {
      case 'google':
        calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        break;
      case 'outlook':
        calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.name)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        break;
      case 'apple':
        // Create ICS file for Apple Calendar
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Eventrix//Event//EN
BEGIN:VEVENT
UID:${event.id}@eventrix.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
        
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.name}.ics`;
        link.click();
        return;
    }
    
    window.open(calendarUrl, '_blank');
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'tech':
      case 'technology':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cultural':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'outdoor':
      case 'sports':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'wellness':
      case 'health':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'music':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'education':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
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
        {/* Breadcrumbs */}
        <EventBreadcrumbs 
          eventName={event.name} 
          eventCategory={event.category}
        />

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
          {/* Left Column - Dynamic Event Image */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 h-auto relative">
              <DynamicEventBackground category={event.category} eventName={event.name} />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${getCategoryColor(event.category)} capitalize text-sm px-3 py-1`}>
                  {event.category}
                </Badge>
              </div>
            </div>
            
            {/* Interactive Event Stats - Moved below image */}
            <EventStats 
              eventId={event.id}
              totalViews={event.totalViews || 0}
              upvotes={event.upvotes || 0}
              attendeesCount={event.attendees?.length || 0}
              rating={event.rating || 0}
              userHasUpvoted={false}
              userHasLiked={false}
            />
          </div>
          
          {/* Right Column - Event Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-full dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{event.name}</h1>
              
              {/* Add to Calendar Section */}
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarPlus className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Add to Calendar</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCalendar('google')}
                    className="text-xs"
                  >
                    📅 Google
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCalendar('outlook')}
                    className="text-xs"
                  >
                    📅 Outlook
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCalendar('apple')}
                    className="text-xs"
                  >
                    🍎 Apple
                  </Button>
                </div>
              </div>

              {/* Speaker Information */}
              {event.speaker && (
                <div className="flex items-start space-x-3 mb-4">
                  <div className="mt-1">
                    <MessageSquare className="h-5 w-5 text-eventrix dark:text-eventrix-light" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Speaker</div>
                    <div className="text-gray-600 dark:text-gray-300">{event.speaker}</div>
                  </div>
                </div>
              )}
              
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

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Analytics Button - Show for creators */}
                {userIsCreator && (
                  <Button 
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    variant="outline"
                    className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white dark:border-purple-400 dark:text-purple-400"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" /> Event Analytics
                  </Button>
                )}
                
                {/* Share Event Button */}
                <Button 
                  onClick={() => setShowShare(!showShare)}
                  variant="outline"
                  className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share Event
                </Button>
                
                {/* Reviews Button */}
                <Button 
                  onClick={() => setShowReviews(!showReviews)}
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white dark:border-yellow-400 dark:text-yellow-400"
                >
                  <Star className="mr-2 h-4 w-4" /> User Reviews
                </Button>
                
                {/* Feedback Button */}
                <Button 
                  onClick={() => setShowFeedback(!showFeedback)}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400"
                >
                  <Star className="mr-2 h-4 w-4" /> Event Feedback
                </Button>
                
                {/* Chat with AI about this event */}
                <Button 
                  onClick={() => setShowChatbot(!showChatbot)}
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400"
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI about this event
                </Button>
                
                {/* Engagement Button */}
                <Button 
                  onClick={() => navigate(`/events/${eventId}/engage`)}
                  variant="outline"
                  className="w-full border-eventrix text-eventrix hover:bg-eventrix hover:text-white dark:border-eventrix-light dark:text-eventrix-light"
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
              </div>
            </Card>
          </div>
        </div>
        
        {/* Event Description */}
        <Card className="p-6 mt-8 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">About this event</h2>
          <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{event.description}</p>
        </Card>

        {/* Event Analytics - Only show for creators */}
        {userIsCreator && showAnalytics && (
          <div className="mt-8">
            <EventAnalytics event={event} />
          </div>
        )}

        {/* Social Share */}
        {showShare && (
          <div className="mt-8">
            <SocialShare 
              eventId={event.id}
              eventName={event.name}
              eventDescription={event.description}
            />
          </div>
        )}

        {/* User Reviews */}
        {showReviews && (
          <div className="mt-8">
            <UserReviews eventId={event.id} />
          </div>
        )}

        {/* Feedback Interface */}
        {showFeedback && (
          <div className="mt-8">
            <Card className="p-6 dark:bg-gray-800">
              <FeedbackInterface eventId={event.id} />
            </Card>
          </div>
        )}

        {/* Enhanced Map Component */}
        <div className="mt-8">
          <EnhancedEventMap eventLocation={event.location} eventName={event.name} />
        </div>
        
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
