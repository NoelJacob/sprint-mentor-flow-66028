# Welcome to Sprint Mentor Flow

A personalized, Jira-like project management tool for SCRUM teams with AI-powered coaching and insights.

## Project info

**URL**: https://lovable.dev/projects/b032f44c-6a5e-4a24-b79b-4607a5cbfa4d

## Features

- **Multi-Persona Experience**: Different dashboards for Scrum Masters and Tech Leads
- **AI Coach**: Context-aware AI assistant powered by Google Gemini 2.0
- **Real-time Metrics**: Sprint health, velocity, team engagement, and more
- **Smart Nudges**: AI-generated suggestions to improve team processes
- **Dependency Tracking**: Visual dependency maps and blocker identification
- **Analytics**: Trend analysis and actionable insights

## Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI**: shadcn-ui, Tailwind CSS
- **Backend**: Tauri (Rust)
- **AI**: Google Gemini 2.0 Flash
- **Database**: Supabase (transitioning to Jira)

## Setup

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Rust & Cargo (for Tauri)

### Installation

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# Step 5: Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=https://your-project.supabase.co

# Gemini API Configuration
# Get your API key at: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## AI Integration

The AI Coach feature uses Google Gemini 2.0 to provide context-aware coaching. The AI has access to:

- Current metrics (velocity, engagement, blockers, etc.)
- Team dependencies and their status
- Recent actions and their impacts
- Sprint health score
- User persona (Scrum Master or Tech Lead)

For detailed documentation, see [src/integrations/gemini/README.md](src/integrations/gemini/README.md)

## Development

### How can I edit this code?

### Editing Options

There are several ways of editing your application:

#### Use Lovable

Visit the [Lovable Project](https://lovable.dev/projects/b032f44c-6a5e-4a24-b79b-4607a5cbfa4d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

#### Use your preferred IDE

Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

#### Edit directly in GitHub

Navigate to the desired file(s), click the "Edit" button (pencil icon), make changes, and commit.

#### Use GitHub Codespaces

Navigate to the main page, click "Code" → "Codespaces" → "New codespace" to launch a cloud environment.

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn-ui base components
│   ├── AIChat.tsx    # AI Coach chat interface
│   └── ...
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
│   └── useGeminiChat.ts  # Gemini chat integration hook
├── integrations/     # External API integrations
│   ├── gemini/       # Gemini AI integration
│   └── supabase/     # Supabase integration
├── pages/            # Top-level page components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

src-tauri/
└── src/              # Rust backend code
```

## Deployment

### Deploy to Lovable

Simply open [Lovable](https://lovable.dev/projects/b032f44c-6a5e-4a24-b79b-4607a5cbfa4d) and click on Share → Publish.

### Custom Domain

To connect a domain, navigate to Project → Settings → Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.
