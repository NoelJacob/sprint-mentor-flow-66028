import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Metric, Nudge, DependencyNode, PersonaType, NudgeHistoryEntry, Settings } from '@/types';

interface ActionLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  impact: string;
  metricChange?: { label: string; from: string; to: string };
  causedBy?: string;
}

interface AppContextType {
  currentPersona: PersonaType;
  setCurrentPersona: (persona: PersonaType) => void;
  scrumMetrics: Metric[];
  setScrumMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  techMetrics: Metric[];
  setTechMetrics: React.Dispatch<React.SetStateAction<Metric[]>>;
  actionLog: ActionLogEntry[];
  addActionLog: (entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) => void;
  dependencies: DependencyNode[];
  setDependencies: React.Dispatch<React.SetStateAction<DependencyNode[]>>;
  nudgeHistory: NudgeHistoryEntry[];
  addNudgeHistory: (entry: Omit<NudgeHistoryEntry, 'id' | 'timestamp'>) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  sprintHealthScore: number;
  setSprintHealthScore: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('scrum-master');
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [nudgeHistory, setNudgeHistory] = useState<NudgeHistoryEntry[]>([]);
  const [sprintHealthScore, setSprintHealthScore] = useState(67);
  const [settings, setSettings] = useState<Settings>({
    nudgeFrequency: 'realtime',
    deliveryModes: ['in-app'],
    notificationIntensity: 7,
    enabledCategories: ['team-health', 'blockers', 'velocity', 'engagement'],
  });
  
  const [scrumMetrics, setScrumMetrics] = useState<Metric[]>([
    { label: "Sprint Health", value: "67%", change: 5, trend: "up", status: "healthy" },
    { label: "Team Engagement", value: "78%", change: -8, trend: "down", status: "warning" },
    { label: "Active Blockers", value: 3, trend: "stable", status: "warning" },
    { label: "Velocity", value: "42 pts", change: 12, trend: "up", status: "healthy" },
  ]);

  const [techMetrics, setTechMetrics] = useState<Metric[]>([
    { label: "Stories Completed", value: "12/18", change: 8, trend: "up", status: "healthy" },
    { label: "Tech Debt Score", value: "23%", change: 5, trend: "up", status: "warning" },
    { label: "Blocked Stories", value: 2, trend: "stable", status: "warning" },
    { label: "Code Review Time", value: "4.2h", change: -15, trend: "down", status: "healthy" },
  ]);

  const [dependencies, setDependencies] = useState<DependencyNode[]>([
    {
      id: "1",
      title: "User Authentication API",
      status: "healthy",
      dependencies: [],
    },
    {
      id: "2",
      title: "Payment Integration",
      status: "at-risk",
      dependencies: ["External Payment Gateway", "User Authentication API"],
    },
    {
      id: "3",
      title: "Admin Dashboard",
      status: "blocked",
      dependencies: ["User Authentication API", "Analytics Service"],
    },
  ]);

  const addActionLog = (entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActionLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setActionLog(prev => [newEntry, ...prev]);
  };

  const addNudgeHistory = (entry: Omit<NudgeHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: NudgeHistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNudgeHistory(prev => [newEntry, ...prev]);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        currentPersona,
        setCurrentPersona,
        scrumMetrics,
        setScrumMetrics,
        techMetrics,
        setTechMetrics,
        actionLog,
        addActionLog,
        dependencies,
        setDependencies,
        nudgeHistory,
        addNudgeHistory,
        settings,
        updateSettings,
        sprintHealthScore,
        setSprintHealthScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export type { ActionLogEntry };
