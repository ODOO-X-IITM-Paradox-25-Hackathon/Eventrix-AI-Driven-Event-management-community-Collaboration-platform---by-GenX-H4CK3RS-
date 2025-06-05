import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import InteractiveChatbot from "../components/InteractiveChatbot";
import GrievanceArena from "../components/GrievanceArena";
import IssueBoxSection from "../components/IssueBox/IssueBoxSection";
import CookieConsent from "../components/CookieConsent";
import CrowdfundingDapp from "../components/CrowdfundingDapp";
import EntertainmentBooking from "../components/EntertainmentBooking";
import { getAllStoredEvents, searchStoredEvents, filterStoredEventsByCategory, initializeNewEventTypes } from "../lib/eventStorage";
import { getAllCategories } from "../lib/demoData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { T } from "../hooks/useTranslation";

const Index = () => {
  const { user } = useAuth();
  const [allEvents, setAllEvents] = useState(getAllStoredEvents());
  const [filteredEvents, setFilteredEvents] = useState(getAllStoredEvents());
  const categories = ["all", "emergency", "lost & found", ...getAllCategories(), "liked", "upvoted", "past", "attended", "missed", "drafts"];
  const [activeCategory, setActiveCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize new event types on component mount
  useEffect(() => {
    const initialized = localStorage.getItem('newEventTypesInitialized');
    if (!initialized) {
      initializeNewEventTypes();
      localStorage.setItem('newEventTypesInitialized', 'true');
      setAllEvents(getAllStoredEvents());
    }
  }, []);

  const getLikedEvents = () => {
    const likedEventIds = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    return allEvents.filter(event => likedEventIds.includes(event.id));
  };

  const getUpvotedEvents = () => {
    return allEvents.filter(event => localStorage.getItem(`upvoted_${event.id}`));
  };

  const getPastEvents = () => {
    const now = new Date();
    return allEvents.filter(event => new Date(event.endTime) < now);
  };

  const getAttendedEvents = () => {
    const attendedEventIds = JSON.parse(localStorage.getItem('attendedEvents') || '[]');
    return allEvents.filter(event => attendedEventIds.includes(event.id));
  };

  const getMissedEvents = () => {
    const registeredEventIds = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    const attendedEventIds = JSON.parse(localStorage.getItem('attendedEvents') || '[]');
    const now = new Date();
    return allEvents.filter(event => 
      registeredEventIds.includes(event.id) && 
      !attendedEventIds.includes(event.id) &&
      new Date(event.endTime) < now
    );
  };

  const getDraftEvents = () => {
    const drafts = JSON.parse(localStorage.getItem('draftEvents') || '[]');
    const eventDrafts = JSON.parse(localStorage.getItem('eventCreationDrafts') || '[]');
    return [...drafts, ...eventDrafts];
  };

  const getEmergencyEvents = () => {
    const emergencyEventIds = JSON.parse(localStorage.getItem('emergencyEvents') || '["emergency1", "emergency2"]');
    return allEvents.filter(event => 
      emergencyEventIds.includes(event.id) || 
      event.tags?.some(tag => 
        tag.toLowerCase().includes('emergency') || 
        tag.toLowerCase().includes('urgent') || 
        tag.toLowerCase().includes('important') ||
        tag.toLowerCase().includes('alert')
      ) ||
      event.category.toLowerCase() === 'emergency'
    ).filter(event => 
      !event.category.toLowerCase().includes('tech') && 
      !event.category.toLowerCase().includes('music')
    );
  };

  const getLostAndFoundEvents = () => {
    const lostFoundEventIds = JSON.parse(localStorage.getItem('lostFoundEvents') || '["lost1", "lost2", "lost3"]');
    return allEvents.filter(event => 
      lostFoundEventIds.includes(event.id) || 
      event.tags?.some(tag => 
        tag.toLowerCase().includes('lost') || 
        tag.toLowerCase().includes('found') || 
        tag.toLowerCase().includes('missing')
      ) ||
      event.name.toLowerCase().includes('lost') ||
      event.name.toLowerCase().includes('found') ||
      event.description.toLowerCase().includes('lost') ||
      event.description.toLowerCase().includes('found') ||
      event.category.toLowerCase() === 'lost & found'
    );
  };

  const getEventsByCategory = (category: string) => {
    switch (category) {
      case "emergency":
        return getEmergencyEvents();
      case "lost & found":
        return getLostAndFoundEvents();
      case "liked":
        return getLikedEvents();
      case "upvoted":
        return getUpvotedEvents();
      case "past":
        return getPastEvents();
      case "attended":
        return getAttendedEvents();
      case "missed":
        return getMissedEvents();
      case "drafts":
        return getDraftEvents();
      case "all":
        return allEvents;
      default:
        return allEvents.filter(event => event.category.toLowerCase() === category.toLowerCase());
    }
  };

  const applyDateFilter = (eventList) => {
    if (dateFilter === "all") return eventList;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
    const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return eventList.filter(event => {
      const eventStartDate = new Date(event.startTime);
      const eventEndDate = new Date(event.endTime);
      
      switch (dateFilter) {
        case "today":
          return (eventStartDate >= today && eventStartDate < tomorrow) || 
                 (eventStartDate <= now && eventEndDate >= today);
        case "tomorrow":
          return (eventStartDate >= tomorrow && eventStartDate < dayAfterTomorrow) ||
                 (eventStartDate <= tomorrow && eventEndDate >= tomorrow);
        case "this-week":
          return (eventStartDate >= today && eventStartDate < thisWeekEnd) ||
                 (eventStartDate <= today && eventEndDate >= today);
        default:
          return true;
      }
    });
  };

  const applySearchFilter = (eventList) => {
    if (!searchQuery.trim()) return eventList;

    const query = searchQuery.toLowerCase();
    return eventList.filter(event => {
      const nameMatch = event.name && typeof event.name === 'string' && event.name.toLowerCase().includes(query);
      const descMatch = event.description && typeof event.description === 'string' && event.description.toLowerCase().includes(query);
      const locationMatch = event.location && typeof event.location === 'string' && event.location.toLowerCase().includes(query);
      const categoryMatch = event.category && typeof event.category === 'string' && event.category.toLowerCase().includes(query);
      
      const tagMatch = event.tags && Array.isArray(event.tags) && 
        event.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query));
      
      const organizerMatch = event.organizer && (
        (typeof event.organizer === 'object' && event.organizer.name && 
         typeof event.organizer.name === 'string' && event.organizer.name.toLowerCase().includes(query)) ||
        (typeof event.organizer === 'string' && event.organizer.toLowerCase().includes(query))
      );
      
      return nameMatch || descMatch || locationMatch || categoryMatch || tagMatch || organizerMatch;
    });
  };

  const updateFilteredEvents = () => {
    console.log('Updating filtered events...');
    console.log('Active category:', activeCategory);
    console.log('Search query:', searchQuery);
    console.log('Date filter:', dateFilter);

    let categoryEvents = getEventsByCategory(activeCategory);
    console.log('Events after category filter:', categoryEvents.length);

    let dateFilteredEvents = applyDateFilter(categoryEvents);
    console.log('Events after date filter:', dateFilteredEvents.length);

    let searchFilteredEvents = applySearchFilter(dateFilteredEvents);
    console.log('Events after search filter:', searchFilteredEvents.length);

    setFilteredEvents(searchFilteredEvents);
  };

  const handleSearch = (query: string) => {
    console.log('Search query received:', query);
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    console.log('Category changed to:', category);
    setActiveCategory(category);
    localStorage.setItem('lastCategoryFilter', category);
  };

  useEffect(() => {
    updateFilteredEvents();
  }, [activeCategory, dateFilter, distanceFilter, searchQuery, allEvents]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAllEvents(getAllStoredEvents());
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "emergency":
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-semibold">Emergency ‼️</span>
          </div>
        );
      case "lost & found":
        return (
          <div className="flex items-center gap-1">
            <Search className="h-4 w-4 text-orange-500" />
            <span className="text-orange-600 font-semibold">Lost & Found 🔍</span>
          </div>
        );
      case "liked":
        return "❤️ Liked";
      case "upvoted":
        return "👍 Upvoted";
      case "past":
        return "📅 Past";
      case "attended":
        return "✅ Attended";
      case "missed":
        return "❌ Missed";
      case "drafts":
        return "📝 Drafts";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <CookieConsent />
      
      <main className="eventrix-container">
        <Tabs defaultValue="events" className="w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <T>Welcome to Eventrix</T>, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              <T>Discover exciting events happening around you or create your own to share with the community.</T>
            </p>
            
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5">
              <TabsTrigger value="events"><T>All Events</T></TabsTrigger>
              <TabsTrigger value="entertainment"><T>Entertainment</T></TabsTrigger>
              <TabsTrigger value="issuebox"><T>Issuebox</T></TabsTrigger>
              <TabsTrigger value="gia"><T>GIA</T></TabsTrigger>
              <TabsTrigger value="crowdfunding"><T>Crowdfunding</T></TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">
            {/* Search */}
            <SearchBar onSearch={handleSearch} />

            {/* Advanced Filters */}
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                🔍 <T>Filter Events</T>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    📅 <T>Date Range</T>
                  </label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🗓️ <T>All Dates</T></SelectItem>
                      <SelectItem value="today">📅 <T>Today</T></SelectItem>
                      <SelectItem value="tomorrow">📆 <T>Tomorrow</T></SelectItem>
                      <SelectItem value="this-week">📋 <T>This Week</T></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    📍 <T>Distance</T>
                  </label>
                  <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🌍 <T>All Distances</T></SelectItem>
                      <SelectItem value="1km">📍 <T>Within 1 km</T></SelectItem>
                      <SelectItem value="3km">🚶 <T>Within 3 km</T></SelectItem>
                      <SelectItem value="5km">🚴 <T>Within 5 km</T></SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    🔎 <T>Current Search</T>
                  </label>
                  <Input
                    placeholder="Search events, categories, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Filter Results Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <T>Showing</T> {filteredEvents.length} <T>events</T> {activeCategory !== 'all' ? `${activeCategory}` : ''} 
                  {dateFilter !== 'all' ? ` ${dateFilter}` : ''}
                  {searchQuery ? ` "${searchQuery}"` : ''}
                </p>
              </div>
            </div>

            {/* Emergency Events Notice */}
            {activeCategory === "emergency" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-200 font-semibold">
                    <T>Emergency & High Priority Events</T>
                  </span>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-2 text-sm">
                  <T>These events require immediate attention and are highlighted for priority visibility.</T>
                </p>
              </div>
            )}

            {/* Lost & Found Events Notice */}
            {activeCategory === "lost & found" && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 dark:text-orange-200 font-semibold">
                    <T>Lost & Found Events - Prompt Action Required &lt;24 hrs</T>
                  </span>
                </div>
                <p className="text-orange-700 dark:text-orange-300 mt-2 text-sm">
                  <T>Help find lost items or report found items. These posts are highlighted for 24 hours to increase visibility.</T>
                </p>
              </div>
            )}

            {/* Category Filters */}
            <div className="mb-6">
              <Tabs 
                defaultValue="all" 
                value={activeCategory}
                onValueChange={handleCategoryChange}
                className="w-full"
              >
                <TabsList className="w-full overflow-x-auto flex-nowrap justify-start sm:justify-center grid-cols-4 lg:grid-cols-8">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className={`capitalize whitespace-nowrap ${
                        category === "emergency" 
                          ? "bg-red-100 text-red-800 border border-red-300 data-[state=active]:bg-red-200 dark:bg-red-900 dark:text-red-200" 
                          : category === "lost & found"
                          ? "bg-orange-100 text-orange-800 border border-orange-300 data-[state=active]:bg-orange-200 dark:bg-orange-900 dark:text-orange-200"
                          : ""
                      }`}
                    >
                      {getCategoryDisplay(category)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard event={event} />
                  {/* Emergency Badge Overlay with URGENT tag */}
                  {activeCategory === "emergency" && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-red-600 text-white border-white border-2 shadow-lg animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <T>URGENT</T>
                      </Badge>
                    </div>
                  )}
                  {/* Lost & Found Badge Overlay with urgent action required */}
                  {activeCategory === "lost & found" && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-orange-600 text-white border-white border-2 shadow-lg animate-pulse">
                        <Search className="h-3 w-3 mr-1" />
                        &lt;24 HRS
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {activeCategory === "emergency" ? (
                    <>
                      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <T>No emergency events found</T>
                    </>
                  ) : activeCategory === "lost & found" ? (
                    <>
                      <Search className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <T>No lost & found events found</T>
                    </>
                  ) : (
                    <T>No events found</T>
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchQuery ? (
                    <T>No events match your search</T>
                  ) : activeCategory === "emergency" ? (
                    <T>No urgent or emergency events at the moment.</T>
                  ) : activeCategory === "lost & found" ? (
                    <T>No lost & found posts at the moment.</T>
                  ) : activeCategory === "liked" ? (
                    <T>Start liking events to see them here!</T>
                  ) : activeCategory === "upvoted" ? (
                    <T>Start upvoting events to see them here!</T>
                  ) : activeCategory === "drafts" ? (
                    <T>Create a draft event to see it here!</T>
                  ) : (
                    <T>Try adjusting your search or browse all events.</T>
                  )}
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    setDateFilter("all");
                  }}
                  className="px-4 py-2 bg-eventrix text-white dark:bg-eventrix-dark rounded-md hover:bg-eventrix-hover transition-colors"
                >
                  <T>Clear All Filters</T>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="entertainment">
            <EntertainmentBooking />
          </TabsContent>

          <TabsContent value="issuebox">
            <IssueBoxSection />
          </TabsContent>

          <TabsContent value="gia">
            <GrievanceArena />
          </TabsContent>

          <TabsContent value="crowdfunding">
            <CrowdfundingDapp />
          </TabsContent>
        </Tabs>
      </main>

      {/* Interactive Chatbot */}
      <InteractiveChatbot />
    </div>
  );
};

export default Index;
