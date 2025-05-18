
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
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

  return (
    <div
      className={cn(
        "event-card cursor-pointer h-auto group",
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
            {event.category}
          </Badge>
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
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-eventrix dark:text-eventrix-light border border-eventrix dark:border-eventrix-light hover:bg-eventrix hover:text-white dark:hover:bg-eventrix-dark"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/${event.id}`);
              }}
            >
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
