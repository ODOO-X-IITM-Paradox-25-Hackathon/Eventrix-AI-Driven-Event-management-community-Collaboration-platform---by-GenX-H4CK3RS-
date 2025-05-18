
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "../lib/demoData";
import ChatInterface from "../components/LiveChat/ChatInterface";
import PollInterface from "../components/Polls/PollInterface";
import QAInterface from "../components/QandA/QAInterface";
import ForumInterface from "../components/Forums/ForumInterface";
import FeedbackInterface from "../components/Feedback/FeedbackInterface";

const EventEngagement = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState(eventId ? getEventById(eventId) : null);
  const navigate = useNavigate();

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="eventrix-container text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="eventrix-container py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/events/${eventId}`)}
            className="text-gray-600 hover:text-eventrix"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event Details
          </Button>
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name} - Engagement</h1>
          <p className="text-gray-600">Connect, discuss, and provide feedback for this event.</p>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="polls">Polls</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="min-h-[500px]">
              <ChatInterface eventId={eventId} />
            </TabsContent>
            
            <TabsContent value="polls">
              <PollInterface eventId={eventId} />
            </TabsContent>
            
            <TabsContent value="qa">
              <QAInterface eventId={eventId} />
            </TabsContent>
            
            <TabsContent value="forum">
              <ForumInterface eventId={eventId} />
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackInterface eventId={eventId} />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default EventEngagement;
