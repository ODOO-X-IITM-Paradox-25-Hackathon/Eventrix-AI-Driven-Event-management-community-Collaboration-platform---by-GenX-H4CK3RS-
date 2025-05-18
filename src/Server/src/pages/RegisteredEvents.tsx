
import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getUserRegisteredEvents } from "../lib/demoData";
import { CalendarCheck } from "lucide-react";

const RegisteredEvents = () => {
  const events = getUserRegisteredEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Title */}
        <div className="mb-8 flex items-center">
          <CalendarCheck className="h-8 w-8 text-eventrix mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Registered Events
          </h1>
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
              No registered events
            </h3>
            <p className="text-gray-600">
              You haven't registered for any events yet. Explore events to find ones you'd like to attend.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RegisteredEvents;
