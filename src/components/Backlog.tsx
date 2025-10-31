import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ListTodo } from "lucide-react";
import { fetchBacklogItems } from "@/services/jiraService";
import { Task } from "@/types";

export const Backlog = () => {
  const [backlogItems, setBacklogItems] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBacklog = async () => {
      setIsLoading(true);
      try {
        const issues = await fetchBacklogItems();
        const mappedTasks: Task[] = issues.map(issue => ({
          id: issue.id,
          key: issue.key,
          title: issue.summary,
          description: issue.description,
          status: 'To Do' as Task['status'],
          priority: (issue.priority || 'Medium') as Task['priority'],
          assignee: issue.assignee,
          created: issue.created,
          updated: issue.updated,
        }));
        setBacklogItems(mappedTasks);
      } catch (error) {
        console.error('Error loading backlog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBacklog();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <ListTodo className="w-5 h-5 text-primary" />
        <h3 className="text-base sm:text-lg font-semibold">Backlog</h3>
        <Badge variant="secondary" className="ml-auto">
          {backlogItems.length}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {backlogItems.map(item => (
              <Card key={item.id} className="p-3 hover:bg-accent transition-colors">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.key}
                    </span>
                    <Badge 
                      variant={getPriorityColor(item.priority) as any}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium">
                    {item.title}
                  </p>
                  
                  {item.assignee && (
                    <p className="text-xs text-muted-foreground">
                      Assignee: {item.assignee}
                    </p>
                  )}
                </div>
              </Card>
            ))}
            
            {backlogItems.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No items in backlog
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
