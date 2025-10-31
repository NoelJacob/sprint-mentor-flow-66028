import { Nudge } from "@/types";

export const scrumMasterEvents: Record<string, Omit<Nudge, 'id' | 'timestamp'>> = {
  'low-engagement': {
    type: 'warning',
    title: 'Low Engagement Detected',
    description: 'Daily standup attendance has dropped to 70%. Team members may need support or schedule adjustment.',
    actions: [
      { label: 'Schedule 1-on-1s', type: 'accept' },
      { label: 'Adjust Time', type: 'accept' },
      { label: 'Snooze', type: 'snooze' },
    ],
  },
  'overdue-retro': {
    type: 'alert',
    title: 'Retrospective Overdue',
    description: 'Sprint retrospective is 2 days overdue. Schedule immediately to maintain team momentum.',
    actions: [
      { label: 'Schedule Now', type: 'accept' },
      { label: 'Dismiss', type: 'dismiss' },
    ],
  },
  'blocker-added': {
    type: 'alert',
    title: 'New Blocker Added',
    description: '3 stories are now blocked by external dependency. Escalation may be needed.',
    actions: [
      { label: 'Escalate', type: 'escalate' },
      { label: 'Track Progress', type: 'accept' },
      { label: 'Dismiss', type: 'dismiss' },
    ],
  },
  'sprint-health-drop': {
    type: 'warning',
    title: 'Sprint Health Drop',
    description: 'Sprint completion probability dropped from 87% to 65%. Consider scope adjustment.',
    actions: [
      { label: 'Review Scope', type: 'accept' },
      { label: 'Add Capacity', type: 'accept' },
      { label: 'Snooze', type: 'snooze' },
    ],
  },
};

export const techLeadEvents: Record<string, Omit<Nudge, 'id' | 'timestamp'>> = {
  'story-blocked': {
    type: 'alert',
    title: '3 Stories Blocked',
    description: 'Multiple stories are blocked waiting for database schema changes. Consider parallel work or temporary solutions.',
    actions: [
      { label: 'Create Workaround', type: 'accept' },
      { label: 'Escalate', type: 'escalate' },
      { label: 'Dismiss', type: 'dismiss' },
    ],
  },
  'api-delay': {
    type: 'warning',
    title: 'API Delivery Delayed',
    description: 'Third-party API integration is delayed by 3 days. 5 dependent stories may miss sprint deadline.',
    actions: [
      { label: 'Reschedule', type: 'accept' },
      { label: 'Mock API', type: 'accept' },
      { label: 'Escalate', type: 'escalate' },
    ],
  },
  'tech-debt-spike': {
    type: 'warning',
    title: 'Technical Debt Spike',
    description: 'Tech debt increased by 15% this sprint. Consider allocating time for refactoring.',
    actions: [
      { label: 'Schedule Refactor', type: 'accept' },
      { label: 'Review with Team', type: 'accept' },
      { label: 'Snooze', type: 'snooze' },
    ],
  },
  'dependency-risk': {
    type: 'alert',
    title: 'Dependency Risk Alert',
    description: 'Critical path dependency has new blocker. Sprint goal completion at high risk.',
    actions: [
      { label: 'Emergency Review', type: 'accept' },
      { label: 'Escalate', type: 'escalate' },
      { label: 'Dismiss', type: 'dismiss' },
    ],
  },
};
