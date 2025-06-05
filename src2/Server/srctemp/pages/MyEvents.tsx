
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getUserCreatedEvents } from "../lib/demoData";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

const MyEvents = () => {
  const events = getUserCreatedEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Title with Action Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <CalendarPlus className="h-8 w-8 text-eventrix mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              My Events
            </h1>
          </div>
          
          <Link to="/create-event">
            <Button className="bg-eventrix hover:bg-eventrix-hover">
              <CalendarPlus className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No events created
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't created any events yet. Create your first event to share with others.
            </p>
            <Link to="/create-event">
              <Button className="bg-eventrix hover:bg-eventrix-hover">
                <CalendarPlus className="mr-2 h-4 w-4" /> Create Your First Event
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyEvents;
