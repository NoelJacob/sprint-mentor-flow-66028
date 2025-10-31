import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Metric, Nudge, DependencyNode, PersonaType, NudgeHistoryEntry, Settings, Task, Sprint } from '@/types';
import { fetchJiraIssues, fetchJiraSprints, JiraIssue, JiraSprint } from '@/services/jiraService';

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
  sprints: Sprint[];
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  activeSprint: Sprint | null;
  refreshJiraData: () => Promise<void>;
  isLoadingJira: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to convert JiraIssue to Task
const jiraIssueToTask = (issue: JiraIssue): Task => {
  const statusMap: Record<string, Task['status']> = {
    'To Do': 'to-do',
    'In Progress': 'in-progress',
    'Done': 'done',
    'Blocked': 'blocked',
  };

  return {
    id: issue.id,
    key: issue.key,
    title: issue.summary,
    status: statusMap[issue.status] || 'to-do',
    priority: issue.priority.toLowerCase() as Task['priority'],
    assignee: issue.assignee,
    description: issue.description,
    created: issue.created,
    updated: issue.updated,
  };
};

// Helper function to convert JiraSprint to Sprint
const jiraSprintToSprint = (sprint: JiraSprint): Sprint => ({
  id: sprint.id,
  name: sprint.name,
  state: sprint.state as Sprint['state'],
  startDate: sprint.startDate,
  endDate: sprint.endDate,
  completeDate: sprint.completeDate,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('scrum-master');
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [nudgeHistory, setNudgeHistory] = useState<NudgeHistoryEntry[]>([]);
  const [sprintHealthScore, setSprintHealthScore] = useState(67);
  const [isLoadingJira, setIsLoadingJira] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    nudgeFrequency: 'realtime',
    deliveryModes: ['in-app'],
    notificationIntensity: 7,
    enabledCategories: ['team-health', 'blockers', 'velocity', 'engagement'],
  });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  
  const [scrumMetrics, setScrumMetrics] = useState<Metric[]>([
    { label: "Sprint Health", value: "67%", change: 5, trend: "up", status: "healthy" },
    { label: "Team Engagement", value: "78%", change: -8, trend: "down", status: "warning" },
    { label: "Active Blockers", value: 0, trend: "stable", status: "healthy" },
    { label: "Tasks Completed", value: "0/0", change: 0, trend: "stable", status: "healthy" },
  ]);

  const [techMetrics, setTechMetrics] = useState<Metric[]>([
    { label: "Tasks Completed", value: "0/0", change: 0, trend: "stable", status: "healthy" },
    { label: "Tech Debt", value: "Low", change: 0, trend: "stable", status: "healthy" },
    { label: "Blocked Tasks", value: 0, trend: "stable", status: "healthy" },
    { label: "Review Time", value: "N/A", change: 0, trend: "stable", status: "healthy" },
  ]);

  const [dependencies, setDependencies] = useState<DependencyNode[]>([]);

  // Fetch Jira data on mount
  useEffect(() => {
    refreshJiraData();
  }, []);

  // Refresh Jira data
  const refreshJiraData = async () => {
    setIsLoadingJira(true);
    try {
      const projectKey = import.meta.env.VITE_JIRA_PROJECT_KEY || 'PROJ';
      const boardIdString = import.meta.env.VITE_JIRA_BOARD_ID || '1';
      const boardId = parseInt(boardIdString, 10);
      
      // Validate boardId is a valid number
      if (isNaN(boardId)) {
        console.warn('Invalid VITE_JIRA_BOARD_ID, using default value 1');
      }

      // Fetch sprints and issues
      const [jiraSprints, jiraIssues] = await Promise.all([
        fetchJiraSprints(isNaN(boardId) ? 1 : boardId),
        fetchJiraIssues(projectKey),
      ]);

      // Convert and set sprints
      const convertedSprints = jiraSprints.map(jiraSprintToSprint);
      setSprints(convertedSprints);

      // Find active sprint
      const active = convertedSprints.find(s => s.state === 'active');
      setActiveSprint(active || null);

      // Convert and set tasks
      const convertedTasks = jiraIssues.map(jiraIssueToTask);
      setTasks(convertedTasks);

      // Update metrics based on tasks
      updateMetricsFromTasks(convertedTasks);
    } catch (error) {
      console.error('Error refreshing Jira data:', error);
    } finally {
      setIsLoadingJira(false);
    }
  };

  // Update metrics based on tasks
  const updateMetricsFromTasks = (tasksList: Task[]) => {
    const total = tasksList.length;
    const completed = tasksList.filter(t => t.status === 'done').length;
    const inProgress = tasksList.filter(t => t.status === 'in-progress').length;
    const blocked = tasksList.filter(t => t.status === 'blocked').length;
    const toDo = tasksList.filter(t => t.status === 'to-do').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update scrum metrics
    setScrumMetrics([
      { 
        label: "Sprint Health", 
        value: `${Math.max(20, completionRate)}%`, 
        change: 5, 
        trend: completionRate > 50 ? "up" : "down", 
        status: completionRate > 70 ? "healthy" : completionRate > 40 ? "warning" : "critical" 
      },
      { 
        label: "Team Engagement", 
        value: "78%", 
        change: -8, 
        trend: "down", 
        status: "warning" 
      },
      { 
        label: "Active Blockers", 
        value: blocked, 
        trend: "stable", 
        status: blocked > 0 ? "warning" : "healthy" 
      },
      { 
        label: "Tasks Completed", 
        value: `${completed}/${total}`, 
        change: 0, 
        trend: "stable", 
        status: "healthy" 
      },
    ]);

    // Update tech metrics
    setTechMetrics([
      { 
        label: "Tasks Completed", 
        value: `${completed}/${total}`, 
        change: 0, 
        trend: "stable", 
        status: "healthy" 
      },
      { 
        label: "Tech Debt", 
        value: "Low", 
        change: 0, 
        trend: "stable", 
        status: "healthy" 
      },
      { 
        label: "Blocked Tasks", 
        value: blocked, 
        trend: "stable", 
        status: blocked > 0 ? "warning" : "healthy" 
      },
      { 
        label: "Review Time", 
        value: "4.2h", 
        change: -15, 
        trend: "down", 
        status: "healthy" 
      },
    ]);

    // Update sprint health score
    setSprintHealthScore(Math.max(20, completionRate));
  };

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
        sprints,
        setSprints,
        activeSprint,
        refreshJiraData,
        isLoadingJira,
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
