
import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getUserRegisteredEvents } from "../lib/demoData";
import { CreditCard, CheckCircle } from "lucide-react";

const PaidEvents = () => {
  const allEvents = getUserRegisteredEvents();
  
  // Filter events that have been paid for
  const paidEventIds = JSON.parse(localStorage.getItem('paidEvents') || '[]');
  const paidEvents = allEvents.filter(event => paidEventIds.includes(event.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Title */}
        <div className="mb-8 flex items-center">
          <CreditCard className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Paid Events
          </h1>
        </div>

        {/* Success Message */}
        {paidEvents.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                You have successfully paid for {paidEvents.length} event{paidEvents.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidEvents.map((event) => (
            <EventCard key={event.id} event={event} showRegisteredStatus={true} />
          ))}
        </div>

        {/* Empty State */}
        {paidEvents.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No paid events
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You haven't paid for any events yet. Register for paid events and complete the payment process.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaidEvents;
