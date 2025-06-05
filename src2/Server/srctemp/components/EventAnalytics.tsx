import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Event } from '../types';
import { Eye, ThumbsUp, Users, Star, Download, Phone, Mail, ExternalLink, Activity, MessageSquare, TrendingUp, Target, CheckCircle } from 'lucide-react';

interface EventAnalyticsProps {
  event: Event;
}

const EventAnalytics: React.FC<EventAnalyticsProps> = ({ event }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const downloadAttendeeCSV = () => {
    if (!event.attendees) return;
    
    const headers = ['Name', 'Email', 'Guests', 'Registration Date', 'Last Activity'];
    const csvContent = [
      headers.join(','),
      ...event.attendees.map(attendee => [
        attendee.name,
        attendee.email,
        attendee.guests.toString(),
        new Date(attendee.registeredAt).toLocaleDateString(),
        attendee.loginActivity?.length ? attendee.loginActivity[attendee.loginActivity.length - 1].action : 'No activity'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.name}-attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getFeedbackStats = () => {
    if (!event.feedback) return {};
    
    const total = event.feedback.length;
    const categories = event.feedback.reduce((acc, feedback) => {
      acc[feedback.category] = (acc[feedback.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageRating = total > 0 ? event.feedback.reduce((sum, f) => sum + f.rating, 0) / total : 0;
    
    return { total, categories, averageRating };
  };

  const getPredictedSuccessRate = () => {
    const views = event.totalViews || 0;
    const upvotes = event.upvotes || 0;
    const registrations = event.attendees?.length || 0;
    const rating = event.rating || 0;
    
    // Simple algorithm to predict success
    const viewToRegistrationRatio = views > 0 ? (registrations / views) * 100 : 0;
    const engagementScore = views > 0 ? ((upvotes * 2) / views) * 100 : 0;
    const ratingScore = (rating / 5) * 100;
    
    const successRate = Math.min(100, Math.round((viewToRegistrationRatio * 0.4) + (engagementScore * 0.3) + (ratingScore * 0.3)));
    
    return {
      successRate,
      viewToRegistrationRatio: Math.round(viewToRegistrationRatio * 100) / 100,
      engagementScore: Math.round(engagementScore * 100) / 100,
      ratingScore: Math.round(ratingScore * 100) / 100
    };
  };

  const getRecentActivity = () => {
    const activities = event.activities || [];
    return activities.slice(-5).reverse(); // Show last 5 activities
  };

  const getTotalRevenue = () => {
    // Mock calculation - in real app this would come from payment data
    const attendees = event.attendees?.length || 0;
    const averageTicketPrice = 500; // Mock price
    return attendees * averageTicketPrice;
  };

  const feedbackStats = getFeedbackStats();
  const successMetrics = getPredictedSuccessRate();
  const recentActivity = getRecentActivity();
  const totalRevenue = getTotalRevenue();

  return (
    <div className="space-y-6">
      {/* Success Prediction Card */}
      <Card className="border-l-4 border-l-green-500 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Target className="h-5 w-5" />
            Event Success Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Success Rate</span>
                  <span className="text-lg font-bold text-green-600">{successMetrics.successRate}%</span>
                </div>
                <Progress value={successMetrics.successRate} className="h-3" />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">View to Registration:</span>
                  <span className="font-medium">{successMetrics.viewToRegistrationRatio}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Score:</span>
                  <span className="font-medium">{successMetrics.engagementScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating Score:</span>
                  <span className="font-medium">{successMetrics.ratingScore}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Success Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Speaker has strong audience pull</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Good engagement metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Moderate registration rate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
                <p className="text-2xl font-bold dark:text-white">{event.totalViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upvotes</p>
                <p className="text-2xl font-bold dark:text-white">{event.upvotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Registered</p>
                <p className="text-2xl font-bold dark:text-white">{event.attendees?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold dark:text-white">{feedbackStats.averageRating?.toFixed(1) || 'N/A'}</p>
                  <div className="flex">{feedbackStats.averageRating && getRatingStars(feedbackStats.averageRating)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
                <p className="text-2xl font-bold dark:text-white">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Speaker Info */}
            {event.speaker && (
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Speaker</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium dark:text-white">{event.speaker}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      High Audience Pull
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        activity.type === 'reminder' ? 'bg-blue-500' :
                        activity.type === 'update' ? 'bg-yellow-500' :
                        activity.type === 'registration' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="dark:text-white">{activity.description}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Stats */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Registration Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{event.attendees?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Registered Users</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {event.attendees?.reduce((sum, attendee) => sum + attendee.guests, 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Guests</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {(event.attendees?.length || 0) + (event.attendees?.reduce((sum, attendee) => sum + attendee.guests, 0) || 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Expected</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold dark:text-white">Attendee Management</h3>
            <Button onClick={downloadAttendeeCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
          
          <Card className="dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.attendees?.map((attendee) => (
                  <TableRow key={attendee.userId}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.guests}</TableCell>
                    <TableCell>{new Date(attendee.registeredAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {attendee.loginActivity && attendee.loginActivity.length > 0 ? (
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {attendee.loginActivity[attendee.loginActivity.length - 1].action}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(attendee.loginActivity[attendee.loginActivity.length - 1].date).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">No activity</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Confirmed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Event Activity Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.activities?.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'reminder' ? 'bg-blue-500' :
                      activity.type === 'update' ? 'bg-yellow-500' :
                      activity.type === 'registration' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Responses:</span>
                    <span className="font-medium dark:text-white">{feedbackStats.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Rating:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium dark:text-white">{feedbackStats.averageRating?.toFixed(1) || 'N/A'}</span>
                      {feedbackStats.averageRating && (
                        <div className="flex">{getRatingStars(feedbackStats.averageRating)}</div>
                      )}
                    </div>
                  </div>
                  {Object.entries(feedbackStats.categories || {}).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{category}:</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.feedback?.slice(0, 3).map((feedback) => (
                    <div key={feedback.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm dark:text-white">{feedback.userName}</span>
                        <div className="flex">{getRatingStars(feedback.rating)}</div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">"{feedback.comment}"</p>
                      <Badge variant="outline" className="mt-2 text-xs">{feedback.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Tickets Sold:</span>
                    <span className="font-medium dark:text-white">{event.attendees?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Ticket Price:</span>
                    <span className="font-medium dark:text-white">₹500</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue:</span>
                    <span className="font-bold text-green-600">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Confirmed Payments:</span>
                    <span className="font-medium text-green-600">{event.attendees?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Pending Payments:</span>
                    <span className="font-medium text-yellow-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Failed Payments:</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Conversion Rate:</span>
                    <span className="font-medium dark:text-white">{successMetrics.viewToRegistrationRatio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Revenue Per View:</span>
                    <span className="font-medium dark:text-white">₹{((totalRevenue / (event.totalViews || 1)).toFixed(2))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Avg Revenue Per User:</span>
                    <span className="font-medium dark:text-white">₹500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventAnalytics;
