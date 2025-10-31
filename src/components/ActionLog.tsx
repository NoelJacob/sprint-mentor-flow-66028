import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/contexts/AppContext";
import { Clock, TrendingUp, CheckCircle } from "lucide-react";

export const ActionLog = () => {
  const { actionLog } = useAppContext();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="p-3 sm:p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Action History</h3>
      </div>
      
      {actionLog.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-muted-foreground">
          <p className="text-xs sm:text-sm">No actions taken yet</p>
          <p className="text-[10px] sm:text-xs mt-1">Your decisions will appear here</p>
        </div>
      ) : (
        <ScrollArea className="h-[250px] sm:h-[300px] pr-2 sm:pr-4">
          <div className="space-y-2 sm:space-y-3">
            {actionLog.map((entry) => (
              <div key={entry.id} className="border-l-2 border-primary/30 pl-3 sm:pl-4 pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs sm:text-sm font-medium">{entry.action}</p>
                  <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-success">
                  <CheckCircle className="w-3 h-3" />
                  <span>{entry.impact}</span>
                </div>
                {entry.metricChange && (
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                      {entry.metricChange.label}: {entry.metricChange.from} → {entry.metricChange.to}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
