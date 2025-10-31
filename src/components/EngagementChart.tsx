import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface EngagementChartProps {
  data?: { day: string; engagement: number }[];
}

export const EngagementChart = ({ data }: EngagementChartProps) => {
  const defaultData = [
    { day: 'Mon', engagement: 85 },
    { day: 'Tue', engagement: 82 },
    { day: 'Wed', engagement: 78 },
    { day: 'Thu', engagement: 75 },
    { day: 'Fri', engagement: 78 },
  ];

  const chartData = data || defaultData;
  const currentEngagement = chartData[chartData.length - 1].engagement;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold">Team Engagement Trend</h3>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xl sm:text-2xl font-bold">{currentEngagement}%</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Current</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={180} className="sm:h-[200px]">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="day" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="engagement" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
