import { createChatSession } from "./client";
import { PersonaType, Metric, DependencyNode, Settings, Nudge } from "@/types";
import { ActionLogEntry } from "@/contexts/AppContext";
import { ChatSession } from "@google/generative-ai";

export interface AppState {
  currentPersona: PersonaType;
  scrumMetrics: Metric[];
  techMetrics: Metric[];
  actionLog: ActionLogEntry[];
  dependencies: DependencyNode[];
  settings: Settings;
  sprintHealthScore: number;
  nudges?: Nudge[];
}

export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

const createSystemPrompt = (appState: AppState): string => {
  const {
    currentPersona,
    scrumMetrics,
    techMetrics,
    dependencies,
    sprintHealthScore,
    actionLog,
    settings,
  } = appState;

  return `You are an AI Coach for Agile Agent, a SCRUM project management app. You're helping a ${currentPersona.replace(
    "-",
    " "
  )} improve their team's performance. When responding do not use Markdown formatting.

CURRENT CONTEXT:
- Persona: ${currentPersona}
- Sprint Health Score: ${sprintHealthScore}%

METRICS (${
    currentPersona === "scrum-master" ? "Scrum Master View" : "Tech Lead View"
  }):
${
  currentPersona === "scrum-master"
    ? scrumMetrics
        .map(
          (m) =>
            `- ${m.label}: ${m.value}${
              m.change ? ` (${m.change > 0 ? "+" : ""}${m.change}%)` : ""
            } [${m.status || "normal"}]`
        )
        .join("\n")
    : techMetrics
        .map(
          (m) =>
            `- ${m.label}: ${m.value}${
              m.change ? ` (${m.change > 0 ? "+" : ""}${m.change}%)` : ""
            } [${m.status || "normal"}]`
        )
        .join("\n")
}

DEPENDENCIES:
${dependencies
  .map(
    (d) =>
      `- ${d.title}: ${d.status}${
        d.dependencies.length > 0
          ? ` (depends on: ${d.dependencies.join(", ")})`
          : ""
      }`
  )
  .join("\n")}

RECENT ACTIONS (last ${Math.min(actionLog.length, 5)}):
${actionLog
  .slice(0, 5)
  .map((a) => `- ${a.action}: ${a.impact}`)
  .join("\n")}

SETTINGS:
- Nudge Frequency: ${settings.nudgeFrequency}
- Notification Intensity: ${settings.notificationIntensity}/10
- Enabled Categories: ${settings.enabledCategories.join(", ")}

Your role is to:
1. Provide actionable insights based on the current metrics and context
2. Help identify blockers and suggest solutions
3. Guide sprint planning and retrospective improvements
4. Offer coaching on SCRUM best practices
5. Be concise but informative (2-4 sentences typically)
6. Use a supportive, professional tone
7. Prioritize the most critical issues first

When answering:
- Reference specific metrics and values from the context
- Provide concrete, actionable suggestions
- Explain the "why" behind recommendations
- Consider the user's persona and their specific concerns`;
};

export class GeminiChatService {
  private chatSession: ChatSession;
  private appState: AppState;

  constructor(appState: AppState) {
    this.appState = appState;
    const systemPrompt = createSystemPrompt(appState);
    this.chatSession = createChatSession(systemPrompt);
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      const result = await this.chatSession.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw new Error(
        `Failed to get AI response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  updateAppState(newAppState: AppState) {
    // Create a new chat session with updated context
    this.appState = newAppState;
    const systemPrompt = createSystemPrompt(newAppState);
    this.chatSession = createChatSession(systemPrompt);
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    // Convert chat history to our format
    try {
      const history = await this.chatSession.getHistory();
      return history.map((msg) => ({
        role: msg.role as "user" | "model",
        parts: msg.parts[0]?.text || "",
      }));
    } catch (error) {
      console.error("Error getting chat history:", error);
      return [];
    }
  }
}

export const createGeminiChatService = (
  appState: AppState
): GeminiChatService => {
  return new GeminiChatService(appState);
};
