import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Initialize Gemini AI
export const initGeminiAI = () => {
  if (!API_KEY) {
    console.warn('Gemini API key not configured. Running in mock mode.');
    return null;
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }
  return model;
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Send a message to Gemini and get a response
export const sendChatMessage = async (
  message: string,
  context?: string
): Promise<string> => {
  const aiModel = initGeminiAI();
  
  if (!aiModel) {
    // Return mock response when API is not configured
    return getMockResponse(message);
  }

  try {
    const prompt = context 
      ? `Context: ${context}\n\nUser: ${message}`
      : message;
    
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getMockResponse(message);
  }
};

// Get AI suggestions for sprint health
export const getSprintHealthSuggestions = async (
  metrics: { label: string; value: string | number; status?: string }[]
): Promise<string[]> => {
  const aiModel = initGeminiAI();
  
  if (!aiModel) {
    return getMockHealthSuggestions();
  }

  try {
    const metricsText = metrics.map(m => `${m.label}: ${m.value} (${m.status || 'normal'})`).join(', ');
    const prompt = `Based on these sprint metrics: ${metricsText}\n\nProvide 3 brief, actionable suggestions to improve sprint health. Each suggestion should be one sentence.`;
    
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse response into array of suggestions
    return text.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, ''))
      .slice(0, 3);
  } catch (error) {
    console.error('Error getting health suggestions:', error);
    return getMockHealthSuggestions();
  }
};

// Get AI nudge based on an event
export const generateNudge = async (
  eventType: string,
  eventData: any
): Promise<{ title: string; description: string; priority: string }> => {
  const aiModel = initGeminiAI();
  
  if (!aiModel) {
    return getMockNudge(eventType);
  }

  try {
    const prompt = `Generate a brief team nudge/alert for this event:
Event Type: ${eventType}
Event Data: ${JSON.stringify(eventData)}

Provide a response in this format:
Title: [Brief title]
Description: [One sentence description]
Priority: [low/medium/high]`;
    
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const titleMatch = text.match(/Title:\s*(.+)/);
    const descMatch = text.match(/Description:\s*(.+)/);
    const priorityMatch = text.match(/Priority:\s*(low|medium|high)/i);
    
    return {
      title: titleMatch?.[1]?.trim() || 'Team Alert',
      description: descMatch?.[1]?.trim() || 'Please review this event.',
      priority: priorityMatch?.[1]?.toLowerCase() || 'medium',
    };
  } catch (error) {
    console.error('Error generating nudge:', error);
    return getMockNudge(eventType);
  }
};

// Mock responses for when API is not configured
const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  const responses: Record<string, string> = {
    velocity: "Your team's task completion rate dropped from 12 to 9 tasks last sprint. Consider reviewing task estimates and checking for blockers.",
    engagement: "Team engagement is at 78%. I recommend a quick morale check-in and trying a new retrospective format.",
    blockers: "There are 3 active blockers affecting progress. The payment API delay is impacting multiple tasks. Consider escalating to stakeholders.",
    health: "Sprint health is at 67%. Focus on resolving blockers and improving team communication to get back on track.",
    tasks: "You have 12 tasks completed out of 18 planned. Consider reprioritizing remaining work for the sprint.",
    default: "I can help you with: task completion trends, team engagement, blockers, sprint health, or specific tasks. What would you like to explore?",
  };
  
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }
  
  return responses.default;
};

const getMockHealthSuggestions = (): string[] => [
  "Schedule a team sync to address the 3 active blockers and unblock work items",
  "Review task estimates with the team to improve accuracy in future sprints",
  "Conduct a quick engagement survey to identify and address team concerns",
];

const getMockNudge = (eventType: string): { title: string; description: string; priority: string } => {
  const nudges: Record<string, any> = {
    'blocker-added': {
      title: 'New Blocker Detected',
      description: 'A new blocker has been added that may affect sprint progress.',
      priority: 'high',
    },
    'task-overdue': {
      title: 'Task Overdue',
      description: 'One or more tasks are past their due date.',
      priority: 'medium',
    },
    'engagement-drop': {
      title: 'Team Engagement Decreased',
      description: 'Team engagement has dropped below the healthy threshold.',
      priority: 'medium',
    },
    default: {
      title: 'Team Alert',
      description: 'An event requires your attention.',
      priority: 'medium',
    },
  };
  
  return nudges[eventType] || nudges.default;
};
