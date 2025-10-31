import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Metric } from "@/types";

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'healthy':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'critical':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (!metric.trend) return null;
    
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-3 sm:p-4 hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <span className="text-xs sm:text-sm text-muted-foreground font-medium">{metric.label}</span>
        {metric.status && (
          <Badge variant="outline" className={`${getStatusColor(metric.status)} text-[10px] sm:text-xs px-1.5 sm:px-2`}>
            {metric.status}
          </Badge>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl sm:text-3xl font-bold">{metric.value}</span>
        {metric.change !== undefined && (
          <div className="flex items-center gap-0.5 sm:gap-1">
            {getTrendIcon()}
            <span className={`text-xs sm:text-sm font-medium ${
              metric.trend === 'up' ? 'text-success' : 
              metric.trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
