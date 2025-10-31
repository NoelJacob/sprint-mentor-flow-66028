import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export const SprintHealthScore = () => {
  const { sprintHealthScore, scrumMetrics } = useAppContext();

  const getHealthStatus = () => {
    if (sprintHealthScore >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (sprintHealthScore >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    if (sprintHealthScore >= 40) return { label: 'Fair', color: 'text-amber-600', bgColor: 'bg-amber-500' };
    return { label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-500' };
  };

  const status = getHealthStatus();
  const velocityChange = scrumMetrics.find(m => m.label === "Velocity")?.change || 0;

  return (
    <Card className="p-4 sm:p-6 border-l-4 border-primary bg-gradient-to-br from-primary/10 to-transparent animate-in scale-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Sprint Health Index</h3>
        </div>
        <Badge variant="outline" className={`text-xs ${status.color}`}>
          {status.label}
        </Badge>
      </div>

      <div className="relative mb-4">
        <Progress value={sprintHealthScore} className="h-12 sm:h-16" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl sm:text-3xl font-bold ${status.color}`}>
            {sprintHealthScore}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
        <div>
          <div className="text-muted-foreground mb-1">Poor</div>
          <div className="h-1 bg-red-500 rounded" />
          <div className="text-[10px] text-muted-foreground mt-1">0-39</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Fair</div>
          <div className="h-1 bg-amber-500 rounded" />
          <div className="text-[10px] text-muted-foreground mt-1">40-59</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Good</div>
          <div className="h-1 bg-blue-500 rounded" />
          <div className="text-[10px] text-muted-foreground mt-1">60-79</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Engagement</span>
          <span className="font-medium">
            {scrumMetrics.find(m => m.label === "Team Engagement")?.value}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Blockers</span>
          <span className="font-medium">
            {scrumMetrics.find(m => m.label === "Active Blockers")?.value} active
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Velocity Trend</span>
          <span className={`font-medium flex items-center gap-1 ${velocityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {velocityChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {velocityChange > 0 ? '+' : ''}{velocityChange}%
          </span>
        </div>
      </div>
    </Card>
  );
};