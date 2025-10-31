import { useState, useEffect, useRef, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { EventSimulator } from "@/components/EventSimulator";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { EngagementChart } from "@/components/EngagementChart";
import { ActionLog } from "@/components/ActionLog";
import { AIChat } from "@/components/AIChat";
import { NudgeHistory } from "@/components/NudgeHistory";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TrendAnalytics } from "@/components/TrendAnalytics";
import { RiskSimulation } from "@/components/RiskSimulation";
import { StandUpSummary } from "@/components/StandUpSummary";
import { SprintHealthScore } from "@/components/SprintHealthScore";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NudgesList } from "@/components/NudgesList";
import { useAppContext } from "@/contexts/AppContext";
import { Nudge } from "@/types";
import { toast } from "sonner";

const ScrumMasterDashboard = () => {
  const {
    scrumMetrics,
    setScrumMetrics,
    addActionLog,
    setCurrentPersona,
    addNudgeHistory,
    setSprintHealthScore,
  } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const nudgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPersona("scrum-master");
  }, [setCurrentPersona]);

  const [nudges, setNudges] = useState<Nudge[]>([
    {
      id: "1",
      type: "warning",
      title: "Retrospective Participation Low",
      description:
        "Only 60% of team members engaged in last retro. Consider trying a new format or sending reminders.",
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
    nudgesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

        if (nudge) {
          addNudgeHistory({
            nudge,
            actionTaken: "dismiss",
            actionLabel,
            impact: {
              description: "Nudge dismissed - no action taken",
            },
          });
        }

        addActionLog({
          action: `Dismissed: ${nudge?.title}`,
          impact: "No immediate changes",
        });
      } else if (actionType === "snooze") {
        setNudges(
          nudges.map((n) => (n.id === nudgeId ? { ...n, snoozed: true } : n))
        );
        toast.info("Nudge snoozed for 24 hours");
        setTimeout(() => {
          setNudges((prev) =>
            prev.map((n) => (n.id === nudgeId ? { ...n, snoozed: false } : n))
          );
        }, 2000);
        addActionLog({
          action: `Snoozed: ${nudge?.title}`,
          impact: "Will remind in 24 hours",
        });
      } else {
        setNudges(
          nudges.map((n) => (n.id === nudgeId ? { ...n, dismissed: true } : n))
        );
        toast.success(`Action taken: ${actionLabel || actionType}`);

        // Update metrics based on action with visual feedback
        if (
          nudge?.title.includes("Engagement") ||
          nudge?.title.includes("Participation")
        ) {
          const oldValue = scrumMetrics.find(
            (m) => m.label === "Team Engagement"
          )?.value;
          const newValue = "85%";
          setScrumMetrics((prev) =>
            prev.map((m) =>
              m.label === "Team Engagement"
                ? {
                    ...m,
                    value: newValue,
                    change: 7,
                    trend: "up" as const,
                    status: "healthy" as const,
                  }
                : m
            )
          );
          setSprintHealthScore((prev) => Math.min(100, prev + 8));

          if (nudge) {
            addNudgeHistory({
              nudge,
              actionTaken: "accept",
              actionLabel,
              impact: {
                description: "Team engagement improved significantly",
                metricChanges: [
                  {
                    metric: "Team Engagement",
                    before: oldValue as string,
                    after: newValue,
                    improvement: "+7%",
                  },
                ],
              },
            });
          }

          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Team engagement improved",
            metricChange: {
              label: "Team Engagement",
              from: oldValue as string,
              to: newValue,
            },
          });
        } else if (nudge?.title.includes("Retrospective")) {
          const oldValue = scrumMetrics.find(
            (m) => m.label === "Sprint Health"
          )?.value;
          const newValue = "75%";
          setScrumMetrics((prev) =>
            prev.map((m) =>
              m.label === "Sprint Health"
                ? {
                    ...m,
                    value: newValue,
                    change: 8,
                    trend: "up" as const,
                    status: "healthy" as const,
                  }
                : m
            )
          );
          setSprintHealthScore((prev) => Math.min(100, prev + 8));

          if (nudge) {
            addNudgeHistory({
              nudge,
              actionTaken: "accept",
              actionLabel,
              impact: {
                description:
                  "Sprint health improved through better retrospectives",
                metricChanges: [
                  {
                    metric: "Sprint Health",
                    before: oldValue as string,
                    after: newValue,
                    improvement: "+8%",
                  },
                ],
              },
            });
          }

          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Sprint health improved",
            metricChange: {
              label: "Sprint Health",
              from: oldValue as string,
              to: newValue,
            },
          });
        } else {
          if (nudge) {
            addNudgeHistory({
              nudge,
              actionTaken: "accept",
              actionLabel,
              impact: {
                description: "Action completed successfully",
              },
            });
          }

          addActionLog({
            action: `${actionLabel || "Accepted"}: ${nudge?.title}`,
            impact: "Action logged successfully",
          });
        }
      }
    },
    [
      nudges,
      scrumMetrics,
      setScrumMetrics,
      setSprintHealthScore,
      addActionLog,
      addNudgeHistory,
    ]
  );

  const handleTriggerEvent = useCallback(
    (eventType: string) => {
      const eventNudges = {
        "low-engagement": {
          id: Date.now().toString(),
          type: "warning" as const,
          title: "Low Engagement Detected",
          description:
            "Daily standup attendance has dropped to 70%. Team members may need support or schedule adjustment.",
          actions: [
            { label: "Schedule 1-on-1s", type: "accept" as const },
            { label: "Adjust Time", type: "accept" as const },
            { label: "Snooze", type: "snooze" as const },
          ],
          timestamp: new Date(),
        },
        "overdue-retro": {
          id: Date.now().toString(),
          type: "alert" as const,
          title: "Retrospective Overdue",
          description:
            "Sprint retrospective is 2 days overdue. Schedule immediately to maintain team momentum.",
          actions: [
            { label: "Schedule Now", type: "accept" as const },
            { label: "Dismiss", type: "dismiss" as const },
          ],
          timestamp: new Date(),
        },
        "blocker-added": {
          id: Date.now().toString(),
          type: "alert" as const,
          title: "New Blocker Added",
          description:
            "3 stories are now blocked by external dependency. Escalation may be needed.",
          actions: [
            { label: "Escalate", type: "escalate" as const },
            { label: "Track Progress", type: "accept" as const },
            { label: "Dismiss", type: "dismiss" as const },
          ],
          timestamp: new Date(),
        },
        "sprint-health-drop": {
          id: Date.now().toString(),
          type: "warning" as const,
          title: "Sprint Health Drop",
          description:
            "Sprint completion probability dropped from 87% to 65%. Consider scope adjustment.",
          actions: [
            { label: "Review Scope", type: "accept" as const },
            { label: "Add Capacity", type: "accept" as const },
            { label: "Snooze", type: "snooze" as const },
          ],
          timestamp: new Date(),
        },
      };

      const newNudge = eventNudges[eventType as keyof typeof eventNudges];
      if (newNudge) {
        setNudges((prev) => [newNudge, ...prev]);
        toast.info("New event triggered!");

        // Update metrics
        if (eventType === "low-engagement") {
          setScrumMetrics((prev) =>
            prev.map((m) =>
              m.label === "Team Engagement"
                ? {
                    ...m,
                    value: "70%",
                    change: -8,
                    trend: "down" as const,
                    status: "critical" as const,
                  }
                : m
            )
          );
        } else if (eventType === "blocker-added") {
          setScrumMetrics((prev) =>
            prev.map((m) =>
              m.label === "Active Blockers"
                ? {
                    ...m,
                    value: 6,
                    trend: "up" as const,
                    status: "critical" as const,
                  }
                : m
            )
          );
        }
      }
    },
    [setScrumMetrics]
  );

  return (
    <div className="min-h-screen bg-background">
      <OnboardingDialog
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        persona="scrum-master"
      />

      <DashboardHeader
        title="Scrum Master Dashboard"
        subtitle="Monitor sprint health and team engagement"
        onShowGuide={() => setShowOnboarding(true)}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <SprintHealthScore />

            <StandUpSummary
              nudges={nudges}
              activeBlockers={
                (scrumMetrics.find((m) => m.label === "Active Blockers")
                  ?.value as number) || 0
              }
              onViewAll={scrollToNudges}
            />

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Sprint Health Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {scrumMetrics.map((metric, idx) => (
                  <MetricCard key={idx} metric={metric} />
                ))}
              </div>
            </div>

            <EngagementChart />

            <TrendAnalytics />

            <NudgesList
              ref={nudgesRef}
              nudges={nudges}
              onAction={handleNudgeAction}
              onEscalate={handleEscalate}
            />

            {/* <NudgeHistory /> */}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* <SettingsPanel /> */}
            {/* <RiskSimulation /> */}
            {/* <EventSimulator
              persona="scrum-master"
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

export default ScrumMasterDashboard;
