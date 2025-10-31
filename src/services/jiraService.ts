import { Version3Client } from 'jira.js';

// Jira configuration from environment variables
const jiraConfig = {
  host: import.meta.env.VITE_JIRA_HOST || '',
  authentication: {
    basic: {
      email: import.meta.env.VITE_JIRA_EMAIL || '',
      apiToken: import.meta.env.VITE_JIRA_API_TOKEN || '',
    },
  },
};

let jiraClient: Version3Client | null = null;

// Initialize Jira client
export const initJiraClient = () => {
  if (!jiraConfig.host || !jiraConfig.authentication.basic.email || !jiraConfig.authentication.basic.apiToken) {
    console.warn('Jira credentials not configured. Running in mock mode.');
    return null;
  }
  
  if (!jiraClient) {
    jiraClient = new Version3Client(jiraConfig);
  }
  return jiraClient;
};

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  assignee?: string;
  priority: string;
  created: string;
  updated: string;
  description?: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: 'active' | 'future' | 'closed';
  startDate?: string;
  endDate?: string;
  completeDate?: string;
}

// Define interface for Jira API issue response
interface JiraApiIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: { displayName: string };
    priority?: { name: string };
    created: string;
    updated: string;
    description?: string;
  };
}

// Fetch issues from a Jira project
export const fetchJiraIssues = async (projectKey: string): Promise<JiraIssue[]> => {
  const client = initJiraClient();
  
  if (!client) {
    // Return mock data when Jira is not configured
    return getMockIssues();
  }

  try {
    const response = await client.issueSearch.searchForIssuesUsingJql({
      jql: `project = ${projectKey} ORDER BY updated DESC`,
      maxResults: 100,
      fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'description'],
    });

    return response.issues?.map((issue: JiraApiIssue) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name || 'Medium',
      created: issue.fields.created,
      updated: issue.fields.updated,
      description: issue.fields.description,
    })) || [];
  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    return getMockIssues();
  }
};

// Define interface for Jira API sprint response
interface JiraApiSprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
}

// Fetch sprints for a board
export const fetchJiraSprints = async (boardId: number): Promise<JiraSprint[]> => {
  const client = initJiraClient();
  
  if (!client) {
    return getMockSprints();
  }

  try {
    const response = await client.board.getAllSprints({
      boardId,
    });

    return response.values?.map((sprint: JiraApiSprint) => ({
      id: sprint.id,
      name: sprint.name,
      state: sprint.state.toLowerCase() as JiraSprint['state'],
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      completeDate: sprint.completeDate,
    })) || [];
  } catch (error) {
    console.error('Error fetching Jira sprints:', error);
    return getMockSprints();
  }
};

// Fetch issues for a specific sprint
export const fetchSprintIssues = async (sprintId: number): Promise<JiraIssue[]> => {
  const client = initJiraClient();
  
  if (!client) {
    return getMockIssues();
  }

  try {
    const response = await client.issueSearch.searchForIssuesUsingJql({
      jql: `sprint = ${sprintId} ORDER BY status ASC`,
      maxResults: 100,
      fields: ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'description'],
    });

    return response.issues?.map((issue: JiraApiIssue) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name || 'Medium',
      created: issue.fields.created,
      updated: issue.fields.updated,
      description: issue.fields.description,
    })) || [];
  } catch (error) {
    console.error('Error fetching sprint issues:', error);
    return getMockIssues();
  }
};

// Create a new issue in Jira
export const createJiraIssue = async (
  projectKey: string,
  summary: string,
  description: string,
  issueType: string = 'Task'
): Promise<JiraIssue | null> => {
  const client = initJiraClient();
  
  if (!client) {
    console.log('Mock: Would create issue:', { projectKey, summary, description, issueType });
    return null;
  }

  try {
    const response = await client.issues.createIssue({
      fields: {
        project: { key: projectKey },
        summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: description }],
            },
          ],
        },
        issuetype: { name: issueType },
      },
    });

    return {
      id: response.id!,
      key: response.key!,
      summary,
      status: 'To Do',
      priority: 'Medium',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      description,
    };
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    return null;
  }
};

// Update issue status
export const updateJiraIssueStatus = async (
  issueKey: string,
  transitionId: string
): Promise<boolean> => {
  const client = initJiraClient();
  
  if (!client) {
    console.log('Mock: Would update issue status:', { issueKey, transitionId });
    return false;
  }

  try {
    await client.issues.doTransition({
      issueIdOrKey: issueKey,
      transition: { id: transitionId },
    });
    return true;
  } catch (error) {
    console.error('Error updating Jira issue status:', error);
    return false;
  }
};

// Mock data for when Jira is not configured
const getMockIssues = (): JiraIssue[] => [
  {
    id: '1',
    key: 'PROJ-101',
    summary: 'Implement user authentication',
    status: 'In Progress',
    assignee: 'John Doe',
    priority: 'High',
    created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Add OAuth2 authentication to the application',
  },
  {
    id: '2',
    key: 'PROJ-102',
    summary: 'Fix payment gateway integration',
    status: 'To Do',
    assignee: 'Jane Smith',
    priority: 'High',
    created: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Resolve issues with payment processing',
  },
  {
    id: '3',
    key: 'PROJ-103',
    summary: 'Update dashboard UI',
    status: 'Done',
    assignee: 'Mike Johnson',
    priority: 'Medium',
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Refresh the dashboard design',
  },
  {
    id: '4',
    key: 'PROJ-104',
    summary: 'Add reporting features',
    status: 'To Do',
    priority: 'Low',
    created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Implement analytics and reporting',
  },
];

const getMockSprints = (): JiraSprint[] => [
  {
    id: 1,
    name: 'Sprint 1',
    state: 'active',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Sprint 2',
    state: 'future',
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
