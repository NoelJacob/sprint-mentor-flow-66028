import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Nudge } from "@/types";

interface StandUpSummaryProps {
  nudges: Nudge[];
  activeBlockers: number;
  onViewAll: () => void;
}

export const StandUpSummary = ({ nudges, activeBlockers, onViewAll }: StandUpSummaryProps) => {
  const topNudges = nudges.filter(n => !n.dismissed && !n.snoozed).slice(0, 3);
  const criticalCount = topNudges.filter(n => n.type === 'alert').length;

  return (
    <Card className="p-4 sm:p-6 border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">Stand-Up Summary</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Today
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <Card className="p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-primary">{topNudges.length}</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Top Nudges</div>
        </Card>
        
        <Card className="p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-destructive">{criticalCount}</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Critical</div>
        </Card>
        
        <Card className="p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-amber-600">{activeBlockers}</div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Blockers</div>
        </Card>
      </div>

      <div className="space-y-2 mb-4">
        <Label className="text-xs sm:text-sm font-semibold">Priority Actions</Label>
        
        {topNudges.length === 0 ? (
          <Card className="p-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">All clear! No critical actions needed.</p>
          </Card>
        ) : (
          topNudges.map((nudge, idx) => (
            <Card key={nudge.id} className="p-2 sm:p-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {nudge.type === 'alert' ? (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium mb-1">{nudge.title}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {nudge.actions[0]?.label || 'Action needed'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button 
        onClick={onViewAll}
        variant="outline" 
        className="w-full text-xs sm:text-sm"
      >
        View All Nudges
        <ArrowRight className="w-3 h-3 ml-2" />
      </Button>
    </Card>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);