import { useState, useCallback } from 'react';
import { Nudge, Metric } from '@/types';
import { toast } from 'sonner';

interface UseNudgeHandlerProps {
  initialNudges: Nudge[];
  metrics: Metric[];
  setMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  addActionLog: (entry: { action: string; impact: string; metricChange?: { label: string; from: string; to: string } }) => void;
  addNudgeHistory: (entry: { nudge: Nudge; actionTaken: string; actionLabel?: string; impact: { description: string } }) => void;
  setSprintHealthScore?: React.Dispatch<React.SetStateAction<number>>;
}

export const useNudgeHandler = ({
  initialNudges,
  metrics,
  setMetrics,
  addActionLog,
  addNudgeHistory,
  setSprintHealthScore,
}: UseNudgeHandlerProps) => {
  const [nudges, setNudges] = useState<Nudge[]>(initialNudges);

  const handleEscalate = useCallback((nudgeId: string) => {
    setNudges(prev => prev.map(n => 
      n.id === nudgeId ? { ...n, taskCreated: true, escalated: true } : n
    ));
  }, []);

  const handleNudgeAction = useCallback((nudgeId: string, actionType: string, actionLabel?: string) => {
    const nudge = nudges.find(n => n.id === nudgeId);
    
    if (actionType === 'dismiss') {
      setNudges(prev => prev.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success("Nudge dismissed");
      
      if (nudge) {
        addNudgeHistory({
          nudge,
          actionTaken: 'dismiss',
          actionLabel,
          impact: { description: "Nudge dismissed - no action taken" }
        });
      }
      
      addActionLog({
        action: `Dismissed: ${nudge?.title}`,
        impact: "No immediate changes"
      });
    } else if (actionType === 'snooze') {
      setNudges(prev => prev.map(n => 
        n.id === nudgeId ? { ...n, snoozed: true } : n
      ));
      toast.info("Nudge snoozed for 24 hours");
      
      setTimeout(() => {
        setNudges(prev => prev.map(n => 
          n.id === nudgeId ? { ...n, snoozed: false } : n
        ));
      }, 2000);
      
      addActionLog({
        action: `Snoozed: ${nudge?.title}`,
        impact: "Will remind in 24 hours"
      });
    } else if (actionType === 'escalate') {
      setNudges(prev => prev.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success("Issue escalated to stakeholders");
      
      addActionLog({
        action: `Escalated: ${nudge?.title}`,
        impact: "Stakeholders notified"
      });
    } else {
      setNudges(prev => prev.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success(`Action taken: ${actionLabel || actionType}`);
      
      if (nudge) {
        addNudgeHistory({
          nudge,
          actionTaken: 'accept',
          actionLabel,
          impact: { description: "Action completed successfully" }
        });
      }
      
      addActionLog({
        action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
        impact: "Action logged successfully"
      });
    }
  }, [nudges, addActionLog, addNudgeHistory]);

  return {
    nudges,
    setNudges,
    handleEscalate,
    handleNudgeAction,
  };
};
