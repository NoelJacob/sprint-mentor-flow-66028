import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle } from "lucide-react";

export const NudgeHistory = () => {
  const { nudgeHistory } = useAppContext();

  const thisWeek = nudgeHistory.filter(entry => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.timestamp > weekAgo;
  });

  const lastWeek = nudgeHistory.filter(entry => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entry.timestamp > twoWeeksAgo && entry.timestamp <= weekAgo;
  });

  const acceptedCount = thisWeek.filter(e => e.actionTaken === 'accept').length;
  const dismissedCount = thisWeek.filter(e => e.actionTaken === 'dismiss').length;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Nudge History & Insights</h3>
        <Badge variant="outline" className="text-xs">
          {nudgeHistory.length} Total
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card className="p-3 sm:p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs sm:text-sm text-muted-foreground">Accepted</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{acceptedCount}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">This week</p>
        </Card>
        
        <Card className="p-3 sm:p-4 border-l-4 border-gray-300">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-muted-foreground">Dismissed</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{dismissedCount}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">This week</p>
        </Card>
      </div>

      <Tabs defaultValue="this-week" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="this-week" className="text-xs sm:text-sm">This Week</TabsTrigger>
          <TabsTrigger value="last-week" className="text-xs sm:text-sm">Last Week</TabsTrigger>
        </TabsList>

        <TabsContent value="this-week" className="mt-0">
          <ScrollArea className="h-[300px] sm:h-[400px]">
            <div className="space-y-3">
              {thisWeek.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">No history this week</p>
              ) : (
                thisWeek.map(entry => (
                  <Card key={entry.id} className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-xs sm:text-sm flex-1">{entry.nudge.title}</h4>
                      <Badge 
                        variant={entry.actionTaken === 'accept' ? 'default' : 'secondary'}
                        className="text-[10px] flex-shrink-0"
                      >
                        {entry.actionLabel || entry.actionTaken}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{entry.impact.description}</p>
                    
                    {entry.impact.metricChanges && entry.impact.metricChanges.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {entry.impact.metricChanges.map((change, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{change.metric}:</span>
                            <span className="text-muted-foreground">{change.before}</span>
                            <span>→</span>
                            <span className="font-semibold">{change.after}</span>
                            <span className={`flex items-center gap-1 ${change.improvement.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {change.improvement.includes('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {change.improvement}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="last-week" className="mt-0">
          <ScrollArea className="h-[300px] sm:h-[400px]">
            <div className="space-y-3">
              {lastWeek.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">No history last week</p>
              ) : (
                lastWeek.map(entry => (
                  <Card key={entry.id} className="p-3 sm:p-4 opacity-75">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-xs sm:text-sm flex-1">{entry.nudge.title}</h4>
                      <Badge 
                        variant="outline"
                        className="text-[10px] flex-shrink-0"
                      >
                        {entry.actionLabel || entry.actionTaken}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{entry.impact.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};