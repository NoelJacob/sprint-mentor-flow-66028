import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, X, MessageSquare, Users, Briefcase, TrendingUp } from "lucide-react";
import { Nudge } from "@/types";
import { toast } from "sonner";

interface NudgeCardProps {
  nudge: Nudge;
  onAction: (nudgeId: string, actionType: string, actionLabel?: string) => void;
  onEscalate?: (nudgeId: string) => void;
}

export const NudgeCard = ({ nudge, onAction, onEscalate }: NudgeCardProps) => {
  if (nudge.dismissed) return null;

  const handleEscalate = () => {
    onEscalate?.(nudge.id);
    toast.success("Task created in workflow system");
  };

  const handleComment = () => {
    toast.info("Comment feature - Team discussion enabled");
  };

  const getPriorityColor = () => {
    switch (nudge.priority) {
      case 'critical':
        return 'border-red-500';
      case 'high':
        return 'border-orange-500';
      case 'medium':
        return 'border-yellow-500';
      default:
        return 'border-gray-300';
    }
  };

  const getIcon = () => {
    switch (nudge.type) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getBorderColor = () => {
    switch (nudge.type) {
      case 'alert':
        return 'border-l-4 border-destructive';
      case 'warning':
        return 'border-l-4 border-warning';
      case 'info':
        return 'border-l-4 border-primary';
    }
  };

  return (
    <Card className={`p-3 sm:p-4 ${getBorderColor()} ${getPriorityColor()} animate-in slide-in-from-right duration-300`}>
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-xs sm:text-sm">{nudge.title}</h4>
                {nudge.priority && (
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {nudge.priority}
                  </Badge>
                )}
                {nudge.taskCreated && (
                  <Badge variant="secondary" className="text-[10px]">
                    <Briefcase className="w-2 h-2 mr-1" />
                    Task Created
                  </Badge>
                )}
                {nudge.escalated && (
                  <Badge variant="destructive" className="text-[10px]">
                    <TrendingUp className="w-2 h-2 mr-1" />
                    Escalated
                  </Badge>
                )}
              </div>
              {nudge.category && (
                <Badge variant="outline" className="text-[10px] mb-2">
                  {nudge.category}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
              onClick={() => onAction(nudge.id, 'dismiss')}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{nudge.description}</p>
          
          {nudge.assignedTo && nudge.assignedTo.length > 0 && (
            <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Assigned to: {nudge.assignedTo.join(', ')}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
            {nudge.actions.map((action, idx) => {
              const getVariant = () => {
                switch (action.type) {
                  case 'accept':
                    return 'default';
                  case 'escalate':
                    return 'warning';
                  case 'snooze':
                    return 'outline';
                  case 'dismiss':
                    return 'ghost';
                  default:
                    return 'outline';
                }
              };

              return (
                <Button
                  key={idx}
                  size="sm"
                  variant={getVariant()}
                  onClick={() => {
                    if (action.type === 'escalate' && onEscalate) {
                      handleEscalate();
                    } else {
                      onAction(nudge.id, action.type, action.label);
                    }
                  }}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComment}
                className="text-xs h-7"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Comment
                {nudge.comments && nudge.comments.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-[10px] h-4">
                    {nudge.comments.length}
                  </Badge>
                )}
              </Button>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(nudge.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
