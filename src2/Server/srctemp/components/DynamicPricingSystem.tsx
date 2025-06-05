
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, AlertTriangle, Target, Zap } from "lucide-react";

interface TicketClass {
  name: string;
  booked: number;
  capacity: number;
  basePrice: number;
  currentPrice: number;
  multiplier: number;
  users: number[];
  priceHistory: number[];
  revenueHistory: number[];
}

interface DynamicPricingSystemProps {
  eventConfig: any;
  onSystemUpdate: (system: any) => void;
}

const DynamicPricingSystem: React.FC<DynamicPricingSystemProps> = ({
  eventConfig,
  onSystemUpdate
}) => {
  const [pricingStrategy, setPricingStrategy] = useState<'linear' | 'tiered' | 'surge'>('linear');
  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [bookingQueue, setBookingQueue] = useState<any[]>([]);

  useEffect(() => {
    initializeTicketClasses();
  }, [eventConfig]);

  const initializeTicketClasses = () => {
    const classes: TicketClass[] = [
      {
        name: 'Platinum',
        booked: 0,
        capacity: eventConfig.platinumCapacity || 15,
        basePrice: eventConfig.basePrice * 2.0,
        currentPrice: eventConfig.basePrice * 2.0,
        multiplier: 2.0,
        users: [],
        priceHistory: [],
        revenueHistory: []
      },
      {
        name: 'Gold',
        booked: 0,
        capacity: eventConfig.goldCapacity || 20,
        basePrice: eventConfig.basePrice * 1.5,
        currentPrice: eventConfig.basePrice * 1.5,
        multiplier: 1.5,
        users: [],
        priceHistory: [],
        revenueHistory: []
      },
      {
        name: 'Silver',
        booked: 0,
        capacity: eventConfig.silverCapacity || 30,
        basePrice: eventConfig.basePrice * 1.2,
        currentPrice: eventConfig.basePrice * 1.2,
        multiplier: 1.2,
        users: [],
        priceHistory: [],
        revenueHistory: []
      },
      {
        name: 'Bronze',
        booked: 0,
        capacity: eventConfig.bronzeCapacity || 35,
        basePrice: eventConfig.basePrice,
        currentPrice: eventConfig.basePrice,
        multiplier: 1.0,
        users: [],
        priceHistory: [],
        revenueHistory: []
      }
    ];
    setTicketClasses(classes);
    console.log('Initialized ticket classes:', classes);
  };

  const calculatePrice = (ticketClass: TicketClass, strategy: string): number => {
    const demandRatio = ticketClass.booked / ticketClass.capacity;
    const maxPrice = Math.min(eventConfig.maxPrice * ticketClass.multiplier, eventConfig.maxPrice);

    switch (strategy) {
      case 'linear':
        return ticketClass.basePrice + (maxPrice - ticketClass.basePrice) * demandRatio;
      
      case 'tiered':
        if (demandRatio < 0.5) return ticketClass.basePrice;
        if (demandRatio < 0.8) return ticketClass.basePrice + (maxPrice - ticketClass.basePrice) * 0.5;
        return maxPrice;
      
      case 'surge':
        if (demandRatio < 0.8) {
          return ticketClass.basePrice + (maxPrice - ticketClass.basePrice) * (demandRatio / 0.8);
        }
        return Math.min(maxPrice * 1.1, eventConfig.maxPrice);
      
      default:
        return ticketClass.basePrice;
    }
  };

  const analyzeDemandAndChooseStrategy = (): { strategy: 'linear' | 'tiered' | 'surge', reason: string } => {
    const totalBooked = ticketClasses.reduce((sum, cls) => sum + cls.booked, 0);
    const totalCapacity = ticketClasses.reduce((sum, cls) => sum + cls.capacity, 0);
    const selloutRatio = totalBooked / totalCapacity;

    if (selloutRatio < 0.5 && waitlistCount === 0) {
      return {
        strategy: 'linear',
        reason: 'Linear pricing chosen: Steady demand, no waitlist. Gradual price increase balances accessibility and revenue.'
      };
    } else if ((selloutRatio >= 0.5 && selloutRatio < 0.8) || (waitlistCount > 0 && selloutRatio < 0.8)) {
      return {
        strategy: 'tiered',
        reason: 'Tiered pricing chosen: Demand increasing with waitlist forming. Clear price jumps capture revenue as urgency grows.'
      };
    } else {
      return {
        strategy: 'surge',
        reason: 'Surge pricing chosen: Nearly sold out or large waitlist. Maximizes profit when demand exceeds supply.'
      };
    }
  };

  const bookTicket = (userId: number, className: string): string => {
    const classIndex = ticketClasses.findIndex(cls => cls.name === className);
    if (classIndex === -1) return `Invalid ticket class: ${className}`;

    const updatedClasses = [...ticketClasses];
    const targetClass = updatedClasses[classIndex];

    if (targetClass.booked < targetClass.capacity) {
      const currentPrice = calculatePrice(targetClass, pricingStrategy);
      
      targetClass.users.push(userId);
      targetClass.booked += 1;
      targetClass.currentPrice = currentPrice;
      targetClass.priceHistory.push(currentPrice);
      
      const newRevenue = targetClass.revenueHistory.length === 0 
        ? currentPrice 
        : targetClass.revenueHistory[targetClass.revenueHistory.length - 1] + currentPrice;
      targetClass.revenueHistory.push(newRevenue);

      setTicketClasses(updatedClasses);
      
      // Update total revenue
      const newTotalRevenue = updatedClasses.reduce((sum, cls) => 
        sum + (cls.revenueHistory[cls.revenueHistory.length - 1] || 0), 0
      );
      setTotalRevenue(newTotalRevenue);

      return `User ${userId} booked ${className} ticket at $${currentPrice.toFixed(2)}`;
    } else {
      setWaitlistCount(prev => prev + 1);
      return `User ${userId} added to ${className} waitlist (position ${waitlistCount + 1})`;
    }
  };

  const runPricingSimulation = async () => {
    setIsSimulating(true);
    
    try {
      // Reset system
      initializeTicketClasses();
      setTotalRevenue(0);
      setWaitlistCount(0);
      
      const classNames = ['Bronze', 'Silver', 'Gold', 'Platinum'];
      let userId = 1;

      // Phase 1: Initial bookings (mixed demand)
      console.log('Phase 1: Initial mixed demand');
      for (let i = 0; i < 40; i++) {
        const randomClass = classNames[Math.floor(Math.random() * 4)];
        const result = bookTicket(userId, randomClass);
        
        // Update strategy based on current state
        const { strategy, reason } = analyzeDemandAndChooseStrategy();
        if (strategy !== pricingStrategy) {
          setPricingStrategy(strategy);
          console.log(`Strategy changed to ${strategy}: ${reason}`);
        }
        
        if (userId % 10 === 0) console.log(result);
        userId++;
        
        // Small delay for visualization
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Phase 2: High demand surge (premium classes preferred)
      console.log('Phase 2: High demand surge');
      for (let i = 0; i < 30; i++) {
        const biasedClass = i < 15 
          ? (i % 2 === 0 ? 'Platinum' : 'Gold')
          : classNames[i % 4];
        
        const result = bookTicket(userId, biasedClass);
        
        const { strategy, reason } = analyzeDemandAndChooseStrategy();
        if (strategy !== pricingStrategy) {
          setPricingStrategy(strategy);
          console.log(`Strategy changed to ${strategy}: ${reason}`);
        }
        
        if (userId % 5 === 0) console.log(result);
        userId++;
        
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // Phase 3: Fill remaining capacity
      console.log('Phase 3: Fill remaining capacity');
      const totalBooked = ticketClasses.reduce((sum, cls) => sum + cls.booked, 0);
      const totalCapacity = ticketClasses.reduce((sum, cls) => sum + cls.capacity, 0);
      const remaining = totalCapacity - totalBooked;
      
      for (let i = 0; i < remaining && i < 20; i++) {
        const randomClass = classNames[Math.floor(Math.random() * 4)];
        const result = bookTicket(userId, randomClass);
        
        const { strategy, reason } = analyzeDemandAndChooseStrategy();
        if (strategy !== pricingStrategy) {
          setPricingStrategy(strategy);
          console.log(`Strategy changed to ${strategy}: ${reason}`);
        }
        
        userId++;
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Phase 4: Create waitlist
      console.log('Phase 4: Creating waitlist');
      for (let i = 0; i < 15; i++) {
        const randomClass = classNames[Math.floor(Math.random() * 4)];
        const result = bookTicket(userId, randomClass);
        if (userId % 3 === 0) console.log(result);
        userId++;
      }

      console.log('Pricing simulation completed successfully');
      
      // Update parent component
      onSystemUpdate({
        strategy: pricingStrategy,
        ticketClasses: ticketClasses,
        totalRevenue: totalRevenue,
        waitlistCount: waitlistCount
      });

    } catch (error) {
      console.error('Pricing simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'linear': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'tiered': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'surge': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'platinum': return '#E5E7EB'; // Light gray (Platinum)
      case 'gold': return '#FCD34D'; // Gold
      case 'silver': return '#D1D5DB'; // Silver
      case 'bronze': return '#92400E'; // Bronze
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold">Dynamic Pricing System</h2>
          </div>
          <Badge className={getStrategyColor(pricingStrategy)}>
            {pricingStrategy.toUpperCase()} Strategy
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(0)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {ticketClasses.reduce((sum, cls) => sum + cls.booked, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tickets Sold</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-orange-600">{waitlistCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Waitlist Count</div>
          </div>
        </div>

        <Button 
          onClick={runPricingSimulation}
          disabled={isSimulating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isSimulating ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              Running Simulation...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Run Dynamic Pricing Simulation
            </>
          )}
        </Button>
      </Card>

      {/* Ticket Classes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ticketClasses.map((ticketClass) => {
          const utilizationPercent = (ticketClass.booked / ticketClass.capacity) * 100;
          const avgPrice = ticketClass.priceHistory.length > 0 
            ? ticketClass.priceHistory.reduce((a, b) => a + b, 0) / ticketClass.priceHistory.length 
            : ticketClass.basePrice;

          return (
            <Card key={ticketClass.name} className="p-4" style={{ borderColor: getClassColor(ticketClass.name) }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{ticketClass.name}</h3>
                <Badge variant="outline" style={{ backgroundColor: getClassColor(ticketClass.name) + '20' }}>
                  {ticketClass.multiplier}x
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity</span>
                    <span>{ticketClass.booked}/{ticketClass.capacity}</span>
                  </div>
                  <Progress value={utilizationPercent} className="h-2" />
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-green-600">
                    ${ticketClass.currentPrice.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">Current Price</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    ${(ticketClass.revenueHistory[ticketClass.revenueHistory.length - 1] || 0).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">Revenue Generated</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Strategy Explanation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing Strategy Details
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Linear Pricing</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Gradual price increase based on demand ratio. Best for steady, predictable demand.
              </p>
            </div>
            <div className="p-4 border rounded bg-yellow-50 dark:bg-yellow-900/20">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Tiered Pricing</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Price jumps at demand milestones (50%, 80%). Effective for events with demand surges.
              </p>
            </div>
            <div className="p-4 border rounded bg-red-50 dark:bg-red-900/20">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Surge Pricing</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Rapid price increases when nearly sold out. Maximizes revenue for high-demand events.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <h4 className="font-semibold mb-2">Current Strategy Justification:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {pricingStrategy === 'linear' && 
                "Linear pricing is active due to steady demand patterns. This ensures fair pricing while gradually increasing revenue as demand grows."
              }
              {pricingStrategy === 'tiered' && 
                "Tiered pricing is active due to increased demand and waitlist formation. Clear price tiers help capture value at different demand levels."
              }
              {pricingStrategy === 'surge' && 
                "Surge pricing is active due to high demand exceeding supply. This maximizes revenue when tickets are scarce and urgency is high."
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DynamicPricingSystem;
