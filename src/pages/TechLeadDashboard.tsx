import { useState, useEffect, useRef, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { DependencyMap } from "@/components/DependencyMap";
import { ProgressVisualization } from "@/components/ProgressVisualization";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { NudgeHistory } from "@/components/NudgeHistory";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NudgesList } from "@/components/NudgesList";
import { SprintBoard } from "@/components/SprintBoard";
import { Backlog } from "@/components/Backlog";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { toast } from "sonner";

const TechLeadDashboard = () => {
  const { techMetrics, setTechMetrics, dependencies, setDependencies, addActionLog, setCurrentPersona, addNudgeHistory } = useAppContext();
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona('tech-lead');
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "3 Tasks Blocked by Late API",
      description: "Payment integration API delivery is 2 days late, blocking 3 high-priority tasks.",
      actions: [
        { label: "Escalate", type: "escalate" },
        { label: "Reschedule Tasks", type: "accept" },
        { label: "Dismiss", type: "dismiss" },
      ],
      timestamp: new Date(),
      priority: "high",
      category: "blockers",
    },
  ]);

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
      addActionLog({
        action: `Dismissed: ${nudge?.title}`,
        impact: "No immediate changes"
      });
    } else if (actionType === 'escalate') {
      setNudges(nudges.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success("Issue escalated to stakeholders");
      addActionLog({
        action: `Escalated: ${nudge?.title}`,
        impact: "Stakeholders notified"
      });
    } else {
      setNudges(nudges.map(n => 
        n.id === nudgeId ? { ...n, dismissed: true } : n
      ));
      toast.success(`Action taken: ${actionLabel || actionType}`);
      
      if (nudge?.title.includes("Blocked") || nudge?.title.includes("Tasks")) {
        const oldValue = techMetrics.find(m => m.label === "Blocked Tasks")?.value;
        setDependencies(prev => prev.map(d => 
          d.status === 'blocked' ? { ...d, status: 'at-risk' as const } : d
        ));
        setTechMetrics(prev => prev.map(m => 
          m.label === "Blocked Tasks" 
            ? { ...m, value: 0, status: "healthy" as const }
            : m
        ));
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Blockers resolved, dependencies updated",
          metricChange: { label: "Blocked Tasks", from: String(oldValue), to: "0" }
        });
      } else if (nudge?.title.includes("Tech Debt") || nudge?.title.includes("Technical")) {
        const oldValue = techMetrics.find(m => m.label === "Tech Debt Score")?.value;
        setTechMetrics(prev => prev.map(m => 
          m.label === "Tech Debt Score" 
            ? { ...m, value: "18%", change: -5, trend: "down" as const, status: "healthy" as const }
            : m
        ));
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Tech debt reduced",
          metricChange: { label: "Tech Debt", from: oldValue as string, to: "18%" }
        });
      } else {
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Action logged successfully"
        });
      }
    }
  }, [nudges, techMetrics, setTechMetrics, setDependencies, addActionLog]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Tech Lead Dashboard"
        subtitle="Track tasks, dependencies, and technical health"
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <SprintBoard />

            <Backlog />

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Technical Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {techMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <ProgressVisualization />

            <DependencyMap nodes={dependencies} />

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

export default TechLeadDashboard;
