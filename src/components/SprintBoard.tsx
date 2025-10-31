import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchJiraIssues, isJiraConfigured, updateJiraIssueStatus } from "@/services/jiraService";
import { Task } from "@/types";
import { toast } from "sonner";

export const SprintBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const issues = await fetchJiraIssues();
      const mappedTasks: Task[] = issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        title: issue.summary,
        description: issue.description,
        status: issue.status as Task['status'],
        priority: (issue.priority || 'Medium') as Task['priority'],
        assignee: issue.assignee,
        created: issue.created,
        updated: issue.updated,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks from Jira');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await loadTasks();
    setIsSyncing(false);
    toast.success('Synced with Jira');
  };

  const handleTaskMove = async (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateJiraIssueStatus(task.key, newStatus);
      toast.success(`Task moved to ${newStatus}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task in Jira');
      // Revert on error
      setTasks(tasks.map(t => t.id === taskId ? task : t));
    }
  };

  const columns: { title: string; status: Task['status']; color: string }[] = [
    { title: 'To Do', status: 'To Do', color: 'bg-slate-100 dark:bg-slate-900' },
    { title: 'In Progress', status: 'In Progress', color: 'bg-blue-50 dark:bg-blue-950' },
    { title: 'Blocked', status: 'Blocked', color: 'bg-red-50 dark:bg-red-950' },
    { title: 'Done', status: 'Done', color: 'bg-green-50 dark:bg-green-950' },
  ];

  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(task => task.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Sprint Board</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isJiraConfigured() ? 'Synced with Jira' : 'Using demo data'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="ml-2">Sync</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <Card key={column.status} className={`${column.color} border-2`}>
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {getTasksByStatus(column.status).length}
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="p-3 space-y-2">
                {getTasksByStatus(column.status).map(task => (
                  <Card 
                    key={task.id}
                    className="p-3 bg-background hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {task.key}
                        </span>
                        <Badge 
                          variant={getPriorityColor(task.priority) as any}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm font-medium line-clamp-2">
                        {task.title}
                      </p>
                      
                      {task.assignee && (
                        <p className="text-xs text-muted-foreground">
                          {task.assignee}
                        </p>
                      )}

                      {/* Quick action buttons for demo */}
                      <div className="flex gap-1 flex-wrap mt-2">
                        {column.status !== 'To Do' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleTaskMove(task.id, 'To Do')}
                          >
                            ← To Do
                          </Button>
                        )}
                        {column.status !== 'In Progress' && column.status !== 'Done' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleTaskMove(task.id, 'In Progress')}
                          >
                            → Progress
                          </Button>
                        )}
                        {column.status !== 'Done' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleTaskMove(task.id, 'Done')}
                          >
                            ✓ Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {getTasksByStatus(column.status).length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        ))}
      </div>
    </div>
  );
};
