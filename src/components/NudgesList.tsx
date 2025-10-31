import { NudgeCard } from "@/components/NudgeCard";
import { Nudge } from "@/types";
import { forwardRef } from "react";

interface NudgesListProps {
  nudges: Nudge[];
  onAction: (nudgeId: string, actionType: string, actionLabel?: string) => void;
  onEscalate: (nudgeId: string) => void;
}

export const NudgesList = forwardRef<HTMLDivElement, NudgesListProps>(
  ({ nudges, onAction, onEscalate }, ref) => {
    const activeNudges = nudges.filter(n => !n.dismissed && !n.snoozed);

    return (
      <div ref={ref}>
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">AI Nudges</h2>
        <div className="space-y-2 sm:space-y-3">
          {activeNudges.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <p className="text-sm sm:text-base">All caught up! No active nudges.</p>
              <p className="text-xs sm:text-sm mt-2">Use the simulator to trigger events →</p>
            </div>
          ) : (
            activeNudges.map(nudge => (
              <NudgeCard 
                key={nudge.id} 
                nudge={nudge} 
                onAction={onAction}
                onEscalate={onEscalate}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

NudgesList.displayName = "NudgesList";
