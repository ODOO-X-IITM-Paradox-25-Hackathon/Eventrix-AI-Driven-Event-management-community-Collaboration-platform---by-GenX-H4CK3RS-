
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface SurveyFormProps {
  eventId?: string;
  onComplete?: () => void;
}

type FormFieldNames = "overall" | "content" | "organization" | "venue" | "feedback";

const SurveyForm: React.FC<SurveyFormProps> = ({ eventId, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      overall: "3",
      content: "3",
      organization: "3",
      venue: "3",
      feedback: "",
    }
  });

  const onSubmit = (data: Record<string, string>) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Survey submitted:', data);
      toast({
        title: "Survey Submitted",
        description: "Thank you for your valuable feedback!"
      });
      setIsSubmitting(false);
      if (onComplete) onComplete();
    }, 1000);
  };

  const renderRatingOptions = (name: FormFieldNames, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              className="flex space-x-1"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <FormItem key={rating} className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value={rating.toString()} id={`${name}-${rating}`} className="sr-only" />
                  </FormControl>
                  <Label
                    htmlFor={`${name}-${rating}`}
                    className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer text-sm 
                      ${field.value === rating.toString() ? 
                        'bg-eventrix text-white' : 
                        'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {rating}
                  </Label>
                  {rating === 1 && <div className="text-xs text-gray-500">Poor</div>}
                  {rating === 5 && <div className="text-xs text-gray-500">Excellent</div>}
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {renderRatingOptions("overall", "Overall event satisfaction")}
          {renderRatingOptions("content", "Content quality")}
          {renderRatingOptions("organization", "Event organization")}
          {renderRatingOptions("venue", "Venue & amenities")}
          
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional comments or suggestions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts about the event..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-eventrix hover:bg-eventrix-hover"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
};

export default SurveyForm;
