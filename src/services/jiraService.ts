import JiraClient from 'jira-client';

// Jira configuration from environment variables
const jiraConfig = {
  protocol: 'https',
  host: import.meta.env.VITE_JIRA_HOST || '',
  username: import.meta.env.VITE_JIRA_USERNAME || '',
  password: import.meta.env.VITE_JIRA_API_TOKEN || '',
  apiVersion: '2',
  strictSSL: true,
};

let jiraClient: JiraClient | null = null;

// Initialize Jira client only if credentials are provided
const getJiraClient = (): JiraClient | null => {
  if (!jiraConfig.host || !jiraConfig.username || !jiraConfig.password) {
    console.warn('Jira credentials not configured. Using mock data.');
    return null;
  }
  
  if (!jiraClient) {
    jiraClient = new JiraClient(jiraConfig);
  }
  return jiraClient;
};

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description?: string;
  status: string;
  assignee?: string;
  priority?: string;
  created: string;
  updated: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: 'active' | 'closed' | 'future';
  startDate?: string;
  endDate?: string;
  goal?: string;
}

// Mock data for when Jira is not configured
const mockIssues: JiraIssue[] = [
  {
    id: '1',
    key: 'DEMO-1',
    summary: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'In Progress',
    assignee: 'John Doe',
    priority: 'High',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: '2',
    key: 'DEMO-2',
    summary: 'Design dashboard layout',
    description: 'Create responsive dashboard design',
    status: 'To Do',
    assignee: 'Jane Smith',
    priority: 'Medium',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: '3',
    key: 'DEMO-3',
    summary: 'Fix login bug',
    description: 'Users cannot login with special characters',
    status: 'Done',
    assignee: 'Bob Johnson',
    priority: 'High',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: '4',
    key: 'DEMO-4',
    summary: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'Blocked',
    assignee: 'Alice Williams',
    priority: 'High',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
];

const mockSprints: JiraSprint[] = [
  {
    id: 1,
    name: 'Sprint 1',
    state: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 'Complete core authentication and dashboard features',
  },
];

// Fetch issues from Jira or return mock data
export const fetchJiraIssues = async (projectKey?: string): Promise<JiraIssue[]> => {
  const client = getJiraClient();
  
  if (!client) {
    // Return mock data when Jira is not configured
    return Promise.resolve(mockIssues);
  }

  try {
    const searchResults = await client.searchJira(
      projectKey ? `project = ${projectKey}` : 'order by created DESC',
      {
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'description'],
      }
    );

    return searchResults.issues.map((issue: any) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
    }));
  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    // Fallback to mock data on error
    return mockIssues;
  }
};

// Fetch sprints from Jira or return mock data
export const fetchJiraSprints = async (boardId?: number): Promise<JiraSprint[]> => {
  const client = getJiraClient();
  
  if (!client) {
    return Promise.resolve(mockSprints);
  }

  try {
    const response = await client.getAllSprints(boardId || 0);
    return response.values.map((sprint: any) => ({
      id: sprint.id,
      name: sprint.name,
      state: sprint.state.toLowerCase(),
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      goal: sprint.goal,
    }));
  } catch (error) {
    console.error('Error fetching Jira sprints:', error);
    return mockSprints;
  }
};

// Update issue status in Jira
export const updateJiraIssueStatus = async (
  issueKey: string,
  transitionName: string
): Promise<boolean> => {
  const client = getJiraClient();
  
  if (!client) {
    console.log(`Mock: Updated ${issueKey} to ${transitionName}`);
    return Promise.resolve(true);
  }

  try {
    // Get available transitions
    const transitions = await client.listTransitions(issueKey);
    const transition = transitions.transitions.find(
      (t: any) => t.name.toLowerCase() === transitionName.toLowerCase()
    );

    if (!transition) {
      console.error(`Transition "${transitionName}" not found for issue ${issueKey}`);
      return false;
    }

    await client.transitionIssue(issueKey, {
      transition: { id: transition.id },
    });

    return true;
  } catch (error) {
    console.error('Error updating Jira issue:', error);
    return false;
  }
};

// Get backlog items (issues not in a sprint)
export const fetchBacklogItems = async (projectKey?: string): Promise<JiraIssue[]> => {
  const client = getJiraClient();
  
  if (!client) {
    // Return subset of mock issues as backlog
    return Promise.resolve(mockIssues.slice(0, 2));
  }

  try {
    const searchResults = await client.searchJira(
      `project = ${projectKey || ''} AND sprint is EMPTY`,
      {
        maxResults: 100,
        fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'description'],
      }
    );

    return searchResults.issues.map((issue: any) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
    }));
  } catch (error) {
    console.error('Error fetching backlog items:', error);
    return mockIssues.slice(0, 2);
  }
};

// Check if Jira is configured
export const isJiraConfigured = (): boolean => {
  return !!(jiraConfig.host && jiraConfig.username && jiraConfig.password);
};
