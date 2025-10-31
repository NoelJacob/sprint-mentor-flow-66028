import { useState, useCallback, useRef, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  GeminiChatService,
  createGeminiChatService,
  AppState,
} from "@/integrations/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useGeminiChat = () => {
  const appContext = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI Coach. I can help you analyze your team's performance, identify blockers, and suggest improvements based on your current sprint data. What would you like to discuss?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatServiceRef = useRef<GeminiChatService | null>(null);

  // Initialize chat service with current app state
  const initializeChatService = useCallback(() => {
    try {
      const appState: AppState = {
        currentPersona: appContext.currentPersona,
        scrumMetrics: appContext.scrumMetrics,
        techMetrics: appContext.techMetrics,
        actionLog: appContext.actionLog,
        dependencies: appContext.dependencies,
        settings: appContext.settings,
        sprintHealthScore: appContext.sprintHealthScore,
      };

      chatServiceRef.current = createGeminiChatService(appState);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to initialize chat service";
      setError(errorMessage);
      console.error("Failed to initialize Gemini chat service:", err);
    }
  }, [appContext]);

  // Initialize on mount
  useEffect(() => {
    initializeChatService();
  }, [initializeChatService]);

  // Update chat service when app context changes significantly
  useEffect(() => {
    if (chatServiceRef.current) {
      const appState: AppState = {
        currentPersona: appContext.currentPersona,
        scrumMetrics: appContext.scrumMetrics,
        techMetrics: appContext.techMetrics,
        actionLog: appContext.actionLog,
        dependencies: appContext.dependencies,
        settings: appContext.settings,
        sprintHealthScore: appContext.sprintHealthScore,
      };

      chatServiceRef.current.updateAppState(appState);
    }
  }, [
    appContext.currentPersona,
    appContext.scrumMetrics,
    appContext.techMetrics,
    appContext.sprintHealthScore,
    appContext.dependencies,
    appContext.actionLog,
    appContext.settings,
  ]);

  const sendMessage = useCallback(
    async (userMessage: string): Promise<void> => {
      if (!userMessage.trim() || isLoading) return;

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        if (!chatServiceRef.current) {
          initializeChatService();
          if (!chatServiceRef.current) {
            throw new Error("Failed to initialize chat service");
          }
        }

        const response = await chatServiceRef.current.sendMessage(userMessage);

        // Add assistant message
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get AI response";
        setError(errorMessage);

        // Add error message
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I apologize, but I encountered an error: ${errorMessage}. Please make sure the Gemini API key is configured correctly in your environment variables (VITE_GEMINI_API_KEY).`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, initializeChatService]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm your AI Coach. I can help you analyze your team's performance, identify blockers, and suggest improvements based on your current sprint data. What would you like to discuss?",
        timestamp: new Date(),
      },
    ]);
    initializeChatService();
  }, [initializeChatService]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
