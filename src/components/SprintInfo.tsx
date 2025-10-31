import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sprint } from "@/types";
import { Calendar, Activity } from "lucide-react";

interface SprintInfoProps {
  sprint: Sprint;
  tasksTotal: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksBlocked: number;
}

export const SprintInfo = ({ 
  sprint, 
  tasksTotal, 
  tasksCompleted, 
  tasksInProgress,
  tasksBlocked 
}: SprintInfoProps) => {
  const completionPercentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
  
  const getStateColor = (state: string) => {
    switch (state) {
      case 'active':
        return 'default';
      case 'future':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getDaysRemaining = () => {
    if (!sprint.endDate) return null;
    const end = new Date(sprint.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold mb-2">{sprint.name}</h2>
          <Badge variant={getStateColor(sprint.state)} className="capitalize">
            {sprint.state}
          </Badge>
        </div>
        {sprint.state === 'active' && daysRemaining !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{daysRemaining}</div>
            <div className="text-xs text-muted-foreground">days left</div>
          </div>
        )}
      </div>

      {sprint.startDate && sprint.endDate && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
          </span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">{tasksCompleted} of {tasksTotal} completed</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-right mt-1">
            {completionPercentage}%
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-muted-foreground">Total</span>
            </div>
            <div className="text-2xl font-bold">{tasksTotal}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">Done</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{tasksCompleted}</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-muted-foreground">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{tasksInProgress}</div>
          </div>
          
          {tasksBlocked > 0 && (
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-muted-foreground">Blocked</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{tasksBlocked}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
