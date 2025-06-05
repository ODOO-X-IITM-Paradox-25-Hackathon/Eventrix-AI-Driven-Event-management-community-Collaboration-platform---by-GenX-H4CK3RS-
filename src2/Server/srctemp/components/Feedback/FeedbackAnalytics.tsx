
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsCard from "./AnalyticsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeedbackAnalyticsProps {
  eventId?: string;
}

const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({ eventId }) => {
  // Sample data for analytics
  const ratingData = [
    { name: 'Overall', rating1: 2, rating2: 5, rating3: 15, rating4: 35, rating5: 43, average: 4.1 },
    { name: 'Content', rating1: 1, rating2: 3, rating3: 12, rating4: 42, rating5: 42, average: 4.2 },
    { name: 'Organization', rating1: 3, rating2: 7, rating3: 20, rating4: 40, rating5: 30, average: 3.9 },
    { name: 'Venue', rating1: 2, rating2: 4, rating3: 10, rating4: 36, rating5: 48, average: 4.2 },
  ];

  const attendeeSatisfactionData = [
    { name: 'Very Satisfied', value: 45 },
    { name: 'Satisfied', value: 30 },
    { name: 'Neutral', value: 15 },
    { name: 'Dissatisfied', value: 7 },
    { name: 'Very Dissatisfied', value: 3 },
  ];

  const recommendationData = [
    { name: 'Definitely', value: 55 },
    { name: 'Probably', value: 25 },
    { name: 'Maybe', value: 12 },
    { name: 'Probably not', value: 5 },
    { name: 'Definitely not', value: 3 },
  ];

  const engagementTrendData = [
    { name: 'Day 1', attendance: 85, participation: 45 },
    { name: 'Day 2', attendance: 92, participation: 62 },
    { name: 'Day 3', attendance: 78, participation: 58 },
    { name: 'Day 4', attendance: 88, participation: 65 },
    { name: 'Day 5', attendance: 95, participation: 75 },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Ravi Krishnan",
      role: "Attendee",
      text: "The event was well-organized and the speakers were knowledgeable. The venue in Coimbatore was excellent!",
      rating: 5
    },
    {
      id: 2,
      name: "Lakshmi Venkat",
      role: "Participant",
      text: "Great content, but the venue in Chennai was a bit crowded. Overall a good experience though.",
      rating: 4
    },
    {
      id: 3,
      name: "Anand Rajesh",
      role: "Sponsor",
      text: "As a sponsor, we got great exposure. The organizers were professional and accommodating.",
      rating: 5
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <AnalyticsCard
              title="Overall Satisfaction"
              description="Attendee satisfaction by category"
              type="bar"
              data={ratingData}
              dataKey="average"
              nameKey="name"
              colors={['#8B5CF6']}
            />
            
            <AnalyticsCard
              title="Attendee Satisfaction"
              description="Overall satisfaction distribution"
              type="pie"
              data={attendeeSatisfactionData}
              dataKey="value"
              nameKey="name"
              colors={['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']}
            />
            
            <AnalyticsCard
              title="Would Recommend"
              description="Likelihood to recommend this event"
              type="pie"
              data={recommendationData}
              dataKey="value"
              nameKey="name"
              colors={['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']}
            />
            
            <AnalyticsCard
              title="Engagement Trend"
              description="Daily attendance and participation"
              type="line"
              data={engagementTrendData}
              dataKey="participation"
              nameKey="name"
              colors={['#8B5CF6']}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {ratingData.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle>{category.name} Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">{category.average.toFixed(1)}/5.0</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(category.average) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const ratingKey = `rating${rating}` as keyof typeof category;
                        const ratingValue = category[ratingKey] as number;
                        const ratingPercentage = ((ratingValue / (category.rating1 + category.rating2 + category.rating3 + category.rating4 + category.rating5)) * 100).toFixed(0);
                        
                        return (
                          <div key={rating} className="flex items-center">
                            <span className="w-3 text-xs">{rating}</span>
                            <svg
                              className="w-4 h-4 text-yellow-400 mx-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                              <div
                                className="bg-eventrix h-2.5 rounded-full"
                                style={{ width: `${ratingPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 w-8">{ratingPercentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="testimonials" className="mt-6">
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-eventrix/5 p-6 md:w-1/3 flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} />
                          <AvatarFallback>{testimonial.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-6 md:w-2/3">
                      <p className="italic">""{testimonial.text}""</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackAnalytics;
