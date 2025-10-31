import { useState, useEffect, useRef, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { EngagementChart } from "@/components/EngagementChart";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { NudgeHistory } from "@/components/NudgeHistory";
import { SprintHealthScore } from "@/components/SprintHealthScore";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NudgesList } from "@/components/NudgesList";
import { SprintBoard } from "@/components/SprintBoard";
import { Backlog } from "@/components/Backlog";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { toast } from "sonner";

const ScrumMasterDashboard = () => {
  const { scrumMetrics, setScrumMetrics, addActionLog, setCurrentPersona, addNudgeHistory, setSprintHealthScore } = useAppContext();
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona('scrum-master');
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "Team Participation Low",
      description: "Only 60% of team members engaged in last retrospective. Consider trying a new format or sending reminders.",
      actions: [
        { label: "Try New Format", type: "accept" },
        { label: "Send Reminder", type: "accept" },
        { label: "Dismiss", type: "dismiss" },
      ],
      timestamp: new Date(),
      priority: "medium",
      category: "team-health",
    },
  ]);

  const scrollToNudges = useCallback(() => {
    nudgesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleEscalate = useCallback((nudgeId: string) => {
    setNudges(prev => prev.map(n => 
      n.id === nudgeId ? { ...n, taskCreated: true, escalated: true } : n
    ));
  }, []);

  const handleNudgeAction = useCallback((nudgeId: string, actionType: string, actionLabel?: string) => {
    const nudge = nudges.find(n => n.id === nudgeId);
    
    if (actionType === 'dismiss') {
      setNudges(nudges.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success("Nudge dismissed");
      
      if (nudge) {
        addNudgeHistory({
          nudge,
          actionTaken: 'dismiss',
          actionLabel,
          impact: {
            description: "Nudge dismissed - no action taken",
          }
        });
      }
      
      addActionLog({
        action: `Dismissed: ${nudge?.title}`,
        impact: "No immediate changes"
      });
    } else if (actionType === 'snooze') {
      setNudges(nudges.map(n => 
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
    } else {
      setNudges(nudges.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success(`Action taken: ${actionLabel || actionType}`);
      
      if (nudge?.title.includes("Engagement") || nudge?.title.includes("Participation")) {
        const oldValue = scrumMetrics.find(m => m.label === "Team Engagement")?.value;
        const newValue = "85%";
        setScrumMetrics(prev => prev.map(m => 
          m.label === "Team Engagement" 
            ? { ...m, value: newValue, change: 7, trend: "up" as const, status: "healthy" as const }
            : m
        ));
        setSprintHealthScore(prev => Math.min(100, prev + 8));
        
        if (nudge) {
          addNudgeHistory({
            nudge,
            actionTaken: 'accept',
            actionLabel,
            impact: {
              description: "Team engagement improved significantly",
              metricChanges: [{
                metric: "Team Engagement",
                before: oldValue as string,
                after: newValue,
                improvement: "+7%"
              }]
            }
          });
        }
        
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Team engagement improved",
          metricChange: { label: "Team Engagement", from: oldValue as string, to: newValue }
        });
      } else {
        if (nudge) {
          addNudgeHistory({
            nudge,
            actionTaken: 'accept',
            actionLabel,
            impact: {
              description: "Action completed successfully"
            }
          });
        }
        
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Action logged successfully"
        });
      }
    }
  }, [nudges, scrumMetrics, setScrumMetrics, setSprintHealthScore, addActionLog, addNudgeHistory]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Scrum Master Dashboard"
        subtitle="Monitor sprint health and team engagement"
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <SprintHealthScore />

            <SprintBoard />

            <Backlog />

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sprint Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {scrumMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <EngagementChart />

            <NudgesList 
              ref={nudgesRef}
              nudges={nudges}
              onAction={handleNudgeAction}
              onEscalate={handleEscalate}
            />

            <NudgeHistory />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <AIChat />
            <ActionLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
