
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { generateEventImage, generateEventDescription } from "../services/aiService";
import { Wand2, Image as ImageIcon, Loader2 } from "lucide-react";

interface AIEventCreatorProps {
  onImageGenerated: (imageUrl: string) => void;
  onDescriptionGenerated: (description: string) => void;
  eventData: {
    name: string;
    category: string;
    location: string;
    description: string;
    image: string;
  };
  onEventDataChange: (field: string, value: string) => void;
}

const AIEventCreator: React.FC<AIEventCreatorProps> = ({
  onImageGenerated,
  onDescriptionGenerated,
  eventData,
  onEventDataChange
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [useAIDescription, setUseAIDescription] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!eventData.category) {
      toast({
        title: "Missing Information",
        description: "Please select an event category first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const prompt = customPrompt || `${eventData.category} event ${eventData.name}`;
      const imageUrl = await generateEventImage({
        prompt,
        category: eventData.category
      });
      
      onImageGenerated(imageUrl);
      onEventDataChange('image', imageUrl);
      
      toast({
        title: "Image Generated",
        description: "AI has generated a suitable image for your event."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!eventData.name || !eventData.category || !eventData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in event name, category, and location first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const description = await generateEventDescription({
        eventName: eventData.name,
        category: eventData.category,
        location: eventData.location
      });
      
      onDescriptionGenerated(description);
      onEventDataChange('description', description);
      
      toast({
        title: "Description Generated",
        description: "AI has created an engaging description for your event."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-eventrix/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-eventrix" />
          AI Event Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Image Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Event Image Generation</h3>
            <Button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              size="sm"
              className="bg-eventrix hover:bg-eventrix-hover"
            >
              {isGeneratingImage ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ImageIcon className="h-4 w-4 mr-2" />
              )}
              Generate Image
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Custom Image Prompt (Optional)</Label>
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., vibrant music festival with neon lights"
            />
          </div>

          {eventData.image && (
            <div className="space-y-2">
              <Label>Generated/Current Image</Label>
              <img 
                src={eventData.image} 
                alt="Event preview" 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* AI Description Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Event Description</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={useAIDescription}
                  onCheckedChange={setUseAIDescription}
                />
                <Label className="text-sm">Use AI Generated Description</Label>
              </div>
            </div>
            {useAIDescription && (
              <Button
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription}
                size="sm"
                className="bg-eventrix hover:bg-eventrix-hover"
              >
                {isGeneratingDescription ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            )}
          </div>

          <Textarea
            value={eventData.description}
            onChange={(e) => onEventDataChange('description', e.target.value)}
            placeholder={useAIDescription ? "AI will generate description..." : "Enter event description"}
            rows={4}
            className="resize-none"
            disabled={useAIDescription && isGeneratingDescription}
          />
        </div>

        {/* Category-based Image Previews */}
        <div className="space-y-2">
          <Label>Preview Images by Category</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { category: 'music', label: 'Music Festival', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { category: 'technology', label: 'Tech Event', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { category: 'education', label: 'Study Session', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
            ].map((item) => (
              <div
                key={item.category}
                className="cursor-pointer border rounded-md overflow-hidden hover:border-eventrix transition-colors"
                onClick={() => {
                  onImageGenerated(item.image);
                  onEventDataChange('image', item.image);
                }}
              >
                <img src={item.image} alt={item.label} className="w-full h-20 object-cover" />
                <p className="text-xs p-1 text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEventCreator;
