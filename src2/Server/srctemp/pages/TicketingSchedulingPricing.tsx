import React, { useState, useMemo, useRef } from "react";
import Header from "../components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, DollarSign, Clock, Settings, Trophy, AlertTriangle, CheckCircle, Calculator } from "lucide-react";
import SchedulingAlgorithms from "../components/SchedulingAlgorithms";
import DynamicPricingSystem from "../components/DynamicPricingSystem";
import TicketClassManager from "../components/TicketClassManager";
import GanttChartVisualization from "../components/GanttChartVisualization";
import ROICalculator from "../components/ROICalculator";

const TicketingSchedulingPricing = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("");
  const [schedulingResults, setSchedulingResults] = useState<any>(null);
  const [pricingSystem, setPricingSystem] = useState<any>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [eventConfig, setEventConfig] = useState({
    name: "Tech Conference 2024",
    totalTickets: 100,
    basePrice: 100,
    maxPrice: 300,
    platinumCapacity: 15,
    goldCapacity: 20,
    silverCapacity: 30,
    bronzeCapacity: 35
  });

  const algorithms = [
    { id: 'fcfs', name: 'First Come First Serve (FCFS)', description: 'Process users in order of arrival' },
    { id: 'priority', name: 'Priority Scheduling', description: 'Prioritize based on internet speed/VIP status' },
    { id: 'roundrobin', name: 'Round Robin', description: 'Time-sliced processing with quantum' },
    { id: 'shortest', name: 'Shortest Booking Time First', description: 'Process shortest booking times first' }
  ];

  const handleAlgorithmSelect = (algorithmId: string) => {
    setSelectedAlgorithm(algorithmId);
    console.log(`Selected algorithm: ${algorithmId}`);
  };

  const handleSchedulingComplete = (results: any) => {
    setSchedulingResults(results);
    console.log('Scheduling completed:', results);
  };

  const handlePricingSystemUpdate = (system: any) => {
    setPricingSystem(system);
    console.log('Pricing system updated:', system);
  };

  const runCompleteSimulation = async () => {
    if (!selectedAlgorithm) {
      alert("Please select a scheduling algorithm first!");
      return;
    }

    setSimulationRunning(true);
    
    try {
      // Simulate complete ticketing process
      console.log("Starting complete simulation with:", {
        algorithm: selectedAlgorithm,
        eventConfig
      });
      
      // This would trigger the scheduling and pricing components
      setTimeout(() => {
        setSimulationRunning(false);
        console.log("Simulation completed successfully");
      }, 3000);
      
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulationRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="eventrix-container">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-eventrix mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Ticketing Scheduling & Pricing
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Advanced scheduling algorithms with dynamic pricing for optimal ticket management
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Admin Panel
          </Badge>
        </div>

        {/* Algorithm Selection Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Select Scheduling Algorithm (Waitlist Management)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {algorithms.map((algo) => (
              <Card 
                key={algo.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedAlgorithm === algo.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleAlgorithmSelect(algo.id)}
              >
                <h3 className="font-semibold text-sm mb-2">{algo.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">{algo.description}</p>
                {selectedAlgorithm === algo.id && (
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-2" />
                )}
              </Card>
            ))}
          </div>

          {selectedAlgorithm && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Algorithm Selected: {algorithms.find(a => a.id === selectedAlgorithm)?.name}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Event Configuration */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventConfig.name}
                onChange={(e) => setEventConfig({...eventConfig, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="totalTickets">Total Tickets</Label>
              <Input
                id="totalTickets"
                type="number"
                value={eventConfig.totalTickets}
                onChange={(e) => setEventConfig({...eventConfig, totalTickets: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="basePrice">Base Price ($)</Label>
              <Input
                id="basePrice"
                type="number"
                value={eventConfig.basePrice}
                onChange={(e) => setEventConfig({...eventConfig, basePrice: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={eventConfig.maxPrice}
                onChange={(e) => setEventConfig({...eventConfig, maxPrice: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="scheduling" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="scheduling">
              <Clock className="h-4 w-4 mr-2" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Dynamic Pricing
            </TabsTrigger>
            <TabsTrigger value="classes">
              <Users className="h-4 w-4 mr-2" />
              Ticket Classes
            </TabsTrigger>
            <TabsTrigger value="roi">
              <Calculator className="h-4 w-4 mr-2" />
              ROI Metrics
            </TabsTrigger>
            <TabsTrigger value="visualization">
              <Trophy className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduling" className="mt-6">
            <SchedulingAlgorithms 
              selectedAlgorithm={selectedAlgorithm}
              onSchedulingComplete={handleSchedulingComplete}
              eventConfig={eventConfig}
            />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <DynamicPricingSystem 
              eventConfig={eventConfig}
              onSystemUpdate={handlePricingSystemUpdate}
            />
          </TabsContent>

          <TabsContent value="classes" className="mt-6">
            <TicketClassManager 
              eventConfig={eventConfig}
              onConfigUpdate={setEventConfig}
            />
          </TabsContent>

          <TabsContent value="roi" className="mt-6">
            <ROICalculator />
          </TabsContent>

          <TabsContent value="visualization" className="mt-6">
            <GanttChartVisualization 
              schedulingResults={schedulingResults}
              pricingSystem={pricingSystem}
            />
          </TabsContent>
        </Tabs>

        {/* Control Panel */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-bold">Simulation Control</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Run complete ticketing simulation with selected algorithm and pricing
                </p>
              </div>
            </div>
            
            <Button 
              onClick={runCompleteSimulation}
              disabled={!selectedAlgorithm || simulationRunning}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {simulationRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 mr-2" />
                  Run Complete Simulation
                </>
              )}
            </Button>
          </div>
          
          {simulationRunning && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                <span className="text-blue-800 dark:text-blue-200">
                  Processing {selectedAlgorithm.toUpperCase()} scheduling with dynamic pricing...
                </span>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default TicketingSchedulingPricing;
