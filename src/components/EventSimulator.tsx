import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { PersonaType } from "@/types";

interface EventSimulatorProps {
  persona: PersonaType;
  onTriggerEvent: (eventType: string) => void;
}

export const EventSimulator = ({ persona, onTriggerEvent }: EventSimulatorProps) => {
  const scrumMasterEvents = [
    { id: 'low-engagement', label: 'Low Engagement Detected', variant: 'warning' as const },
    { id: 'overdue-retro', label: 'Retrospective Overdue', variant: 'destructive' as const },
    { id: 'blocker-added', label: 'New Blocker Added', variant: 'destructive' as const },
    { id: 'sprint-health-drop', label: 'Sprint Health Drop', variant: 'warning' as const },
  ];

  const techLeadEvents = [
    { id: 'story-blocked', label: '3 Stories Blocked', variant: 'destructive' as const },
    { id: 'api-delay', label: 'API Delivery Delayed', variant: 'warning' as const },
    { id: 'tech-debt-spike', label: 'Tech Debt Spike', variant: 'warning' as const },
    { id: 'dependency-risk', label: 'Dependency Risk Alert', variant: 'destructive' as const },
  ];

  const events = persona === 'scrum-master' ? scrumMasterEvents : techLeadEvents;

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        <h3 className="text-sm sm:text-base font-semibold">Event Simulator</h3>
        <Badge variant="outline" className="ml-auto text-xs">Demo Mode</Badge>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
        Trigger events to see how the AI Coach responds with nudges
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
        {events.map((event) => (
          <Button
            key={event.id}
            variant={event.variant}
            size="sm"
            onClick={() => onTriggerEvent(event.id)}
            className="justify-start text-xs sm:text-sm h-8 sm:h-9"
          >
            {event.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
