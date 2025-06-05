import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AIEventCreator from "../components/AIEventCreator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveEvent } from "../lib/eventStorage";
import { Event } from "../types";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    registrationStartDate: "",
    registrationEndDate: "",
    category: "technology",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageGenerated = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleDescriptionGenerated = (description: string) => {
    setFormData(prev => ({
      ...prev,
      description: description
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const requiredFields = ['name', 'description', 'location', 'startDate', 'startTime'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the event object
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = formData.endDate && formData.endTime 
        ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
        : startDateTime;

      const newEvent: Event = {
        id: `user-event-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        location: formData.location,
        startTime: startDateTime,
        endTime: endDateTime,
        registrationStart: formData.registrationStartDate 
          ? new Date(formData.registrationStartDate).toISOString()
          : new Date().toISOString(),
        registrationEnd: formData.registrationEndDate
          ? new Date(formData.registrationEndDate).toISOString()
          : startDateTime,
        createdBy: "current-user", // In real app, this would be the actual user ID
        createdAt: new Date().toISOString(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        upvotes: 0,
        totalViews: 0,
        followers: 0,
        rating: 0,
        attendees: [],
        feedback: []
      };

      // Save the event to localStorage
      saveEvent(newEvent);

      toast({
        title: "Event Created!",
        description: `Your event "${formData.name}" has been created successfully and is now available for search.`,
      });
      
      setIsSubmitting(false);
      navigate("/");
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        <Card className="max-w-4xl mx-auto p-6 shadow-md dark:bg-gray-800">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Event</h1>
            <p className="text-gray-600 dark:text-gray-300">Share your event with the Eventrix community</p>
          </div>

          {/* AI Event Creator */}
          <div className="mb-8">
            <AIEventCreator
              onImageGenerated={handleImageGenerated}
              onDescriptionGenerated={handleDescriptionGenerated}
              eventData={formData}
              onEventDataChange={handleEventDataChange}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Event Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter event name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category<span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eventrix dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required
                >
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                  <option value="music">Music</option>
                  <option value="food">Food</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. networking, workshop, beginner-friendly"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter a URL for your event image, or use AI generation above
                </p>
              </div>
            </div>
            
            {/* Location Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location</h2>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Venue<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location or address (preferably near IIT Madras)"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Date and Time Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Date and Time</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Start Time<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Registration Period Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Registration Period</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationStartDate" className="text-sm font-medium">
                    Registration Opens
                  </Label>
                  <Input
                    id="registrationStartDate"
                    name="registrationStartDate"
                    type="date"
                    value={formData.registrationStartDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationEndDate" className="text-sm font-medium">
                    Registration Closes
                  </Label>
                  <Input
                    id="registrationEndDate"
                    name="registrationEndDate"
                    type="date"
                    value={formData.registrationEndDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-eventrix hover:bg-eventrix-hover dark:bg-eventrix-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateEvent;
