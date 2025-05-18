
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Event Created!",
        description: `Your event "${formData.name}" has been created successfully.`,
      });
      setIsSubmitting(false);
      navigate("/my-events");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="eventrix-container">
        <Card className="max-w-4xl mx-auto p-6 shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600">Share your event with the Eventrix community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              
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
                <p className="text-xs text-gray-500">
                  Enter a URL for your event image, or leave blank for a default image
                </p>
              </div>
            </div>
            
            {/* Location Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Location</h2>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Venue<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location or address"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Date and Time Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Date and Time</h2>
              
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
              <h2 className="text-xl font-semibold text-gray-800">Registration Period</h2>
              
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
                className="bg-eventrix hover:bg-eventrix-hover"
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
