
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Trophy, User } from "lucide-react";

type VIPTier = 'royal' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';

interface VIPStatusBadgeProps {
  tier: VIPTier;
  className?: string;
}

const VIPStatusBadge: React.FC<VIPStatusBadgeProps> = ({ tier, className = "" }) => {
  const getVIPConfig = (tier: VIPTier) => {
    switch (tier) {
      case 'royal':
        return {
          icon: <Crown className="h-3 w-3 mr-1" />,
          label: 'Royal VIP',
          className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400'
        };
      case 'platinum':
        return {
          icon: <Star className="h-3 w-3 mr-1" />,
          label: 'Platinum VIP',
          className: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white border-gray-400'
        };
      case 'gold':
        return {
          icon: <Trophy className="h-3 w-3 mr-1" />,
          label: 'Gold VIP',
          className: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-400'
        };
      case 'silver':
        return {
          icon: <Star className="h-3 w-3 mr-1" />,
          label: 'Silver VIP',
          className: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white border-gray-300'
        };
      case 'bronze':
        return {
          icon: <Trophy className="h-3 w-3 mr-1" />,
          label: 'Bronze VIP',
          className: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-600'
        };
      default:
        return {
          icon: <User className="h-3 w-3 mr-1" />,
          label: 'Standard',
          className: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
        };
    }
  };

  const config = getVIPConfig(tier);

  return (
    <Badge className={`${config.className} ${className} font-semibold`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default VIPStatusBadge;
