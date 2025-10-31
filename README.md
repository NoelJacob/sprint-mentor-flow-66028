# Sprint Manager - Jira-Integrated SCRUM Tool

A modern sprint management tool that seamlessly integrates with Jira and uses AI to provide intelligent insights for SCRUM teams.

## 🚀 Features

- **Jira Integration**: Two-way synchronization with Jira for real-time task and sprint data
- **AI-Powered Chat**: Gemini AI integration for intelligent insights and recommendations
- **Role-Based Dashboards**: Personalized views for Scrum Masters and Tech Leads
- **Sprint Board**: Clean Kanban-style board (To Do → In Progress → Done)
- **Backlog Management**: Simple, prioritized task backlog
- **Health Metrics**: Real-time sprint health score and progress tracking
- **Mock Mode**: Works without any API credentials for quick demos

## 🎯 Design Philosophy

This tool is designed to be **simple and accessible**:
- ✅ Uses common terms everyone understands (Tasks, Sprint, In Progress, Done)
- ❌ No SCRUM jargon (Story Points, Velocity, Burndown Charts)
- ✅ Clean, focused interface without overwhelming features
- ✅ Works immediately with mock data, connects to Jira when ready

## 🏃 Quick Start

### Run Without Setup (Mock Mode)

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd sprint-mentor-flow-66028

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:8080` and explore with mock data!

### Connect to Jira and Gemini (Optional)

1. Copy the environment template:
```bash
cp .env.template .env
```

2. Edit `.env` and add your credentials:
   - **Jira**: Get API token from [Atlassian](https://id.atlassian.com/manage-profile/security/api-tokens)
   - **Gemini**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Restart the dev server

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## 📱 User Roles

### Scrum Master Dashboard (`/scrum-master`)
- Sprint overview with health metrics
- Sprint board showing all tasks
- Backlog management
- Team insights from AI
- Sync button to refresh Jira data

### Tech Lead Dashboard (`/tech-lead`)
- Technical metrics overview
- Task board with focus on blockers
- Dependencies visualization
- Task completion statistics
- AI technical guidance

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Jira API**: jira.js client library
- **AI**: Google Gemini AI
- **State**: React Context API

## 📦 Project Structure

```
src/
├── components/       # UI components
│   ├── SprintBoard.tsx
│   ├── Backlog.tsx
│   ├── AIChat.tsx
│   └── ...
├── services/        # API integrations
│   ├── jiraService.ts
│   └── geminiService.ts
├── pages/           # Page components
│   ├── ScrumMasterDashboard.tsx
│   └── TechLeadDashboard.tsx
└── contexts/        # State management
```

## 🔧 Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌟 Key Integrations

### Jira Service
- Automatic sync with Jira projects
- Fetch issues, sprints, and boards
- Create and update issues
- Falls back to mock data when not configured

### Gemini AI Service
- Context-aware chat responses
- Sprint health suggestions
- Smart team nudges
- Falls back to predefined responses when not configured

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup and configuration guide
- [.env.template](./.env.template) - Environment variables template

## 🤝 Contributing

This project was built with [Lovable](https://lovable.dev/projects/b032f44c-6a5e-4a24-b79b-4607a5cbfa4d).

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details
