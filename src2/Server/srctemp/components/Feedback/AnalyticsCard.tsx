
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsCardProps {
  title: string;
  description?: string;
  type: 'bar' | 'pie' | 'line';
  data: Array<Record<string, any>>;
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  children?: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  description,
  type,
  data,
  dataKey,
  nameKey = 'name',
  colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  children
}) => {
  const chartConfig = {
    rating1: { label: '1 Star', color: '#EDE9FE' },
    rating2: { label: '2 Stars', color: '#DDD6FE' },
    rating3: { label: '3 Stars', color: '#C4B5FD' },
    rating4: { label: '4 Stars', color: '#A78BFA' },
    rating5: { label: '5 Stars', color: '#8B5CF6' },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={dataKey} fill={colors[0]} />
            </BarChart>
          </ChartContainer>
        );
      
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      
      case 'line':
        return (
          <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey={dataKey} stroke={colors[0]} activeDot={{ r: 8 }} />
            </LineChart>
          </ChartContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
