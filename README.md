# Sprint Manager - Jira-Synced SCRUM Tool

A personalized sprint management tool with Jira integration and AI assistance powered by Google Gemini.

## Features

- **Jira Integration**: Two-way sync with Jira for tasks, sprints, and backlog
- **AI Assistant**: Gemini-powered chat for sprint insights and recommendations
- **Role-Based Dashboards**: Customized views for Scrum Masters and Tech Leads
- **Sprint Board**: Kanban-style board with To Do, In Progress, Blocked, and Done columns
- **Health Metrics**: Track sprint health, team engagement, and blockers
- **Simple Terms**: Uses familiar terms (Task, Sprint, Blocked, Done) - no complex agile jargon

## Setup

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Jira account (optional - app works with mock data)
- Google Gemini API key (optional - app works with mock responses)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Configure API keys (optional):

Copy `.env.example` to `.env` and fill in your credentials:

```sh
cp .env.example .env
```

Edit `.env`:
```
# Jira Configuration
VITE_JIRA_HOST="your-domain.atlassian.net"
VITE_JIRA_USERNAME="your-email@example.com"
VITE_JIRA_API_TOKEN="your-jira-api-token"

# Gemini AI Configuration
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

**Getting API Keys:**
- **Jira**: Create an API token at https://id.atlassian.com/manage-profile/security/api-tokens
- **Gemini**: Get your API key from https://makersuite.google.com/app/apikey

4. Start the development server:
```sh
npm run dev
```

The app will run at http://localhost:5173

## Usage

### Without API Keys (Demo Mode)

The app works out of the box with mock data:
- Mock Jira tasks and sprints
- Mock AI responses

This is perfect for testing and understanding the interface.

### With Jira Integration

When Jira credentials are configured:
- Tasks are fetched from your Jira instance
- Status updates sync back to Jira
- Backlog items are pulled from Jira

### With Gemini AI

When Gemini API key is configured:
- AI chat provides context-aware sprint insights
- Recommendations based on current sprint data
- Smart responses to your questions

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Jira Integration**: jira-client npm package
- **AI**: @google/generative-ai (Gemini)
- **State Management**: React Context

## Build

```sh
npm run build
```

Built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/       # UI components
├── contexts/        # React context providers
├── pages/           # Page components (dashboards)
├── services/        # API services (Jira, Gemini)
├── types/           # TypeScript type definitions
└── lib/             # Utility functions
```

## Roles

### Scrum Master Dashboard
- Sprint health overview
- Team engagement metrics
- Active blockers tracking
- Sprint board and backlog
- AI-powered suggestions

### Tech Lead Dashboard
- Technical metrics (code review time, tech debt)
- Dependency tracking
- Task completion progress
- Sprint board and backlog
- AI assistance for technical decisions

## Deployment

Deploy to any static hosting service:
- Lovable (built-in deployment)
- Vercel
- Netlify
- GitHub Pages

## Notes

- Jira sync requires proper API credentials
- Gemini API has usage limits on free tier
- Mock data is used as fallback when APIs are not configured
- The app gracefully handles API errors

## Support

For issues or questions, please refer to the [Lovable documentation](https://docs.lovable.dev).
