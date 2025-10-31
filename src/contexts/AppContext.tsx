import React, { createContext, useContext } from "react";
import {
  Metric,
  Nudge,
  DependencyNode,
  PersonaType,
  NudgeHistoryEntry,
  Settings,
} from "@/types";

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
  addActionLog: (entry: Omit<ActionLogEntry, "id" | "timestamp">) => void;
  dependencies: DependencyNode[];
  setDependencies: React.Dispatch<React.SetStateAction<DependencyNode[]>>;
  nudgeHistory: NudgeHistoryEntry[];
  addNudgeHistory: (entry: Omit<NudgeHistoryEntry, "id" | "timestamp">) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  sprintHealthScore: number;
  setSprintHealthScore: React.Dispatch<React.SetStateAction<number>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export type { ActionLogEntry };
