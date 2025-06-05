
import React from "react";
import Header from "../components/Header";
import IITMEventsMap from "../components/IITMEventsMap";

const EventsMap = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Events Map</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover events happening near IIT Madras within a 5km radius</p>
        </div>
        
        <IITMEventsMap />
      </main>
    </div>
  );
};

export default EventsMap;
