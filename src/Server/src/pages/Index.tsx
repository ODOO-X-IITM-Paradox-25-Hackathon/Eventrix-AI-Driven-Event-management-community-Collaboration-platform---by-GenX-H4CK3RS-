
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import { getAllEvents, searchEvents, getAllCategories, filterByCategory } from "../lib/demoData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(getAllEvents());
  const categories = ["all", ...getAllCategories()];
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      if (activeCategory === "all") {
        setEvents(getAllEvents());
      } else {
        setEvents(filterByCategory(activeCategory));
      }
      return;
    }
    
    setEvents(searchEvents(query));
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setEvents(filterByCategory(category));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Eventrix, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exciting events happening around you or create your own to share with the community.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Category Filters */}
        <div className="mb-6">
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start sm:justify-center">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or browse all events.
            </p>
            <Button
              onClick={() => {
                setActiveCategory("all");
                setEvents(getAllEvents());
              }}
              className="px-4 py-2 bg-eventrix text-white dark:bg-eventrix-dark rounded-md hover:bg-eventrix-hover transition-colors"
            >
              View All Events
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
