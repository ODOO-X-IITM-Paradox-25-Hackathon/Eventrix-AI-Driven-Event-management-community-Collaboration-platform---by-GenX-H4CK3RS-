
export interface VIPMetrics {
  eventsAttended: number;
  eventsCreated: number;
  totalRewards: number;
  speakerEvents: number;
  maxAudiencePulled: number;
  loyaltyScore: number;
  subscriptionTier: 'premium' | 'basic' | 'free';
}

export type VIPTier = 'royal' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';

export const calculateVIPStatus = (metrics: VIPMetrics): VIPTier => {
  let score = 0;

  // Events attended (max 40 points)
  score += Math.min(metrics.eventsAttended * 2, 40);

  // Events created (max 30 points)
  score += Math.min(metrics.eventsCreated * 5, 30);

  // Speaker events (max 25 points)
  score += Math.min(metrics.speakerEvents * 10, 25);

  // Audience pulled (max 20 points)
  score += Math.min(metrics.maxAudiencePulled / 10, 20);

  // Rewards (max 15 points)
  score += Math.min(metrics.totalRewards * 3, 15);

  // Loyalty score (max 10 points)
  score += Math.min(metrics.loyaltyScore / 10, 10);

  // Subscription bonus
  if (metrics.subscriptionTier === 'premium') {
    score += 20;
  } else if (metrics.subscriptionTier === 'basic') {
    score += 10;
  }

  // Determine tier based on score
  if (score >= 120) return 'royal';
  if (score >= 100) return 'platinum';
  if (score >= 80) return 'gold';
  if (score >= 60) return 'silver';
  if (score >= 40) return 'bronze';
  return 'standard';
};

export const getVIPBenefits = (tier: VIPTier): string[] => {
  switch (tier) {
    case 'royal':
      return [
        'Skip all waiting queues',
        'Premium support',
        'Exclusive event access',
        'Free event cancellations',
        'Personal event manager',
        'Custom event creation tools'
      ];
    case 'platinum':
      return [
        'Priority queue access',
        'Premium support',
        'Early event registration',
        'Free event cancellations',
        'Enhanced profile features'
      ];
    case 'gold':
      return [
        'Fast-track queue access',
        'Priority support',
        'Early event notifications',
        'Reduced waiting times'
      ];
    case 'silver':
      return [
        'Reduced queue waiting',
        'Priority notifications',
        'Basic premium features'
      ];
    case 'bronze':
      return [
        'Slight queue priority',
        'Event recommendations'
      ];
    default:
      return ['Standard event access'];
  }
};

export const getQueuePriority = (tier: VIPTier): number => {
  switch (tier) {
    case 'royal': return 1;
    case 'platinum': return 2;
    case 'gold': return 3;
    case 'silver': return 4;
    case 'bronze': return 5;
    default: return 10;
  }
};
