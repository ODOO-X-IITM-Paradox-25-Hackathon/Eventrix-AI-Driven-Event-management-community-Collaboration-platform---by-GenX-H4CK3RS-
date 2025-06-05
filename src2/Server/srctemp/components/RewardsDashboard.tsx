
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, ShoppingBag, Percent, Trophy, Star, Crown } from "lucide-react";

const RewardsDashboard: React.FC = () => {
  const rewards = [
    {
      id: 1,
      title: "Amazon Gift Card",
      description: "₹500 Amazon Gift Voucher",
      type: "gift",
      icon: <Gift className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800",
      earned: true,
      expiresIn: "30 days"
    },
    {
      id: 2,
      title: "Tech Conference Pass",
      description: "Free entry to DevConf 2024",
      type: "event",
      icon: <Trophy className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      earned: true,
      expiresIn: "45 days"
    },
    {
      id: 3,
      title: "Shopping Discount",
      description: "50% off on Flipkart",
      type: "discount",
      icon: <Percent className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      earned: true,
      expiresIn: "15 days"
    },
    {
      id: 4,
      title: "Premium Membership",
      description: "3 months Eventrix Premium",
      type: "premium",
      icon: <Crown className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      earned: false,
      pointsRequired: 500
    },
    {
      id: 5,
      title: "Swiggy Voucher",
      description: "₹300 Food Delivery Credit",
      type: "food",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-red-100 text-red-800",
      earned: true,
      expiresIn: "20 days"
    },
    {
      id: 6,
      title: "Course Access",
      description: "Free Udemy Course (₹2000 value)",
      type: "education",
      icon: <Star className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-800",
      earned: false,
      pointsRequired: 750
    }
  ];

  const earnedRewards = rewards.filter(reward => reward.earned);
  const availableRewards = rewards.filter(reward => !reward.earned);

  return (
    <div className="space-y-6">
      {/* Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Gift className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{earnedRewards.length}</p>
            <p className="text-xs text-gray-600">Rewards Earned</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">1420</p>
            <p className="text-xs text-gray-600">Total Points</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">Gold</p>
            <p className="text-xs text-gray-600">Current Tier</p>
          </CardContent>
        </Card>
      </div>

      {/* Earned Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Your Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedRewards.map((reward) => (
              <div 
                key={reward.id}
                className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${reward.color}`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{reward.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">Active</Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-600 font-medium">✓ Earned</span>
                  <span className="text-xs text-gray-500">Expires in {reward.expiresIn}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <div 
                key={reward.id}
                className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${reward.color} opacity-60`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{reward.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">Locked</Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-orange-600 font-medium">{reward.pointsRequired} points needed</span>
                  <span className="text-xs text-gray-500">Unlock soon!</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsDashboard;
