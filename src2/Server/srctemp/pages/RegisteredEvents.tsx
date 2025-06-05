
import React, { useState } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getUserRegisteredEvents } from "../lib/demoData";
import { CalendarCheck, Crown, Star, Trophy, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VIPStatusBadge from "../components/VIPStatusBadge";
import { calculateVIPStatus, getVIPBenefits } from "../utils/vipCalculator";

const RegisteredEvents = () => {
  const events = getUserRegisteredEvents();
  
  // Mock VIP data - in real app, this would come from user profile/API
  const vipMetrics = {
    eventsAttended: 42,
    eventsCreated: 8,
    totalRewards: 12,
    speakerEvents: 5,
    maxAudiencePulled: 250,
    loyaltyScore: 85,
    subscriptionTier: 'basic' as const
  };

  const vipTier = calculateVIPStatus(vipMetrics);
  const vipBenefits = getVIPBenefits(vipTier);

  // Filter events by payment status
  const paidEvents = events.filter(event => {
    const paidEventsList = JSON.parse(localStorage.getItem('paidEvents') || '[]');
    return paidEventsList.includes(event.id);
  });

  const unpaidEvents = events.filter(event => {
    const paidEventsList = JSON.parse(localStorage.getItem('paidEvents') || '[]');
    return !paidEventsList.includes(event.id);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <CalendarCheck className="h-8 w-8 text-eventrix mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Registered Events
            </h1>
          </div>
          <VIPStatusBadge tier={vipTier} className="text-sm" />
        </div>

        {/* VIP Rewards Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4 mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Royal VIP Rewards
              </h2>
              <p className="text-purple-700 dark:text-purple-300">
                Your current tier: {vipTier.charAt(0).toUpperCase() + vipTier.slice(1)} VIP
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Events Attended</span>
              </div>
              <p className="text-2xl font-bold text-eventrix">{vipMetrics.eventsAttended}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-gold-500" />
                <span className="font-semibold">Total Rewards</span>
              </div>
              <p className="text-2xl font-bold text-eventrix">{vipMetrics.totalRewards}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Loyalty Score</span>
              </div>
              <p className="text-2xl font-bold text-eventrix">{vipMetrics.loyaltyScore}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Your VIP Benefits:</h3>
            <div className="flex flex-wrap gap-2">
              {vipBenefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-800 dark:text-purple-200">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Events Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events ({events.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid Events ({paidEvents.length})</TabsTrigger>
            <TabsTrigger value="unpaid">Registered & Unpaid ({unpaidEvents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} showRegisteredStatus={true} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="paid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidEvents.map((event) => (
                <EventCard key={event.id} event={event} showRegisteredStatus={true} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unpaid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unpaidEvents.map((event) => (
                <EventCard key={event.id} event={event} showRegisteredStatus={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No registered events
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You haven't registered for any events yet. Explore events to find ones you'd like to attend.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RegisteredEvents;
