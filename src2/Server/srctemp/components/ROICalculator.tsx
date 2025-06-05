
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from "lucide-react";

interface ROIMetrics {
  // Revenue Metrics
  numberOfAttendees: number;
  pricePerTicket: number;
  sponsorshipRevenue: number;
  merchandisingRevenue: number;
  exhibitorRevenue: number;
  additionalServicesRevenue: number;
  
  // Cost Metrics
  venueCost: number;
  technologyCost: number;
  staffCost: number;
  foodBeverageCost: number;
  travelAccommodationCost: number;
  speakersCost: number;
  marketingCost: number;
  miscellaneousCost: number;
  
  // Lead Metrics
  leadsGenerated: number;
  projectedFollowUpRevenue: number;
  
  // Engagement Metrics
  brandExposure: number;
  customerSatisfaction: number;
  networkExposure: number;
}

const ROICalculator = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    numberOfAttendees: 0,
    pricePerTicket: 0,
    sponsorshipRevenue: 0,
    merchandisingRevenue: 0,
    exhibitorRevenue: 0,
    additionalServicesRevenue: 0,
    venueCost: 0,
    technologyCost: 0,
    staffCost: 0,
    foodBeverageCost: 0,
    travelAccommodationCost: 0,
    speakersCost: 0,
    marketingCost: 0,
    miscellaneousCost: 0,
    leadsGenerated: 0,
    projectedFollowUpRevenue: 0,
    brandExposure: 0,
    customerSatisfaction: 0,
    networkExposure: 0
  });

  const [calculatedValues, setCalculatedValues] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    profit: 0,
    roi: 0,
    costPerLead: 0,
    directROI: 0,
    intangibleROI: 0
  });

  const handleInputChange = (field: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateROI = () => {
    // Revenue Calculations
    const ticketRevenue = metrics.numberOfAttendees * metrics.pricePerTicket;
    const totalRevenue = ticketRevenue + metrics.sponsorshipRevenue + 
                        metrics.merchandisingRevenue + metrics.exhibitorRevenue + 
                        metrics.additionalServicesRevenue + metrics.projectedFollowUpRevenue;

    // Cost Calculations
    const totalCosts = metrics.venueCost + metrics.technologyCost + metrics.staffCost +
                      metrics.foodBeverageCost + metrics.travelAccommodationCost + 
                      metrics.speakersCost + metrics.marketingCost + metrics.miscellaneousCost;

    // ROI Calculations
    const profit = totalRevenue - totalCosts;
    const roi = totalCosts > 0 ? ((profit / totalCosts) * 100) : 0;
    const costPerLead = metrics.leadsGenerated > 0 ? (totalCosts / metrics.leadsGenerated) : 0;
    
    // Direct ROI (immediate financial return)
    const directROI = totalCosts > 0 ? (((ticketRevenue + metrics.sponsorshipRevenue) - totalCosts) / totalCosts * 100) : 0;
    
    // Intangible ROI (brand exposure, networking value)
    const intangibleValue = metrics.brandExposure + metrics.customerSatisfaction + metrics.networkExposure;
    const intangibleROI = totalCosts > 0 ? ((intangibleValue / totalCosts) * 100) : 0;

    setCalculatedValues({
      totalRevenue,
      totalCosts,
      profit,
      roi,
      costPerLead,
      directROI,
      intangibleROI
    });
  };

  useEffect(() => {
    calculateROI();
  }, [metrics]);

  const getROIStatus = (roi: number) => {
    if (roi >= 200) return { label: "Excellent", color: "bg-green-500", textColor: "text-green-700" };
    if (roi >= 100) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-700" };
    if (roi >= 50) return { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (roi >= 0) return { label: "Break Even", color: "bg-orange-500", textColor: "text-orange-700" };
    return { label: "Loss", color: "bg-red-500", textColor: "text-red-700" };
  };

  const roiStatus = getROIStatus(calculatedValues.roi);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-green-600" />
            Event ROI Calculator & Formula
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Calculate your events and returns with comprehensive metrics analysis
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Number of Attendees</Label>
                <Input
                  type="number"
                  value={metrics.numberOfAttendees}
                  onChange={(e) => handleInputChange('numberOfAttendees', parseInt(e.target.value) || 0)}
                  placeholder="30"
                />
              </div>
              <div>
                <Label>Price per Ticket ($)</Label>
                <Input
                  type="number"
                  value={metrics.pricePerTicket}
                  onChange={(e) => handleInputChange('pricePerTicket', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Sponsorship Revenue ($)</Label>
                <Input
                  type="number"
                  value={metrics.sponsorshipRevenue}
                  onChange={(e) => handleInputChange('sponsorshipRevenue', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Merchandising Revenue ($)</Label>
                <Input
                  type="number"
                  value={metrics.merchandisingRevenue}
                  onChange={(e) => handleInputChange('merchandisingRevenue', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Exhibitor/Vendor Revenue ($)</Label>
                <Input
                  type="number"
                  value={metrics.exhibitorRevenue}
                  onChange={(e) => handleInputChange('exhibitorRevenue', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Revenue from Additional Services ($)</Label>
                <Input
                  type="number"
                  value={metrics.additionalServicesRevenue}
                  onChange={(e) => handleInputChange('additionalServicesRevenue', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Expenses</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Venue Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.venueCost}
                  onChange={(e) => handleInputChange('venueCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Technology Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.technologyCost}
                  onChange={(e) => handleInputChange('technologyCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Staff & Labor Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.staffCost}
                  onChange={(e) => handleInputChange('staffCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Food & Beverage Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.foodBeverageCost}
                  onChange={(e) => handleInputChange('foodBeverageCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Travel & Accommodation Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.travelAccommodationCost}
                  onChange={(e) => handleInputChange('travelAccommodationCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Speakers Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.speakersCost}
                  onChange={(e) => handleInputChange('speakersCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Marketing & Promotional Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.marketingCost}
                  onChange={(e) => handleInputChange('marketingCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Miscellaneous Cost ($)</Label>
                <Input
                  type="number"
                  value={metrics.miscellaneousCost}
                  onChange={(e) => handleInputChange('miscellaneousCost', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lead Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Lead Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Leads Generated</Label>
                <Input
                  type="number"
                  value={metrics.leadsGenerated}
                  onChange={(e) => handleInputChange('leadsGenerated', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Projected Revenue from Follow-up Sales ($)</Label>
                <Input
                  type="number"
                  value={metrics.projectedFollowUpRevenue}
                  onChange={(e) => handleInputChange('projectedFollowUpRevenue', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Engagement Metrics</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Assign values in dollars to your engagement metrics
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Brand Exposure ($)</Label>
                <Input
                  type="number"
                  value={metrics.brandExposure}
                  onChange={(e) => handleInputChange('brandExposure', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Customer Satisfaction ($)</Label>
                <Input
                  type="number"
                  value={metrics.customerSatisfaction}
                  onChange={(e) => handleInputChange('customerSatisfaction', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Network Exposure ($)</Label>
                <Input
                  type="number"
                  value={metrics.networkExposure}
                  onChange={(e) => handleInputChange('networkExposure', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Dashboard */}
        <div className="space-y-6">
          {/* ROI Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Event ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {calculatedValues.roi.toFixed(1)}%
                </div>
                <Badge className={`${roiStatus.color} text-white`}>
                  {roiStatus.label}
                </Badge>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${roiStatus.color}`}
                    style={{ 
                      width: `${Math.min(Math.max(calculatedValues.roi / 4, 0), 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ROI Scale: 0% - 400%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Revenue</span>
                <span className="font-semibold text-green-600">
                  ${calculatedValues.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Costs</span>
                <span className="font-semibold text-red-600">
                  ${calculatedValues.totalCosts.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Profit (In $)</span>
                <span className={`font-bold ${calculatedValues.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${calculatedValues.profit.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Cost per Lead</span>
                <span className="font-semibold">
                  ${calculatedValues.costPerLead.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Direct ROI</span>
                <span className="font-semibold">
                  {calculatedValues.directROI.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Intangible ROI</span>
                <span className="font-semibold">
                  {calculatedValues.intangibleROI.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ROI Formula */}
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-white">Event ROI Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-lg font-mono">
                  Event ROI =
                </div>
                <div className="text-sm border border-gray-600 rounded p-2">
                  (Revenue from Event - Total Event Costs)
                  <hr className="my-1 border-gray-600" />
                  Total Event Costs
                </div>
                <div className="text-lg font-mono">
                  × 100
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
