
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Trophy, Award, Calendar, Target, TrendingUp, Users, Gift } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import RewardsDashboard from "./RewardsDashboard";

const EventAnalyticsDashboard: React.FC = () => {
  // Sample data - this would come from localStorage or API
  const eventCategoryData = [
    { name: 'Tech', value: 15, color: '#3B82F6' },
    { name: 'Music', value: 8, color: '#EF4444' },
    { name: 'Cultural', value: 12, color: '#8B5CF6' },
    { name: 'Outdoor', value: 6, color: '#10B981' },
    { name: 'Wellness', value: 4, color: '#F59E0B' },
  ];

  const monthlyData = [
    { month: 'Jan', attended: 4, created: 1, points: 120 },
    { month: 'Feb', attended: 6, created: 2, points: 180 },
    { month: 'Mar', attended: 8, created: 1, points: 240 },
    { month: 'Apr', attended: 5, created: 3, points: 200 },
    { month: 'May', attended: 7, created: 2, points: 210 },
    { month: 'Jun', attended: 9, created: 1, points: 270 },
  ];

  const achievements = [
    { 
      title: "Tech Enthusiast", 
      description: "Attended 15+ tech events", 
      icon: <Trophy className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      earned: true
    },
    { 
      title: "Event Creator", 
      description: "Created 5+ events", 
      icon: <Award className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      earned: true
    },
    { 
      title: "Networking Pro", 
      description: "Connected with 50+ attendees", 
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      earned: false
    },
    { 
      title: "Hackathon Winner", 
      description: "Won 3+ hackathons", 
      icon: <Target className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-800",
      earned: true
    },
  ];

  const stats = {
    totalEvents: 45,
    eventsCreated: 8,
    totalPoints: 1420,
    hackathonsWon: 3,
    rewardsEarned: 12,
    currentRank: "Gold"
  };

  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="rewards" className="flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Rewards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
              <p className="text-xs text-gray-600">Events Attended</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{stats.eventsCreated}</p>
              <p className="text-xs text-gray-600">Events Created</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <p className="text-xs text-gray-600">Total Points</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">{stats.hackathonsWon}</p>
              <p className="text-xs text-gray-600">Hackathons Won</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{stats.rewardsEarned}</p>
              <p className="text-xs text-gray-600">Rewards Earned</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-gold-500" />
              </div>
              <p className="text-2xl font-bold">{stats.currentRank}</p>
              <p className="text-xs text-gray-600">Current Rank</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Categories Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Event Participation by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eventCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity & Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attended" fill="#3B82F6" name="Events Attended" />
                  <Bar dataKey="created" fill="#10B981" name="Events Created" />
                  <Bar dataKey="points" fill="#F59E0B" name="Points Earned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${achievement.earned ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${achievement.color}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      {achievement.earned && (
                        <Badge variant="outline" className="text-xs mt-1">Earned</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Attended "React Conference 2024"</p>
                  <p className="text-xs text-gray-600">Earned 50 points • 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Won "AI Hackathon Challenge"</p>
                  <p className="text-xs text-gray-600">Earned 200 points • 1 week ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Created "Machine Learning Workshop"</p>
                  <p className="text-xs text-gray-600">Gained 15 attendees • 2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rewards">
        <RewardsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default EventAnalyticsDashboard;
