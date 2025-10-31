# Gemini AI Integration

This directory contains the integration with Google's Gemini 2.0 Flash API for AI-powered coaching features.

## Overview

The Gemini integration provides context-aware AI coaching for Sprint Mentor Flow. The AI assistant has access to:

- Current persona (Scrum Master or Tech Lead)
- All metrics (sprint health, velocity, engagement, etc.)
- Team dependencies and blockers
- Recent action log
- User settings and preferences
- Sprint health score

## Architecture

### Files

- **`client.ts`**: Initializes and manages the Gemini API client
- **`chat.ts`**: Provides the `GeminiChatService` class that handles chat sessions with context
- **`index.ts`**: Exports public API

### Key Components

#### `GeminiChatService`

The main service class that manages chat sessions with Gemini. It:

1. Creates a system prompt with full app context
2. Maintains chat history
3. Sends user messages and receives AI responses
4. Updates context when app state changes

#### `useGeminiChat` Hook

A React hook located in `/src/hooks/useGeminiChat.ts` that:

1. Automatically syncs app context with the chat service
2. Manages message state
3. Handles loading and error states
4. Provides a simple interface for sending messages

## Usage

### Basic Usage in Components

```tsx
import { useGeminiChat } from "@/hooks/useGeminiChat";

function MyComponent() {
  const { messages, isLoading, error, sendMessage } = useGeminiChat();

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}
```

### Direct Service Usage

```tsx
import { createGeminiChatService, AppState } from "@/integrations/gemini";

const appState: AppState = {
  currentPersona: "scrum-master",
  scrumMetrics: [...],
  // ... other state
};

const chatService = createGeminiChatService(appState);
const response = await chatService.sendMessage("How's my sprint health?");
```

## Configuration

### Environment Variables

Set your Gemini API key in `.env`:

```env
VITE_GEMINI_API_KEY=your-api-key-here
```

Get an API key at: https://aistudio.google.com/app/apikey

### Model Configuration

The integration uses `gemini-2.0-flash-exp` by default. To change the model:

Edit `src/integrations/gemini/client.ts`:

```typescript
const model = client.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // Change this
  systemInstruction: systemInstruction,
});
```

## System Prompt

The AI is given detailed context about:

1. **Current Role**: Scrum Master or Tech Lead perspective
2. **Metrics**: All relevant team metrics with trends
3. **Dependencies**: Project dependencies and their status
4. **Recent Actions**: Last 5 actions taken by the user
5. **Settings**: User preferences for nudges and notifications

The system prompt instructs the AI to:

- Provide actionable insights
- Reference specific metrics
- Be concise (2-4 sentences typically)
- Use a supportive, professional tone
- Prioritize critical issues

## Context Updates

The chat service automatically updates its context when:

- The persona switches
- Metrics change significantly
- Dependencies are updated
- The sprint health score changes

This ensures the AI always has the latest information about your sprint.

## Error Handling

The integration includes comprehensive error handling:

- API key validation
- Network error handling
- Graceful degradation with error messages
- Retry logic through service reinitialization

## Example Queries

The AI can answer questions like:

- "What's causing my velocity to drop?"
- "Should I escalate the payment API blocker?"
- "How can I improve team engagement?"
- "What's the priority for this sprint?"
- "Is our tech debt getting out of control?"

## Future Enhancements

Potential improvements:

1. **Streaming responses**: Show AI responses as they're generated
2. **Conversation memory**: Persist chat history across sessions
3. **Suggested actions**: Let AI trigger actions in the app
4. **Multi-turn context**: Better follow-up question handling
5. **Voice input**: Speech-to-text for hands-free coaching
