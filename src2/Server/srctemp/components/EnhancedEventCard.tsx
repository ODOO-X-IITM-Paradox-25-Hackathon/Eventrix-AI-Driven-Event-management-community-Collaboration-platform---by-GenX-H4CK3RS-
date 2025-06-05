
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { Calendar, MapPin, Clock, Tag, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EnhancedEventCardProps {
  event: Event;
}

const EnhancedEventCard: React.FC<EnhancedEventCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'paid' | 'unpaid' | 'registered-not-paid' | 'not-registered'>('not-registered');
  const [showRegisterAnimation, setShowRegisterAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check registration status from localStorage
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    const paidEvents = JSON.parse(localStorage.getItem('paidEvents') || '[]');
    
    if (registeredEvents.includes(event.id)) {
      if (paidEvents.includes(event.id)) {
        setRegistrationStatus('paid');
      } else {
        setRegistrationStatus('registered-not-paid');
      }
    } else {
      setRegistrationStatus('not-registered');
    }

    // Random animation trigger for unregistered events
    if (registrationStatus === 'not-registered') {
      const interval = setInterval(() => {
        setShowRegisterAnimation(Math.random() > 0.7);
        setTimeout(() => setShowRegisterAnimation(false), 2000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [event.id, registrationStatus]);

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to registered events
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    if (!registeredEvents.includes(event.id)) {
      registeredEvents.push(event.id);
      localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      setRegistrationStatus('registered-not-paid');
    }
  };

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate payment
    const paidEvents = JSON.parse(localStorage.getItem('paidEvents') || '[]');
    if (!paidEvents.includes(event.id)) {
      paidEvents.push(event.id);
      localStorage.setItem('paidEvents', JSON.stringify(paidEvents));
      setRegistrationStatus('paid');
    }
  };

  const reportSpam = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle spam reporting
    console.log(`Reported event ${event.id} as spam`);
  };

  const addToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    // Create calendar URLs
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.name)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    // For demonstration, we'll open Google Calendar
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
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">✅ Paid</Badge>;
      case 'registered-not-paid':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">⏳ Payment Pending</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">❌ Unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "event-card cursor-pointer h-auto group relative",
        isHovered && "event-card-hovered",
        showRegisterAnimation && registrationStatus === 'not-registered' && "animate-pulse ring-2 ring-eventrix"
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
            {event.category}
          </Badge>
        </div>

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
            📅 Add to Calendar
          </Button>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4 bg-white dark:bg-gray-800 transition-all duration-300">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100 truncate group-hover:text-eventrix dark:group-hover:text-eventrix-light">
          {event.name}
        </h3>
        
        {!isHovered ? (
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
              {getFormattedDate(event.startTime)}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
              {event.location}
            </div>
            
            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {event.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
              {event.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-2 h-4 w-4 text-eventrix dark:text-eventrix-light" />
              {getFormattedDate(event.startTime)}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              {registrationStatus === 'not-registered' && (
                <Button 
                  size="sm"
                  className={cn(
                    "flex-1 bg-eventrix hover:bg-eventrix-hover text-white",
                    showRegisterAnimation && "animate-bounce"
                  )}
                  onClick={handleRegister}
                >
                  {showRegisterAnimation ? "🎉 Register Now!" : "Register"}
                </Button>
              )}
              
              {registrationStatus === 'registered-not-paid' && (
                <Button 
                  size="sm"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={handlePayment}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Pay Now
                </Button>
              )}
              
              {registrationStatus === 'paid' && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="flex-1 border-green-500 text-green-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}`);
                  }}
                >
                  View Details
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={reportSpam}
                className="text-red-500 hover:text-red-700"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Register Animation for Unregistered Events */}
      {showRegisterAnimation && registrationStatus === 'not-registered' && (
        <div className="absolute -top-2 -right-2 animate-bounce">
          <div className="bg-eventrix text-white text-xs px-2 py-1 rounded-full shadow-lg">
            Register Now! 🎉
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedEventCard;
