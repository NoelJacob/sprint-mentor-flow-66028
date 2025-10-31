import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { NudgeCard } from "@/components/NudgeCard";
import { EventSimulator } from "@/components/EventSimulator";
import { DependencyMap } from "@/components/DependencyMap";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { ProgressVisualization } from "@/components/ProgressVisualization";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { NudgeHistory } from "@/components/NudgeHistory";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TrendAnalytics } from "@/components/TrendAnalytics";
import { RiskSimulation } from "@/components/RiskSimulation";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TechLeadDashboard = () => {
  const navigate = useNavigate();
  const { techMetrics, setTechMetrics, dependencies, setDependencies, addActionLog, setCurrentPersona, addNudgeHistory } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona('tech-lead');
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "3 User Stories Blocked by Late API",
      description: "Payment integration API delivery is 2 days late, blocking 3 high-priority stories.",
      actions: [
        { label: "Escalate", type: "escalate" },
        { label: "Reschedule Stories", type: "accept" },
        { label: "Dismiss", type: "dismiss" },
      ],
      timestamp: new Date(),
      priority: "high",
      category: "blockers",
    },
  ]);

  const handleEscalate = (nudgeId: string) => {
    setNudges(nudges.map(n => 
      n.id === nudgeId ? { ...n, taskCreated: true, escalated: true } : n
    ));
  };

  const handleNudgeAction = (nudgeId: string, actionType: string, actionLabel?: string) => {
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
      
      // Update dependencies and metrics with visual feedback
      if (nudge?.title.includes("Blocked") || nudge?.title.includes("Stories")) {
        const oldValue = techMetrics.find(m => m.label === "Blocked Stories")?.value;
        setDependencies(prev => prev.map(d => 
          d.status === 'blocked' ? { ...d, status: 'at-risk' as const } : d
        ));
        setTechMetrics(prev => prev.map(m => 
          m.label === "Blocked Stories" 
            ? { ...m, value: 0, status: "healthy" as const }
            : m
        ));
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Blockers resolved, dependencies updated",
          metricChange: { label: "Blocked Stories", from: String(oldValue), to: "0" }
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
  };

  const handleTriggerEvent = (eventType: string) => {
    const eventNudges: Record<string, Nudge> = {
      'story-blocked': {
        id: Date.now().toString(),
        type: 'alert',
        title: '3 Stories Blocked',
        description: 'Multiple stories are blocked waiting for database schema changes. Consider parallel work or temporary solutions.',
        actions: [
          { label: 'Create Workaround', type: 'accept' },
          { label: 'Escalate', type: 'escalate' },
          { label: 'Dismiss', type: 'dismiss' },
        ],
        timestamp: new Date(),
      },
      'api-delay': {
        id: Date.now().toString(),
        type: 'warning',
        title: 'API Delivery Delayed',
        description: 'Third-party API integration is delayed by 3 days. 5 dependent stories may miss sprint deadline.',
        actions: [
          { label: 'Reschedule', type: 'accept' },
          { label: 'Mock API', type: 'accept' },
          { label: 'Escalate', type: 'escalate' },
        ],
        timestamp: new Date(),
      },
      'tech-debt-spike': {
        id: Date.now().toString(),
        type: 'warning',
        title: 'Technical Debt Spike',
        description: 'Tech debt increased by 15% this sprint. Consider allocating time for refactoring.',
        actions: [
          { label: 'Schedule Refactor', type: 'accept' },
          { label: 'Review with Team', type: 'accept' },
          { label: 'Snooze', type: 'snooze' },
        ],
        timestamp: new Date(),
      },
      'dependency-risk': {
        id: Date.now().toString(),
        type: 'alert',
        title: 'Dependency Risk Alert',
        description: 'Critical path dependency has new blocker. Sprint goal completion at high risk.',
        actions: [
          { label: 'Emergency Review', type: 'accept' },
          { label: 'Escalate', type: 'escalate' },
          { label: 'Dismiss', type: 'dismiss' },
        ],
        timestamp: new Date(),
      },
    };

    const newNudge = eventNudges[eventType];
    if (newNudge) {
      setNudges(prev => [newNudge, ...prev]);
      toast.info("New event triggered!");
      
      // Update metrics and dependencies
      if (eventType === 'story-blocked') {
        setTechMetrics(prev => prev.map(m => 
          m.label === "Blocked Stories" 
            ? { ...m, value: 5, trend: "up" as const, status: "critical" as const }
            : m
        ));
        setDependencies(prev => prev.map((d, idx) => 
          idx === 0 ? { ...d, status: 'blocked' as const } : d
        ));
      } else if (eventType === 'tech-debt-spike') {
        setTechMetrics(prev => prev.map(m => 
          m.label === "Tech Debt Score" 
            ? { ...m, value: "38%", change: 15, trend: "up" as const, status: "critical" as const }
            : m
        ));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingDialog 
        open={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        persona="tech-lead"
      />
      
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Tech Lead Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Track stories, dependencies, and technical health</p>
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <PersonaSwitcher />
              <Button variant="outline" size="sm" onClick={() => setShowOnboarding(true)} className="whitespace-nowrap">
                Show Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Story & Code Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {techMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <ProgressVisualization />

            <DependencyMap nodes={dependencies} />

            <TrendAnalytics />

            <div ref={nudgesRef}>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">AI Nudges</h2>
              <div className="space-y-2 sm:space-y-3">
                {nudges.filter(n => !n.dismissed && !n.snoozed).length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <p className="text-sm sm:text-base">All caught up! No active nudges.</p>
                    <p className="text-xs sm:text-sm mt-2">Use the simulator to trigger events →</p>
                  </div>
                ) : (
                  nudges
                    .filter(n => !n.dismissed && !n.snoozed)
                    .map(nudge => (
                      <NudgeCard 
                        key={nudge.id} 
                        nudge={nudge} 
                        onAction={handleNudgeAction}
                        onEscalate={handleEscalate}
                      />
                    ))
                )}
              </div>
            </div>

            <NudgeHistory />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <SettingsPanel />
            <RiskSimulation />
            <EventSimulator 
              persona="tech-lead"
              onTriggerEvent={handleTriggerEvent}
            />
            <ActionLog />
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechLeadDashboard;
