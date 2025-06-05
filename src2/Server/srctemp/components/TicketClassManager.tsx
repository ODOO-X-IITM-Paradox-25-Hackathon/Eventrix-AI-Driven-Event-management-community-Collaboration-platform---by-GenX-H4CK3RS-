
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Save, RefreshCw } from "lucide-react";

interface TicketClassManagerProps {
  eventConfig: any;
  onConfigUpdate: (config: any) => void;
}

const TicketClassManager: React.FC<TicketClassManagerProps> = ({
  eventConfig,
  onConfigUpdate
}) => {
  const [tempConfig, setTempConfig] = useState(eventConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCapacityChange = (field: string, value: number) => {
    const newConfig = { ...tempConfig, [field]: value };
    setTempConfig(newConfig);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Validate total capacity
    const totalCapacity = tempConfig.platinumCapacity + tempConfig.goldCapacity + 
                         tempConfig.silverCapacity + tempConfig.bronzeCapacity;
    
    if (totalCapacity !== tempConfig.totalTickets) {
      alert(`Warning: Total class capacity (${totalCapacity}) doesn't match total tickets (${tempConfig.totalTickets}). Adjusting automatically.`);
      
      // Auto-adjust proportionally
      const ratio = tempConfig.totalTickets / totalCapacity;
      const adjustedConfig = {
        ...tempConfig,
        platinumCapacity: Math.floor(tempConfig.platinumCapacity * ratio),
        goldCapacity: Math.floor(tempConfig.goldCapacity * ratio),
        silverCapacity: Math.floor(tempConfig.silverCapacity * ratio),
        bronzeCapacity: Math.floor(tempConfig.bronzeCapacity * ratio)
      };
      
      // Handle remaining tickets due to rounding
      const adjustedTotal = adjustedConfig.platinumCapacity + adjustedConfig.goldCapacity + 
                           adjustedConfig.silverCapacity + adjustedConfig.bronzeCapacity;
      const remaining = tempConfig.totalTickets - adjustedTotal;
      adjustedConfig.bronzeCapacity += remaining;
      
      setTempConfig(adjustedConfig);
      onConfigUpdate(adjustedConfig);
    } else {
      onConfigUpdate(tempConfig);
    }
    
    setHasChanges(false);
  };

  const handleReset = () => {
    const equalCapacity = Math.floor(tempConfig.totalTickets / 4);
    const remaining = tempConfig.totalTickets % 4;
    
    const resetConfig = {
      ...tempConfig,
      platinumCapacity: equalCapacity + (remaining > 0 ? 1 : 0),
      goldCapacity: equalCapacity + (remaining > 1 ? 1 : 0),
      silverCapacity: equalCapacity + (remaining > 2 ? 1 : 0),
      bronzeCapacity: equalCapacity
    };
    
    setTempConfig(resetConfig);
    setHasChanges(true);
  };

  const getClassDetails = () => [
    {
      name: 'Platinum',
      key: 'platinumCapacity',
      multiplier: '2.0x',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      description: 'Premium tier with exclusive access and VIP amenities',
      benefits: ['VIP Lounge Access', 'Premium Seating', 'Complimentary Refreshments', 'Priority Support']
    },
    {
      name: 'Gold',
      key: 'goldCapacity',
      multiplier: '1.5x',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'High tier with premium seating and enhanced services',
      benefits: ['Enhanced Seating', 'Complimentary Parking', 'Event Merchandise', 'Fast Track Entry']
    },
    {
      name: 'Silver',
      key: 'silverCapacity',
      multiplier: '1.2x',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Mid tier with enhanced facilities and priority access',
      benefits: ['Reserved Seating', 'Priority Parking', 'Event Materials', 'Networking Access']
    },
    {
      name: 'Bronze',
      key: 'bronzeCapacity',
      multiplier: '1.0x',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Entry tier with standard access and basic amenities',
      benefits: ['General Admission', 'Standard Seating', 'Basic Refreshments', 'Event Access']
    }
  ];

  const classDetails = getClassDetails();
  const totalAllocated = tempConfig.platinumCapacity + tempConfig.goldCapacity + 
                        tempConfig.silverCapacity + tempConfig.bronzeCapacity;

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold">Ticket Class Configuration</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              Total: {totalAllocated} / {tempConfig.totalTickets}
            </Badge>
            {hasChanges && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-blue-600">{tempConfig.totalTickets}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Tickets</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-green-600">${tempConfig.basePrice}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Base Price</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
            <div className="text-2xl font-bold text-red-600">${tempConfig.maxPrice}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Max Price</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Equal Distribution
          </Button>
        </div>
      </Card>

      {/* Capacity Allocation Warning */}
      {totalAllocated !== tempConfig.totalTickets && (
        <Card className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800 dark:text-orange-200">
              Capacity Mismatch: Allocated {totalAllocated} tickets, but total is {tempConfig.totalTickets}
            </span>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            {totalAllocated > tempConfig.totalTickets 
              ? "You've allocated more tickets than available. This will be automatically adjusted when saved."
              : `${tempConfig.totalTickets - totalAllocated} tickets remain unallocated and will be added to Bronze class.`
            }
          </p>
        </Card>
      )}

      {/* Ticket Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classDetails.map((classDetail) => (
          <Card key={classDetail.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{classDetail.name}</h3>
                <Badge className={classDetail.color}>
                  {classDetail.multiplier}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${(tempConfig.basePrice * parseFloat(classDetail.multiplier)).toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">Starting Price</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {classDetail.description}
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`${classDetail.key}-input`}>Capacity Allocation</Label>
                <Input
                  id={`${classDetail.key}-input`}
                  type="number"
                  min="0"
                  max={tempConfig.totalTickets}
                  value={tempConfig[classDetail.key]}
                  onChange={(e) => handleCapacityChange(classDetail.key, parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {((tempConfig[classDetail.key] / tempConfig.totalTickets) * 100).toFixed(1)}% of total capacity
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Benefits Included:</h4>
                <div className="space-y-1">
                  {classDetail.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Capacity Distribution Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Capacity Distribution</h3>
        <div className="space-y-4">
          {classDetails.map((classDetail) => {
            const percentage = totalAllocated > 0 ? (tempConfig[classDetail.key] / totalAllocated) * 100 : 0;
            return (
              <div key={classDetail.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{classDetail.name}</span>
                  <span>{tempConfig[classDetail.key]} tickets ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      classDetail.name === 'Platinum' ? 'bg-gray-400' :
                      classDetail.name === 'Gold' ? 'bg-yellow-400' :
                      classDetail.name === 'Silver' ? 'bg-blue-400' : 'bg-orange-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pricing Strategy Summary */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold mb-4">Pricing Strategy Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Revenue Optimization</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Tiered pricing captures different customer segments</li>
              <li>• Dynamic pricing adjusts based on demand patterns</li>
              <li>• Premium tiers maximize revenue from high-value customers</li>
              <li>• Bronze tier maintains accessibility for price-sensitive users</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Market Segmentation</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Platinum: Premium customers seeking exclusive experiences</li>
              <li>• Gold: High-value customers wanting enhanced services</li>
              <li>• Silver: Mid-market customers seeking good value</li>
              <li>• Bronze: Price-conscious customers wanting basic access</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TicketClassManager;
