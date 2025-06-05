
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SurveyForm from "./SurveyForm";
import FeedbackAnalytics from "./FeedbackAnalytics";
import { useToast } from "@/hooks/use-toast";

interface FeedbackInterfaceProps {
  eventId?: string;
}

const FeedbackInterface: React.FC<FeedbackInterfaceProps> = ({ eventId }) => {
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState("survey");
  const { toast } = useToast();

  const handleSurveyComplete = () => {
    setHasSubmittedFeedback(true);
    setActiveTab("analytics");
    
    toast({
      title: "Analytics unlocked",
      description: "Thank you for your feedback! You can now view the event analytics."
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="survey">Feedback Survey</TabsTrigger>
        <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
      </TabsList>
      
      <TabsContent value="survey" className="mt-6">
        {hasSubmittedFeedback ? (
          <div className="text-center py-8 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Thank You!</h3>
            <p className="text-green-700">Your feedback has been recorded.</p>
          </div>
        ) : (
          <SurveyForm eventId={eventId} onComplete={handleSurveyComplete} />
        )}
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-6">
        <FeedbackAnalytics eventId={eventId} />
      </TabsContent>
    </Tabs>
  );
};

export default FeedbackInterface;
