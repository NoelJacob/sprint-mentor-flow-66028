import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }
  genAI = new GoogleGenerativeAI(apiKey);
};

export const getGeminiClient = () => {
  if (!genAI) {
    // Try to initialize with environment variable if available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      initializeGemini(apiKey);
    } else {
      throw new Error(
        "Gemini client not initialized. Call initializeGemini first or set VITE_GEMINI_API_KEY"
      );
    }
  }
  return genAI;
};

export const createChatSession = (systemInstruction?: string) => {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction,
  });

  return model.startChat({
    history: [],
  });
};
