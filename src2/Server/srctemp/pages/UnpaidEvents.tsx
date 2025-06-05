
import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getUserRegisteredEvents } from "../lib/demoData";
import { AlertTriangle, Clock } from "lucide-react";

const UnpaidEvents = () => {
  const allEvents = getUserRegisteredEvents();
  
  // Filter events that are registered but not paid
  const paidEventIds = JSON.parse(localStorage.getItem('paidEvents') || '[]');
  const unpaidEvents = allEvents.filter(event => !paidEventIds.includes(event.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Title */}
        <div className="mb-8 flex items-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Registered & Unpaid Events
          </h1>
        </div>

        {/* Warning Message */}
        {unpaidEvents.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                You have {unpaidEvents.length} event{unpaidEvents.length > 1 ? 's' : ''} with pending payments
              </span>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Complete your payments to secure your spot in these events.
            </p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unpaidEvents.map((event) => (
            <EventCard key={event.id} event={event} showRegisteredStatus={true} />
          ))}
        </div>

        {/* Empty State */}
        {unpaidEvents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No unpaid events
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All your registered events have been paid for or are free events.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UnpaidEvents;
