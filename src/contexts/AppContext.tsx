import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Metric, Nudge, DependencyNode, PersonaType, NudgeHistoryEntry, Settings, Task } from '@/types';
import { fetchJiraIssues } from '@/services/jiraService';

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
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  refreshTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('scrum-master');
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [nudgeHistory, setNudgeHistory] = useState<NudgeHistoryEntry[]>([]);
  const [sprintHealthScore, setSprintHealthScore] = useState(67);
  const [tasks, setTasks] = useState<Task[]>([]);
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
    { label: "Task Count", value: "12/18", change: 12, trend: "up", status: "healthy" },
  ]);

  const [techMetrics, setTechMetrics] = useState<Metric[]>([
    { label: "Tasks Completed", value: "12/18", change: 8, trend: "up", status: "healthy" },
    { label: "Tech Debt Score", value: "23%", change: 5, trend: "up", status: "warning" },
    { label: "Blocked Tasks", value: 2, trend: "stable", status: "warning" },
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

  const refreshTasks = async () => {
    try {
      const issues = await fetchJiraIssues();
      const mappedTasks: Task[] = issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        title: issue.summary,
        description: issue.description,
        status: issue.status as Task['status'],
        priority: (issue.priority || 'Medium') as Task['priority'],
        assignee: issue.assignee,
        created: issue.created,
        updated: issue.updated,
      }));
      setTasks(mappedTasks);
      
      // Update metrics based on tasks
      const totalTasks = mappedTasks.length;
      const completedTasks = mappedTasks.filter(t => t.status === 'Done').length;
      const blockedTasks = mappedTasks.filter(t => t.status === 'Blocked').length;
      
      setScrumMetrics(prev => prev.map(m => {
        if (m.label === 'Active Blockers') return { ...m, value: blockedTasks };
        if (m.label === 'Task Count') return { ...m, value: `${completedTasks}/${totalTasks}` };
        return m;
      }));
      
      setTechMetrics(prev => prev.map(m => {
        if (m.label === 'Blocked Tasks') return { ...m, value: blockedTasks };
        if (m.label === 'Tasks Completed') return { ...m, value: `${completedTasks}/${totalTasks}` };
        return m;
      }));
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

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
        tasks,
        setTasks,
        refreshTasks,
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
