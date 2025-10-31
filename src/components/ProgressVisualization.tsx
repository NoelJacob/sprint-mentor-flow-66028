import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TaskCategory {
  label: string;
  count: number;
  color: string;
}

export const ProgressVisualization = () => {
  const tasks: TaskCategory[] = [
    { label: "Completed", count: 12, color: "hsl(var(--success))" },
    { label: "In Progress", count: 4, color: "hsl(var(--primary))" },
    { label: "Blocked", count: 2, color: "hsl(var(--destructive))" },
  ];

  const total = tasks.reduce((sum, t) => sum + t.count, 0);
  const completionRate = Math.round((tasks[0].count / total) * 100);

  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold">Sprint Progress</h3>
          <span className="text-xl sm:text-2xl font-bold">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2 sm:h-3" />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {tasks.map((task, idx) => {
          const Icon = idx === 0 ? CheckCircle2 : idx === 1 ? Clock : Circle;
          return (
            <div key={task.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" style={{ color: task.color }} />
                <span className="text-xs sm:text-sm font-medium">{task.label}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="h-2 w-16 sm:w-20 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${(task.count / total) * 100}%`,
                      backgroundColor: task.color 
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold w-5 sm:w-6 text-right">{task.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
