
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, BarChart3, AlertTriangle } from "lucide-react";

interface User {
  userId: number;
  arrivalTime: number;
  bookingTime: number;
  internetSpeed: number;
  priority?: number;
}

interface ScheduleEntry {
  userId: number;
  startTime: number;
  finishTime: number;
}

interface SchedulingAlgorithmsProps {
  selectedAlgorithm: string;
  onSchedulingComplete: (results: any) => void;
  eventConfig: any;
}

const SchedulingAlgorithms: React.FC<SchedulingAlgorithmsProps> = ({
  selectedAlgorithm,
  onSchedulingComplete,
  eventConfig
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate random user data
  const generateUsers = (count: number = 20): User[] => {
    const generatedUsers: User[] = [];
    for (let i = 1; i <= count; i++) {
      generatedUsers.push({
        userId: i,
        arrivalTime: Math.floor(Math.random() * 21), // 0-20 minutes
        bookingTime: Math.floor(Math.random() * 10) + 1, // 1-10 minutes
        internetSpeed: Math.floor(Math.random() * 100) + 1, // 1-100 Mbps
        priority: Math.floor(Math.random() * 5) + 1 // 1-5 priority
      });
    }
    return generatedUsers.sort((a, b) => a.arrivalTime - b.arrivalTime);
  };

  useEffect(() => {
    setUsers(generateUsers());
  }, []);

  // FCFS Scheduling Algorithm
  const fcfsScheduling = (userList: User[]): ScheduleEntry[] => {
    const sortedUsers = [...userList].sort((a, b) => {
      if (a.arrivalTime === b.arrivalTime) return a.userId - b.userId;
      return a.arrivalTime - b.arrivalTime;
    });

    let currentTime = 0;
    const scheduleResult: ScheduleEntry[] = [];

    for (const user of sortedUsers) {
      const startTime = Math.max(currentTime, user.arrivalTime);
      const finishTime = startTime + user.bookingTime;
      
      scheduleResult.push({
        userId: user.userId,
        startTime,
        finishTime
      });
      
      currentTime = finishTime;
    }

    return scheduleResult;
  };

  // Priority Scheduling Algorithm (based on internet speed)
  const priorityScheduling = (userList: User[]): ScheduleEntry[] => {
    const sortedUsers = [...userList].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    const scheduleResult: ScheduleEntry[] = [];
    const readyQueue: User[] = [];
    let i = 0;

    while (scheduleResult.length < userList.length) {
      // Add arrived users to ready queue
      while (i < sortedUsers.length && sortedUsers[i].arrivalTime <= currentTime) {
        readyQueue.push(sortedUsers[i]);
        i++;
      }

      if (readyQueue.length > 0) {
        // Sort by priority (internet speed - higher is better)
        readyQueue.sort((a, b) => b.internetSpeed - a.internetSpeed);
        const user = readyQueue.shift()!;
        
        const startTime = currentTime;
        const finishTime = startTime + user.bookingTime;
        
        scheduleResult.push({
          userId: user.userId,
          startTime,
          finishTime
        });
        
        currentTime = finishTime;
      } else if (i < sortedUsers.length) {
        currentTime = sortedUsers[i].arrivalTime;
      }
    }

    return scheduleResult;
  };

  // Round Robin Scheduling Algorithm
  const roundRobinScheduling = (userList: User[], timeQuantum: number = 2): ScheduleEntry[] => {
    const sortedUsers = [...userList].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const scheduleResult: ScheduleEntry[] = [];
    const queue: { user: User; remainingTime: number }[] = [];
    let currentTime = 0;
    let i = 0;

    while (scheduleResult.length < userList.length || queue.length > 0) {
      // Add arrived users to queue
      while (i < sortedUsers.length && sortedUsers[i].arrivalTime <= currentTime) {
        queue.push({
          user: sortedUsers[i],
          remainingTime: sortedUsers[i].bookingTime
        });
        i++;
      }

      if (queue.length > 0) {
        const current = queue.shift()!;
        const execTime = Math.min(timeQuantum, current.remainingTime);
        const startTime = currentTime;
        const finishTime = startTime + execTime;

        scheduleResult.push({
          userId: current.user.userId,
          startTime,
          finishTime
        });

        current.remainingTime -= execTime;
        currentTime = finishTime;

        // Add more arrived users
        while (i < sortedUsers.length && sortedUsers[i].arrivalTime <= currentTime) {
          queue.push({
            user: sortedUsers[i],
            remainingTime: sortedUsers[i].bookingTime
          });
          i++;
        }

        // If process not complete, add back to queue
        if (current.remainingTime > 0) {
          queue.push(current);
        }
      } else if (i < sortedUsers.length) {
        currentTime = sortedUsers[i].arrivalTime;
      }
    }

    return scheduleResult;
  };

  // Shortest Booking Time First Algorithm
  const shortestBookingTimeFirst = (userList: User[]): ScheduleEntry[] => {
    const sortedUsers = [...userList].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    const scheduleResult: ScheduleEntry[] = [];
    const readyQueue: User[] = [];
    let i = 0;

    while (scheduleResult.length < userList.length) {
      // Add arrived users to ready queue
      while (i < sortedUsers.length && sortedUsers[i].arrivalTime <= currentTime) {
        readyQueue.push(sortedUsers[i]);
        i++;
      }

      if (readyQueue.length > 0) {
        // Sort by booking time (shortest first)
        readyQueue.sort((a, b) => a.bookingTime - b.bookingTime);
        const user = readyQueue.shift()!;
        
        const startTime = currentTime;
        const finishTime = startTime + user.bookingTime;
        
        scheduleResult.push({
          userId: user.userId,
          startTime,
          finishTime
        });
        
        currentTime = finishTime;
      } else if (i < sortedUsers.length) {
        currentTime = sortedUsers[i].arrivalTime;
      }
    }

    return scheduleResult;
  };

  // Calculate performance metrics
  const calculateMetrics = (userList: User[], scheduleResult: ScheduleEntry[]) => {
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let totalResponseTime = 0;

    const userMap = new Map(userList.map(u => [u.userId, u]));
    
    for (const entry of scheduleResult) {
      const user = userMap.get(entry.userId)!;
      const turnaroundTime = entry.finishTime - user.arrivalTime;
      const waitingTime = entry.startTime - user.arrivalTime;
      const responseTime = entry.startTime - user.arrivalTime;

      totalTurnaroundTime += turnaroundTime;
      totalWaitingTime += waitingTime;
      totalResponseTime += responseTime;
    }

    const count = scheduleResult.length;
    return {
      avgTurnaroundTime: (totalTurnaroundTime / count).toFixed(2),
      avgWaitingTime: (totalWaitingTime / count).toFixed(2),
      avgResponseTime: (totalResponseTime / count).toFixed(2),
      totalCompletionTime: Math.max(...scheduleResult.map(s => s.finishTime)),
      throughput: (count / Math.max(...scheduleResult.map(s => s.finishTime))).toFixed(3)
    };
  };

  const runScheduling = async () => {
    if (!selectedAlgorithm || users.length === 0) return;

    setIsProcessing(true);

    try {
      let scheduleResult: ScheduleEntry[] = [];

      switch (selectedAlgorithm) {
        case 'fcfs':
          scheduleResult = fcfsScheduling(users);
          break;
        case 'priority':
          scheduleResult = priorityScheduling(users);
          break;
        case 'roundrobin':
          scheduleResult = roundRobinScheduling(users);
          break;
        case 'shortest':
          scheduleResult = shortestBookingTimeFirst(users);
          break;
        default:
          throw new Error('Unknown algorithm selected');
      }

      const metricsResult = calculateMetrics(users, scheduleResult);
      
      setSchedule(scheduleResult);
      setMetrics(metricsResult);
      
      onSchedulingComplete({
        algorithm: selectedAlgorithm,
        schedule: scheduleResult,
        metrics: metricsResult,
        users: users
      });

      console.log(`${selectedAlgorithm.toUpperCase()} scheduling completed:`, {
        scheduleResult,
        metricsResult
      });

    } catch (error) {
      console.error('Scheduling error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAlgorithmDescription = () => {
    switch (selectedAlgorithm) {
      case 'fcfs':
        return 'Processes users in the exact order they arrive. Simple and fair, but may not be optimal for performance.';
      case 'priority':
        return 'Prioritizes users based on internet speed. Users with faster connections get scheduled first.';
      case 'roundrobin':
        return 'Gives each user a fixed time quantum. If not completed, user goes back to the queue.';
      case 'shortest':
        return 'Processes users with shortest booking time first. Optimizes for average completion time.';
      default:
        return 'Select an algorithm to see its description.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Info */}
      {selectedAlgorithm && (
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {selectedAlgorithm.toUpperCase()} Algorithm
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {getAlgorithmDescription()}
          </p>
          <Button 
            onClick={runScheduling}
            disabled={!selectedAlgorithm || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run {selectedAlgorithm.toUpperCase()} Scheduling
              </>
            )}
          </Button>
        </Card>
      )}

      {/* User Data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Queue ({users.length} users)
          </h3>
          <Button
            variant="outline"
            onClick={() => setUsers(generateUsers())}
          >
            Generate New Users
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User ID</th>
                <th className="text-left p-2">Arrival Time</th>
                <th className="text-left p-2">Booking Time</th>
                <th className="text-left p-2">Internet Speed</th>
                <th className="text-left p-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((user) => (
                <tr key={user.userId} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2">User {user.userId}</td>
                  <td className="p-2">{user.arrivalTime}min</td>
                  <td className="p-2">{user.bookingTime}min</td>
                  <td className="p-2">{user.internetSpeed} Mbps</td>
                  <td className="p-2">
                    <Badge variant="outline">{user.priority}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length > 10 && (
            <p className="text-center text-gray-500 mt-2">
              Showing first 10 users. Total: {users.length}
            </p>
          )}
        </div>
      </Card>

      {/* Scheduling Results */}
      {schedule.length > 0 && metrics && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </h3>
            
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
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User ID</th>
                    <th className="text-left p-2">Start Time</th>
                    <th className="text-left p-2">Finish Time</th>
                    <th className="text-left p-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 10).map((entry) => (
                    <tr key={`${entry.userId}-${entry.startTime}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">User {entry.userId}</td>
                      <td className="p-2">{entry.startTime}min</td>
                      <td className="p-2">{entry.finishTime}min</td>
                      <td className="p-2">{entry.finishTime - entry.startTime}min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SchedulingAlgorithms;
