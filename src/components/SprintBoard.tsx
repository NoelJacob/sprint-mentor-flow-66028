import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { Clock, User, AlertCircle } from "lucide-react";

interface SprintBoardProps {
  tasks: Task[];
}

export const SprintBoard = ({ tasks }: SprintBoardProps) => {
  const columns = [
    { id: 'to-do', title: 'To Do', color: 'bg-slate-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div key={column.id} className="flex flex-col">
            <div className={`${column.color} rounded-t-lg p-3 border-b-2 border-gray-300`}>
              <h3 className="font-semibold text-sm flex items-center justify-between">
                <span>{column.title}</span>
                <Badge variant="secondary" className="ml-2">
                  {columnTasks.length}
                </Badge>
              </h3>
            </div>
            <div className="flex-1 bg-gray-50 rounded-b-lg p-2 min-h-[400px] space-y-2">
              {columnTasks.map((task) => (
                <Card key={task.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground">{task.key}</span>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} title={task.priority} />
                  </div>
                  <h4 className="text-sm font-medium mb-2 line-clamp-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{task.assignee}</span>
                      </div>
                    )}
                    {task.status === 'blocked' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>Blocked</span>
                      </div>
                    )}
                  </div>
                  {task.updated && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(task.updated).toLocaleDateString()}</span>
                    </div>
                  )}
                </Card>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
