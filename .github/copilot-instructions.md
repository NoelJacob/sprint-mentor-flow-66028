# Sprint Mentor Flow AI Agent Instructions

This document provides guidance for AI coding agents working on the Sprint Mentor Flow codebase.

## 1. Project Overview & Goal

This is a [Tauri](https://tauri.app/) application, which combines a Rust backend with a web-based frontend. The goal is to build a personalized, Jira-like project management tool for SCRUM teams.

The application should provide different experiences for user roles like "Scrum Master" and "Tech Lead". It will feature dashboards, metrics, and AI-powered chat and "nudges" to improve team processes. The backend source of truth for project data will be Jira, and AI features will be powered by the Gemini API.

## 2. Tech Stack

- **Frontend:**
  - **Framework:** React
  - **Language:** TypeScript
  - **Build Tool:** Vite
  - **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
  - **Styling:** Tailwind CSS
- **Backend:**
  - **Framework:** Tauri
  - **Language:** Rust
- **External Integrations:**
  - **Project Management:** Jira (target)
  - **AI:** Google Gemini (target)
  - **Database (current):** Supabase (to be replaced by Jira)

## 3. Codebase Architecture

The repository is structured into two main parts: the frontend (`src/`) and the backend (`src-tauri/`).

### Frontend (`src/`)

- **`src/main.tsx`**: The entry point for the React application.
- **`src/App.tsx`**: The root component, which sets up routing.
- **`src/pages/`**: Contains the top-level components for each page or view (e.g., `ScrumMasterDashboard.tsx`).
- **`src/components/`**: Contains reusable React components.
  - **`src/components/ui/`**: Holds the base UI components from `shadcn/ui`. These are foundational and should be used for building more complex components.
- **`src/contexts/`**: Holds React Context providers for global state management. `AppProvider.tsx` is the main provider.
- **`src/lib/utils.ts`**: A utility file for helper functions, including the `cn` function for merging Tailwind CSS classes.

### Backend (`src-tauri/`)

- **`src-tauri/src/main.rs`**: The entry point for the Rust application. This is where the Tauri application is initialized.
- **`src-tauri/tauri.conf.json`**: The main configuration file for the Tauri application. It defines application properties, permissions, and the command interface.
- **`src-tauri/Cargo.toml`**: The Rust package manager configuration, defining backend dependencies.

### Frontend-Backend Communication

- Communication between the React frontend and the Rust backend is handled through Tauri's [command API](https://tauri.app/v1/guides/features/command).
- Rust functions can be exposed to the frontend by decorating them with `#[tauri::command]`.
- These commands are invoked from the frontend using the `@tauri-apps/api/tauri` package's `invoke` function.

## 4. Developer Workflow

### Prerequisites

- Node.js and `npm`
- Rust and `cargo`

### Setup and Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    This command starts the Vite dev server for the frontend and builds/runs the Tauri application.
    ```bash
    npm run dev
    ```

## 5. Key Conventions & Patterns

- **UI Development**: Build UIs by composing components from `src/components/ui/`. Use Tailwind CSS for styling and the `cn` utility from `src/lib/utils.ts` to conditionally apply classes.
- **State Management**: Global state is managed via React Context in `src/contexts/`. For local component state, use `useState` and `useReducer`.
- **API Integration**:
  - For **Jira**, use the `jira.js` npm package.
  - For **Gemini**, use the `@google/generative-ai` npm package.
  - API clients should be initialized in a dedicated file (e.g., `src/integrations/jira/client.ts`).
- **Routing**: The application uses `react-router-dom` for frontend routing. Routes are defined in `src/App.tsx`.
