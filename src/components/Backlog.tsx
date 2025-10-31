import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { User, Clock } from "lucide-react";

interface BacklogProps {
  tasks: Task[];
}

export const Backlog = ({ tasks }: BacklogProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const priorityOrder: Record<Task['priority'], number> = { 
    high: 0, 
    medium: 1, 
    low: 2 
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Backlog</h2>
        <Badge variant="outline">{tasks.length} tasks</Badge>
      </div>
      
      {sortedTasks.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No tasks in backlog</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">{task.key}</span>
                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{task.assignee}</span>
                      </div>
                    )}
                    {task.created && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Created {new Date(task.created).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
