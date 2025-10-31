# Sprint Manager - Jira-Integrated SCRUM Tool

A modern sprint management tool that integrates with Jira and uses AI to provide insights and recommendations for SCRUM teams.

## Features

- **Jira Integration**: Two-way synchronization with Jira for real-time task and sprint management
- **AI-Powered Chat**: Gemini AI integration for intelligent insights and recommendations
- **Role-Based Dashboards**: Personalized views for Scrum Masters and Tech Leads
- **Sprint Board**: Kanban-style board with To Do, In Progress, and Done columns
- **Backlog Management**: Prioritized backlog view
- **Sprint Health Metrics**: Real-time health score and progress tracking
- **Task Tracking**: Simple task management without SCRUM jargon (no story points, velocity, etc.)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun
- Jira account with API access (optional - works with mock data without it)
- Google Gemini API key (optional - works with mock responses without it)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprint-mentor-flow-66028
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Supabase (already configured)
VITE_SUPABASE_PROJECT_ID="tzvcsqfnpvlxdxfnrljp"
VITE_SUPABASE_PUBLISHABLE_KEY="your-key"
VITE_SUPABASE_URL="https://tzvcsqfnpvlxdxfnrljp.supabase.co"

# Jira Configuration (optional)
VITE_JIRA_HOST="your-company.atlassian.net"
VITE_JIRA_EMAIL="your-email@company.com"
VITE_JIRA_API_TOKEN="your-jira-api-token"
VITE_JIRA_PROJECT_KEY="PROJ"
VITE_JIRA_BOARD_ID="1"

# Gemini AI Configuration (optional)
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

#### Getting Jira API Credentials:

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Copy the token and add it to your `.env` file
4. Your Jira host is typically `yourcompany.atlassian.net`
5. Use your Atlassian account email

#### Getting Gemini API Key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

### Scrum Master Dashboard

Access the Scrum Master dashboard at `/scrum-master`. Features include:

- Sprint overview with health metrics
- Sprint board showing tasks in different stages
- Backlog management
- AI chat for insights and recommendations
- Sync button to fetch latest data from Jira

### Tech Lead Dashboard

Access the Tech Lead dashboard at `/tech-lead`. Features include:

- Technical metrics overview
- Task board view
- Blocked tasks alerts
- Dependencies visualization
- AI chat for technical guidance

## Architecture

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend Integration**: Jira API via jira.js
- **AI Integration**: Google Gemini AI
- **State Management**: React Context API

## API Integration

### Jira Service

The `src/services/jiraService.ts` handles all Jira API interactions:

- `fetchJiraIssues()`: Fetch issues from a project
- `fetchJiraSprints()`: Fetch sprints for a board
- `fetchSprintIssues()`: Fetch issues in a specific sprint
- `createJiraIssue()`: Create new issues
- `updateJiraIssueStatus()`: Update issue status

**Note**: The service automatically falls back to mock data when Jira credentials are not configured.

### Gemini Service

The `src/services/geminiService.ts` handles AI interactions:

- `sendChatMessage()`: Send messages to AI and get responses
- `getSprintHealthSuggestions()`: Get AI suggestions for sprint improvement
- `generateNudge()`: Generate AI-powered team alerts

**Note**: The service automatically falls back to mock responses when Gemini API key is not configured.

## Mock Mode

The application works without any API credentials by using mock data:

- **Mock Tasks**: 4 sample tasks with different statuses
- **Mock Sprints**: 2 sample sprints (1 active, 1 future)
- **Mock AI Responses**: Predefined responses for common queries

This allows you to explore the application before setting up API credentials.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AIChat.tsx      # AI chat interface
│   ├── SprintBoard.tsx # Kanban board
│   ├── Backlog.tsx     # Backlog view
│   └── ...
├── contexts/           # React Context providers
│   └── AppContext.tsx  # Global app state
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── ScrumMasterDashboard.tsx
│   └── TechLeadDashboard.tsx
├── services/           # API integrations
│   ├── jiraService.ts  # Jira API client
│   └── geminiService.ts # Gemini AI client
└── types/              # TypeScript type definitions
```

## Terminology

To keep the tool accessible to non-agile users, we use simple terminology:

- **Tasks** (not Stories or User Stories)
- **Sprint** (common term everyone understands)
- **In Progress** (not In Development)
- **Done** (not Completed or Closed)
- **Backlog** (simple queue of upcoming work)

We avoid SCRUM-specific terms like:
- Story Points
- Velocity
- Sprint Points
- Burndown Charts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open a GitHub issue or contact the maintainers.
