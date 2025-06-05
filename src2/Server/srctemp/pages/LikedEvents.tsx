
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { getEventById } from "../lib/demoData";
import { getAllStoredEvents } from "../lib/eventStorage";
import { formatDate } from "../lib/dateUtils";

const LikedEvents = () => {
  const [likedEvents, setLikedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const likedEventIds = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    const allEvents = [...getAllStoredEvents()];
    
    // Add demo events
    const demoEventIds = ['1', '2', '3', '4', '5'];
    demoEventIds.forEach(id => {
      const demoEvent = getEventById(id);
      if (demoEvent) {
        allEvents.push(demoEvent);
      }
    });

    const liked = allEvents.filter(event => likedEventIds.includes(event.id));
    setLikedEvents(liked);
  }, []);

  const removeLikedEvent = (eventId: string) => {
    const likedEventIds = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    const updatedLiked = likedEventIds.filter(id => id !== eventId);
    localStorage.setItem('likedEvents', JSON.stringify(updatedLiked));
    
    setLikedEvents(prev => prev.filter(event => event.id !== eventId));
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-eventrix dark:text-gray-300 dark:hover:text-eventrix-light mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Liked Events
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {likedEvents.length} event{likedEvents.length !== 1 ? 's' : ''} you've liked
              </p>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {likedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No liked events yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start exploring events and like the ones you're interested in!
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-eventrix hover:bg-eventrix-hover"
            >
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedEvents.map((event) => (
              <Card 
                key={event.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative">
                  <img 
                    src={event.image || '/placeholder.svg'} 
                    alt={event.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getCategoryColor(event.category)} text-xs px-2 py-1`}>
                      {event.category}
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLikedEvent(event.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-eventrix transition-colors line-clamp-2">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-eventrix" />
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-eventrix" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    {event.attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-eventrix" />
                        <span>{event.attendees.length} registered</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LikedEvents;
