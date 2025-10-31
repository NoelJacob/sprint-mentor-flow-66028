import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { NudgeCard } from "@/components/NudgeCard";
import { EventSimulator } from "@/components/EventSimulator";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { EngagementChart } from "@/components/EngagementChart";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { NudgeHistory } from "@/components/NudgeHistory";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TrendAnalytics } from "@/components/TrendAnalytics";
import { RiskSimulation } from "@/components/RiskSimulation";
import { StandUpSummary } from "@/components/StandUpSummary";
import { SprintHealthScore } from "@/components/SprintHealthScore";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ScrumMasterDashboard = () => {
  const navigate = useNavigate();
  const { scrumMetrics, setScrumMetrics, addActionLog, setCurrentPersona, addNudgeHistory, setSprintHealthScore } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona('scrum-master');
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "Retrospective Participation Low",
      description: "Only 60% of team members engaged in last retro. Consider trying a new format or sending reminders.",
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

  const scrollToNudges = () => {
    nudgesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      
      // Update metrics based on action with visual feedback
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
      } else if (nudge?.title.includes("Retrospective")) {
        const oldValue = scrumMetrics.find(m => m.label === "Sprint Health")?.value;
        const newValue = "75%";
        setScrumMetrics(prev => prev.map(m => 
          m.label === "Sprint Health" 
            ? { ...m, value: newValue, change: 8, trend: "up" as const, status: "healthy" as const }
            : m
        ));
        setSprintHealthScore(prev => Math.min(100, prev + 8));
        
        if (nudge) {
          addNudgeHistory({
            nudge,
            actionTaken: 'accept',
            actionLabel,
            impact: {
              description: "Sprint health improved through better retrospectives",
              metricChanges: [{
                metric: "Sprint Health",
                before: oldValue as string,
                after: newValue,
                improvement: "+8%"
              }]
            }
          });
        }
        
        addActionLog({
          action: `${actionLabel || 'Accepted'}: ${nudge?.title}`,
          impact: "Sprint health improved",
          metricChange: { label: "Sprint Health", from: oldValue as string, to: newValue }
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
  };

  const handleTriggerEvent = (eventType: string) => {
    const eventNudges: Record<string, Nudge> = {
      'low-engagement': {
        id: Date.now().toString(),
        type: 'warning',
        title: 'Low Engagement Detected',
        description: 'Daily standup attendance has dropped to 70%. Team members may need support or schedule adjustment.',
        actions: [
          { label: 'Schedule 1-on-1s', type: 'accept' },
          { label: 'Adjust Time', type: 'accept' },
          { label: 'Snooze', type: 'snooze' },
        ],
        timestamp: new Date(),
      },
      'overdue-retro': {
        id: Date.now().toString(),
        type: 'alert',
        title: 'Retrospective Overdue',
        description: 'Sprint retrospective is 2 days overdue. Schedule immediately to maintain team momentum.',
        actions: [
          { label: 'Schedule Now', type: 'accept' },
          { label: 'Dismiss', type: 'dismiss' },
        ],
        timestamp: new Date(),
      },
      'blocker-added': {
        id: Date.now().toString(),
        type: 'alert',
        title: 'New Blocker Added',
        description: '3 stories are now blocked by external dependency. Escalation may be needed.',
        actions: [
          { label: 'Escalate', type: 'escalate' },
          { label: 'Track Progress', type: 'accept' },
          { label: 'Dismiss', type: 'dismiss' },
        ],
        timestamp: new Date(),
      },
      'sprint-health-drop': {
        id: Date.now().toString(),
        type: 'warning',
        title: 'Sprint Health Drop',
        description: 'Sprint completion probability dropped from 87% to 65%. Consider scope adjustment.',
        actions: [
          { label: 'Review Scope', type: 'accept' },
          { label: 'Add Capacity', type: 'accept' },
          { label: 'Snooze', type: 'snooze' },
        ],
        timestamp: new Date(),
      },
    };

    const newNudge = eventNudges[eventType];
    if (newNudge) {
      setNudges(prev => [newNudge, ...prev]);
      toast.info("New event triggered!");
      
      // Update metrics
      if (eventType === 'low-engagement') {
        setScrumMetrics(prev => prev.map(m => 
          m.label === "Team Engagement" 
            ? { ...m, value: "70%", change: -8, trend: "down" as const, status: "critical" as const }
            : m
        ));
      } else if (eventType === 'blocker-added') {
        setScrumMetrics(prev => prev.map(m => 
          m.label === "Active Blockers" 
            ? { ...m, value: 6, trend: "up" as const, status: "critical" as const }
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
        persona="scrum-master"
      />
      
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Scrum Master Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Monitor sprint health and team engagement</p>
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
            <SprintHealthScore />

            <StandUpSummary 
              nudges={nudges}
              activeBlockers={scrumMetrics.find(m => m.label === "Active Blockers")?.value as number || 0}
              onViewAll={scrollToNudges}
            />

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sprint Health Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {scrumMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <EngagementChart />

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
              persona="scrum-master"
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

export default ScrumMasterDashboard;
