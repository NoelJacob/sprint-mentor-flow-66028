import { useState, useEffect, useRef, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { EventSimulator } from "@/components/EventSimulator";
import { DependencyMap } from "@/components/DependencyMap";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { ProgressVisualization } from "@/components/ProgressVisualization";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { NudgeHistory } from "@/components/NudgeHistory";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TrendAnalytics } from "@/components/TrendAnalytics";
import { RiskSimulation } from "@/components/RiskSimulation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NudgesList } from "@/components/NudgesList";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { toast } from "sonner";

const TechLeadDashboard = () => {
  const {
    techMetrics,
    setTechMetrics,
    dependencies,
    setDependencies,
    addActionLog,
    setCurrentPersona,
    addNudgeHistory,
  } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona("tech-lead");
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "3 User Stories Blocked by Late API",
      description:
        "Payment integration API delivery is 2 days late, blocking 3 high-priority stories.",
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

  const handleEscalate = useCallback((nudgeId: string) => {
    setNudges((prev) =>
      prev.map((n) =>
        n.id === nudgeId ? { ...n, taskCreated: true, escalated: true } : n
      )
    );
  }, []);

  const handleNudgeAction = useCallback(
    (nudgeId: string, actionType: string, actionLabel?: string) => {
      const nudge = nudges.find((n) => n.id === nudgeId);

      if (actionType === "dismiss") {
        setNudges(
          nudges.map((n) => (n.id === nudgeId ? { ...n, dismissed: true } : n))
        );
        toast.success("Nudge dismissed");
        addActionLog({
          action: `Dismissed: ${nudge?.title}`,
          impact: "No immediate changes",
        });
      } else if (actionType === "escalate") {
        setNudges(
          nudges.map((n) => (n.id === nudgeId ? { ...n, dismissed: true } : n))
        );
        toast.success("Issue escalated to stakeholders");
        addActionLog({
          action: `Escalated: ${nudge?.title}`,
          impact: "Stakeholders notified",
        });
      } else {
        setNudges(
          nudges.map((n) => (n.id === nudgeId ? { ...n, dismissed: true } : n))
        );
        toast.success(`Action taken: ${actionLabel || actionType}`);

        // Update dependencies and metrics with visual feedback
        if (
          nudge?.title.includes("Blocked") ||
          nudge?.title.includes("Stories")
        ) {
          const oldValue = techMetrics.find(
            (m) => m.label === "Blocked Stories"
          )?.value;
          setDependencies((prev) =>
            prev.map((d) =>
              d.status === "blocked" ? { ...d, status: "at-risk" as const } : d
            )
          );
          setTechMetrics((prev) =>
            prev.map((m) =>
              m.label === "Blocked Stories"
                ? { ...m, value: 0, status: "healthy" as const }
                : m
            )
          );
          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Blockers resolved, dependencies updated",
            metricChange: {
              label: "Blocked Stories",
              from: String(oldValue),
              to: "0",
            },
          });
        } else if (
          nudge?.title.includes("Tech Debt") ||
          nudge?.title.includes("Technical")
        ) {
          const oldValue = techMetrics.find(
            (m) => m.label === "Tech Debt Score"
          )?.value;
          setTechMetrics((prev) =>
            prev.map((m) =>
              m.label === "Tech Debt Score"
                ? {
                    ...m,
                    value: "18%",
                    change: -5,
                    trend: "down" as const,
                    status: "healthy" as const,
                  }
                : m
            )
          );
          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Tech debt reduced",
            metricChange: {
              label: "Tech Debt",
              from: oldValue as string,
              to: "18%",
            },
          });
        } else {
          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Action logged successfully",
          });
        }
      }
    },
    [nudges, techMetrics, setTechMetrics, setDependencies, addActionLog]
  );

  const handleTriggerEvent = useCallback(
    (eventType: string) => {
      const eventNudges = {
        "story-blocked": {
          id: Date.now().toString(),
          type: "alert" as const,
          title: "3 Stories Blocked",
          description:
            "Multiple stories are blocked waiting for database schema changes. Consider parallel work or temporary solutions.",
          actions: [
            { label: "Create Workaround", type: "accept" as const },
            { label: "Escalate", type: "escalate" as const },
            { label: "Dismiss", type: "dismiss" as const },
          ],
          timestamp: new Date(),
        },
        "api-delay": {
          id: Date.now().toString(),
          type: "warning" as const,
          title: "API Delivery Delayed",
          description:
            "Third-party API integration is delayed by 3 days. 5 dependent stories may miss sprint deadline.",
          actions: [
            { label: "Reschedule", type: "accept" as const },
            { label: "Mock API", type: "accept" as const },
            { label: "Escalate", type: "escalate" as const },
          ],
          timestamp: new Date(),
        },
        "tech-debt-spike": {
          id: Date.now().toString(),
          type: "warning" as const,
          title: "Technical Debt Spike",
          description:
            "Tech debt increased by 15% this sprint. Consider allocating time for refactoring.",
          actions: [
            { label: "Schedule Refactor", type: "accept" as const },
            { label: "Review with Team", type: "accept" as const },
            { label: "Snooze", type: "snooze" as const },
          ],
          timestamp: new Date(),
        },
        "dependency-risk": {
          id: Date.now().toString(),
          type: "alert" as const,
          title: "Dependency Risk Alert",
          description:
            "Critical path dependency has new blocker. Sprint goal completion at high risk.",
          actions: [
            { label: "Emergency Review", type: "accept" as const },
            { label: "Escalate", type: "escalate" as const },
            { label: "Dismiss", type: "dismiss" as const },
          ],
          timestamp: new Date(),
        },
      };

      const newNudge = eventNudges[eventType as keyof typeof eventNudges];
      if (newNudge) {
        setNudges((prev) => [newNudge, ...prev]);
        toast.info("New event triggered!");

        // Update metrics and dependencies
        if (eventType === "story-blocked") {
          setTechMetrics((prev) =>
            prev.map((m) =>
              m.label === "Blocked Stories"
                ? {
                    ...m,
                    value: 5,
                    trend: "up" as const,
                    status: "critical" as const,
                  }
                : m
            )
          );
          setDependencies((prev) =>
            prev.map((d, idx) =>
              idx === 0 ? { ...d, status: "blocked" as const } : d
            )
          );
        } else if (eventType === "tech-debt-spike") {
          setTechMetrics((prev) =>
            prev.map((m) =>
              m.label === "Tech Debt Score"
                ? {
                    ...m,
                    value: "38%",
                    change: 15,
                    trend: "up" as const,
                    status: "critical" as const,
                  }
                : m
            )
          );
        }
      }
    },
    [setTechMetrics, setDependencies]
  );

  return (
    <div className="min-h-screen bg-background">
      <OnboardingDialog
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        persona="tech-lead"
      />

      <DashboardHeader
        title="Tech Lead Dashboard"
        subtitle="Track stories, dependencies, and technical health"
        onShowGuide={() => setShowOnboarding(true)}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Story & Code Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {techMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <ProgressVisualization />

            <DependencyMap nodes={dependencies} />

            <TrendAnalytics />

            <NudgesList
              ref={nudgesRef}
              nudges={nudges}
              onAction={handleNudgeAction}
              onEscalate={handleEscalate}
            />

            <NudgeHistory />
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* <SettingsPanel /> */}
            {/* <RiskSimulation /> */}
            {/* <EventSimulator
              persona="tech-lead"
              onTriggerEvent={handleTriggerEvent}
            /> */}
            {/* <ActionLog /> */}
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechLeadDashboard;
