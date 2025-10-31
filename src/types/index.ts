export type PersonaType = 'scrum-master' | 'tech-lead';
export type NudgePriority = 'low' | 'medium' | 'high' | 'critical';
export type NudgeFrequency = 'realtime' | 'daily' | 'weekly' | 'custom';
export type DeliveryMode = 'in-app' | 'slack' | 'email';

export interface Nudge {
  id: string;
  type: 'info' | 'warning' | 'alert';
  title: string;
  description: string;
  actions: NudgeAction[];
  timestamp: Date;
  dismissed?: boolean;
  snoozed?: boolean;
  priority?: NudgePriority;
  category?: string;
  comments?: NudgeComment[];
  assignedTo?: string[];
  escalated?: boolean;
  taskCreated?: boolean;
}

export interface NudgeComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
}

export interface NudgeHistoryEntry {
  id: string;
  nudge: Nudge;
  actionTaken: string;
  actionLabel?: string;
  timestamp: Date;
  impact: {
    description: string;
    metricChanges?: { metric: string; before: string; after: string; improvement: string }[];
  };
}

export interface Settings {
  nudgeFrequency: NudgeFrequency;
  deliveryModes: DeliveryMode[];
  notificationIntensity: number; // 1-10
  enabledCategories: string[];
}

export interface NudgeAction {
  label: string;
  type: 'accept' | 'dismiss' | 'snooze' | 'escalate';
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'healthy' | 'warning' | 'critical';
}

export interface UserStory {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high';
  blockedBy?: string;
}

export interface DependencyNode {
  id: string;
  title: string;
  status: 'healthy' | 'at-risk' | 'blocked';
  dependencies: string[];
}
