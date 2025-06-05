
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, TrendingUp, Users } from "lucide-react";

interface GanttChartVisualizationProps {
  schedulingResults: any;
  pricingSystem: any;
}

const GanttChartVisualization: React.FC<GanttChartVisualizationProps> = ({
  schedulingResults,
  pricingSystem
}) => {
  const ganttData = useMemo(() => {
    if (!schedulingResults?.schedule) return null;
    
    const maxTime = Math.max(...schedulingResults.schedule.map((s: any) => s.finishTime));
    const timeUnits = Array.from({ length: Math.ceil(maxTime / 5) }, (_, i) => i * 5);
    
    return {
      maxTime,
      timeUnits,
      schedule: schedulingResults.schedule
    };
  }, [schedulingResults]);

  const getColorForUser = (userId: number) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    return colors[userId % colors.length];
  };

  const renderGanttChart = () => {
    if (!ganttData) return <div className="text-center text-gray-500">No scheduling data available</div>;

    return (
      <div className="space-y-4">
        {/* Time axis */}
        <div className="flex items-center">
          <div className="w-20 text-sm font-medium">Time:</div>
          <div className="flex-1 relative">
            <div className="flex">
              {ganttData.timeUnits.map((time) => (
                <div key={time} className="text-xs text-gray-500 w-12 text-center">
                  {time}min
                </div>
              ))}
            </div>
            <div className="absolute top-4 left-0 right-0 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Gantt bars */}
        <div className="space-y-2">
          {ganttData.schedule.map((entry: any, index: number) => {
            const startPercent = (entry.startTime / ganttData.maxTime) * 100;
            const widthPercent = ((entry.finishTime - entry.startTime) / ganttData.maxTime) * 100;
            const userColor = getColorForUser(entry.userId);

            return (
              <div key={`${entry.userId}-${entry.startTime}`} className="flex items-center">
                <div className="w-20 text-sm">User {entry.userId}</div>
                <div className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-700 rounded">
                  <div
                    className="absolute top-0 h-full rounded flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: userColor,
                      minWidth: '40px'
                    }}
                  >
                    {entry.finishTime - entry.startTime}min
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSchedulingMetrics = () => {
    if (!schedulingResults?.metrics) return null;

    const metrics = schedulingResults.metrics;
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="text-2xl font-bold text-blue-600">{metrics.avgTurnaroundTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Turnaround</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="text-2xl font-bold text-green-600">{metrics.avgWaitingTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Waiting</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <div className="text-2xl font-bold text-yellow-600">{metrics.avgResponseTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
          <div className="text-2xl font-bold text-purple-600">{metrics.totalCompletionTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
          <div className="text-2xl font-bold text-red-600">{metrics.throughput}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Throughput</div>
        </div>
      </div>
    );
  };

  const renderPricingAnalytics = () => {
    if (!pricingSystem?.ticketClasses) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pricingSystem.ticketClasses.map((ticketClass: any) => {
            const utilizationPercent = (ticketClass.booked / ticketClass.capacity) * 100;
            const revenue = ticketClass.revenueHistory[ticketClass.revenueHistory.length - 1] || 0;

            return (
              <Card key={ticketClass.name} className="p-4">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">{ticketClass.name}</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ${revenue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${utilizationPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {ticketClass.booked}/{ticketClass.capacity} sold ({utilizationPercent.toFixed(0)}%)
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-3xl font-bold text-green-600">
              ${pricingSystem.totalRevenue?.toFixed(0) || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-3xl font-bold text-blue-600">
              {pricingSystem.ticketClasses?.reduce((sum: number, cls: any) => sum + cls.booked, 0) || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tickets Sold</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
            <div className="text-3xl font-bold text-orange-600">
              {pricingSystem.waitlistCount || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Waitlist</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Scheduling Visualization */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold">Scheduling Gantt Chart</h2>
          {schedulingResults?.algorithm && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {schedulingResults.algorithm.toUpperCase()}
            </Badge>
          )}
        </div>
        {renderGanttChart()}
      </Card>

      {/* Scheduling Metrics */}
      {schedulingResults?.metrics && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold">Scheduling Performance Metrics</h2>
          </div>
          {renderSchedulingMetrics()}
        </Card>
      )}

      {/* Pricing Analytics */}
      {pricingSystem && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold">Dynamic Pricing Analytics</h2>
            {pricingSystem.strategy && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                {pricingSystem.strategy.toUpperCase()} Strategy
              </Badge>
            )}
          </div>
          {renderPricingAnalytics()}
        </Card>
      )}

      {/* Combined Analysis */}
      {schedulingResults && pricingSystem && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Combined System Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Scheduling Efficiency</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <span className="font-medium">{schedulingResults.algorithm?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Users Processed:</span>
                  <span className="font-medium">{schedulingResults.schedule?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Wait Time:</span>
                  <span className="font-medium">{schedulingResults.metrics?.avgWaitingTime || 0} min</span>
                </div>
                <div className="flex justify-between">
                  <span>System Throughput:</span>
                  <span className="font-medium">{schedulingResults.metrics?.throughput || 0} users/min</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Revenue Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pricing Strategy:</span>
                  <span className="font-medium">{pricingSystem.strategy?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-medium">${pricingSystem.totalRevenue?.toFixed(0) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tickets Sold:</span>
                  <span className="font-medium">
                    {pricingSystem.ticketClasses?.reduce((sum: number, cls: any) => sum + cls.booked, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Waitlist Size:</span>
                  <span className="font-medium">{pricingSystem.waitlistCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded">
            <h4 className="font-semibold mb-2">System Optimization Summary</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The {schedulingResults?.algorithm?.toUpperCase()} scheduling algorithm processed {schedulingResults?.schedule?.length || 0} users 
              with an average waiting time of {schedulingResults?.metrics?.avgWaitingTime || 0} minutes. 
              Combined with {pricingSystem?.strategy?.toUpperCase()} pricing strategy, the system generated 
              ${pricingSystem?.totalRevenue?.toFixed(0) || 0} in revenue while maintaining efficient user processing.
            </p>
          </div>
        </Card>
      )}

      {/* No Data State */}
      {!schedulingResults && !pricingSystem && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
            <p className="text-sm">
              Run scheduling algorithms and pricing simulations to see comprehensive analytics and visualizations here.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GanttChartVisualization;
