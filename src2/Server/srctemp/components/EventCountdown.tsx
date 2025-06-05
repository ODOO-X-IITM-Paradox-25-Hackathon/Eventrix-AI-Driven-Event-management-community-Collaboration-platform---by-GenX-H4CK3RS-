
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { T } from '../hooks/useTranslation';

interface EventCountdownProps {
  startTime: string;
  eventName: string;
}

const EventCountdown: React.FC<EventCountdownProps> = ({ startTime, eventName }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(startTime);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      // Assume event lasts 3 hours (can be made configurable)
      const eventEndTime = new Date(eventDate.getTime() + (3 * 60 * 60 * 1000));
      const timeSinceStart = now.getTime() - eventDate.getTime();
      const timeSinceEnd = now.getTime() - eventEndTime.getTime();

      if (timeSinceEnd > 0) {
        // Event has ended
        setIsEventEnded(true);
        setIsEventStarted(false);
        setTimeLeft('');
      } else if (difference <= 0) {
        // Event has started but not ended
        setIsEventStarted(true);
        setIsEventEnded(false);
        const hoursLeft = Math.floor((eventEndTime.getTime() - now.getTime()) / (1000 * 60 * 60));
        const minutesLeft = Math.floor(((eventEndTime.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hoursLeft}h ${minutesLeft}m`);
      } else {
        // Event hasn't started yet
        setIsEventStarted(false);
        setIsEventEnded(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [startTime]);

  if (isEventEnded) {
    return (
      <div className="absolute bottom-2 left-2">
        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <T>EVENT ENDED</T>
        </div>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <T>Event Ended</T>
        </div>
      </div>
    );
  }

  if (isEventStarted) {
    return (
      <div className="absolute bottom-2 left-2">
        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse">
          <Clock className="h-3 w-3" />
          <T>LIVE NOW</T>
        </div>
        {timeLeft && (
          <div className="text-xs text-gray-400 mt-1">
            <T>{`${timeLeft} left`}</T>
          </div>
        )}
      </div>
    );
  }

  if (timeLeft) {
    return (
      <div className="absolute bottom-2 left-2">
        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <T>{`Starts in ${timeLeft}`}</T>
        </div>
      </div>
    );
  }

  return null;
};

export default EventCountdown;
