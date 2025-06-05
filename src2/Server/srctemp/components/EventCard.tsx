import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { Calendar, MapPin, Clock, Tag, DollarSign, AlertTriangle, CheckCircle, XCircle, Check, CreditCard, Heart, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TicketSelection from "./TicketSelection";
import EventCountdown from "./EventCountdown";
import SpamReportModal from "./SpamReportModal";
import RegistrationConfetti from "./RegistrationConfetti";
import { T } from "../hooks/useTranslation";

interface EventCardProps {
  event: Event;
  showRegisteredStatus?: boolean;
}

type RegistrationStatus = 'paid' | 'unpaid' | 'registered-not-paid' | 'not-registered';

const EventCard: React.FC<EventCardProps> = ({ event, showRegisteredStatus = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('not-registered');
  const [showRegisterAnimation, setShowRegisterAnimation] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [showSpamReport, setShowSpamReport] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check registration status from localStorage
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    const paidEvents = JSON.parse(localStorage.getItem('paidEvents') || '[]');
    
    // Simulate some events being paid events (for demo purposes)
    const paidEventIds = ['1', '3', '5', '7', '8', '9']; // Added 8 and 9 for startup mixer and art exhibition
    setIsPaidEvent(paidEventIds.includes(event.id));
    
    // Special handling for specific events
    if (event.name.toLowerCase().includes('startup networking mixer')) {
      // Startup mixer should show as registered but payment pending
      if (!registeredEvents.includes(event.id)) {
        registeredEvents.push(event.id);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }
      setRegistrationStatus('registered-not-paid');
    } else if (event.name.toLowerCase().includes('art exhibition')) {
      // Art exhibition should show as registered but unpaid
      if (!registeredEvents.includes(event.id)) {
        registeredEvents.push(event.id);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }
      setRegistrationStatus('unpaid');
    } else if (registeredEvents.includes(event.id)) {
      if (paidEvents.includes(event.id)) {
        setRegistrationStatus('paid');
      } else {
        setRegistrationStatus('registered-not-paid');
      }
    } else {
      setRegistrationStatus('not-registered');
    }

    // Check like and upvote status
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    setIsLiked(likedEvents.includes(event.id));
    
    const upvotedStatus = localStorage.getItem(`upvoted_${event.id}`);
    setIsUpvoted(!!upvotedStatus);

    // Get current counts
    const eventLikes = parseInt(localStorage.getItem(`likes_${event.id}`) || '0');
    const eventUpvotes = parseInt(localStorage.getItem(`upvotes_${event.id}`) || '0');
    setLikes(eventLikes);
    setUpvotes(eventUpvotes);

    // Trigger animation for unregistered events (only if not showing registered status)
    if (!registeredEvents.includes(event.id) && !showRegisteredStatus && registrationStatus === 'not-registered') {
      const timer = setTimeout(() => {
        setShowRegisterAnimation(true);
      }, Math.random() * 2000 + 1000);

      return () => clearTimeout(timer);
    }
  }, [event.id, showRegisteredStatus]);

  const handleClick = () => {
    // Store navigation context for breadcrumbs
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category') || localStorage.getItem('lastCategoryFilter') || 'all';
    localStorage.setItem('lastCategoryFilter', categoryFilter);
    
    navigate(`/events/${event.id}`);
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (registrationStatus === 'not-registered') {
      if (isPaidEvent) {
        // Show ticket selection for paid events
        setShowTicketSelection(true);
        return;
      } else {
        // Register for free events
        const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
        registeredEvents.push(event.id);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
        setRegistrationStatus('registered-not-paid');
        setShowRegisterAnimation(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        return;
      }
    } else if (registrationStatus === 'registered-not-paid' && isPaidEvent) {
      // Show payment options for registered but unpaid events
      setShowTicketSelection(true);
      return;
    }
    
    navigate(`/events/${event.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    
    if (isLiked) {
      const updatedLikes = likedEvents.filter((id: string) => id !== event.id);
      localStorage.setItem('likedEvents', JSON.stringify(updatedLikes));
      setLikes(prev => Math.max(0, prev - 1));
      localStorage.setItem(`likes_${event.id}`, Math.max(0, likes - 1).toString());
    } else {
      likedEvents.push(event.id);
      localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
      setLikes(prev => prev + 1);
      localStorage.setItem(`likes_${event.id}`, (likes + 1).toString());
    }
    setIsLiked(!isLiked);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUpvoted) {
      localStorage.removeItem(`upvoted_${event.id}`);
      setUpvotes(prev => Math.max(0, prev - 1));
      localStorage.setItem(`upvotes_${event.id}`, Math.max(0, upvotes - 1).toString());
    } else {
      localStorage.setItem(`upvoted_${event.id}`, 'true');
      setUpvotes(prev => prev + 1);
      localStorage.setItem(`upvotes_${event.id}`, (upvotes + 1).toString());
    }
    setIsUpvoted(!isUpvoted);
  };

  const handleSpamReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSpamReport(true);
  };

  const addToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
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

  const getStatusBadge = () => {
    switch (registrationStatus) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            <T>Paid</T>
          </Badge>
        );
      case 'registered-not-paid':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <T>Payment Pending</T>
          </Badge>
        );
      case 'unpaid':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            <T>Unpaid</T>
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActionButtons = () => {
    const buttons = [];

    // Special handling for startup networking mixer
    if (event.name.toLowerCase().includes('startup networking mixer')) {
      buttons.push(
        <Button
          key="proceed-payment"
          variant="ghost"
          size="sm"
          className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
          onClick={handleRegister}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          <T>Proceed with Payment</T>
        </Button>
      );
    }
    // Special handling for art exhibition (unpaid)
    else if (event.name.toLowerCase().includes('art exhibition')) {
      buttons.push(
        <Button
          key="view-unpaid"
          variant="ghost"
          size="sm"
          className="flex-1 bg-red-600 text-white hover:bg-red-700"
          onClick={handleRegister}
        >
          <XCircle className="h-4 w-4 mr-1" />
          <T>View Event (Unpaid)</T>
        </Button>
      );
    }
    // Register/View Details Button for other events
    else if (registrationStatus === 'not-registered') {
      buttons.push(
        <Button
          key="register"
          variant="ghost"
          size="sm"
          className={`flex-1 ${isPaidEvent ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-eventrix border border-eventrix hover:bg-eventrix hover:text-white'} ${showRegisterAnimation ? 'animate-pulse' : ''}`}
          onClick={handleRegister}
        >
          <T>{isPaidEvent ? 'Select Tickets' : 'Register Now'}</T>
        </Button>
      );
    } else {
      buttons.push(
        <Button
          key="view"
          variant="ghost"
          size="sm"
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleRegister}
        >
          <T>View Event Details</T>
        </Button>
      );
    }

    // Payment Button (for registered but unpaid events, except special cases)
    if (registrationStatus === 'registered-not-paid' && isPaidEvent && 
        !event.name.toLowerCase().includes('startup networking mixer') &&
        !event.name.toLowerCase().includes('art exhibition')) {
      buttons.push(
        <Button
          key="payment"
          variant="ghost"
          size="sm"
          className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
          onClick={handleRegister}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          <T>Proceed to Payment</T>
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div
        className={cn(
          "event-card cursor-pointer h-auto group relative",
          isHovered && "event-card-hovered"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Event Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getCategoryColor(event.category)} capitalize`}>
              <T>{event.category}</T>
            </Badge>
          </div>

          {/* Paid Event Badge */}
          {isPaidEvent && (
            <div className="absolute top-2 left-20">
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                <CreditCard className="h-3 w-3 mr-1" />
                <T>Paid Event</T>
              </Badge>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            {getStatusBadge()}
          </div>

          {/* Add to Calendar Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={addToCalendar}
              className="text-xs"
            >
              📅 <T>Add to Calendar</T>
            </Button>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-4 bg-white dark:bg-gray-800 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100 truncate group-hover:text-eventrix dark:group-hover:text-eventrix-light">
            <T>{event.name}</T>
          </h3>
          
          {!isHovered ? (
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
                {getFormattedDate(event.startTime)}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
                <T>{event.location}</T>
              </div>
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {event.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <T>{tag}</T>
                    </Badge>
                  ))}
                  {event.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Like, Upvote, and Spam Report Section */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </button>
                  
                  <button
                    onClick={handleUpvote}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      isUpvoted ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
                    {upvotes}
                  </button>
                </div>

                <button
                  onClick={handleSpamReport}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Report as spam"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
                <T>{event.description}</T>
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
                {getFormattedDate(event.startTime)}
              </div>
              
              {/* Registration Status Message for Registered Events */}
              {showRegisteredStatus && (registrationStatus === 'paid' || registrationStatus === 'registered-not-paid') && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <Check className="h-4 w-4 mr-2" />
                  <T>You've registered for this event</T>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {getActionButtons()}
              </div>

              {/* Like, Upvote, and Spam Report Section */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </button>
                  
                  <button
                    onClick={handleUpvote}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      isUpvoted ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
                    {upvotes}
                  </button>
                </div>

                <button
                  onClick={handleSpamReport}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Report as spam"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Event Countdown */}
        <EventCountdown startTime={event.startTime} eventName={event.name} />
      </div>

      {/* Ticket Selection Modal */}
      {showTicketSelection && (
        <TicketSelection
          eventId={event.id}
          eventName={event.name}
          onClose={() => setShowTicketSelection(false)}
        />
      )}

      {/* Spam Report Modal */}
      <SpamReportModal
        isOpen={showSpamReport}
        onClose={() => setShowSpamReport(false)}
        eventId={event.id}
        eventName={event.name}
      />

      {/* Registration Confetti */}
      {showConfetti && <RegistrationConfetti />}
    </>
  );
};

export default EventCard;
