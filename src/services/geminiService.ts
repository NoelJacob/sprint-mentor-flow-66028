import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (!apiKey) {
    console.warn('Gemini API key not configured. Using mock responses.');
    return null;
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SprintContext {
  sprintName?: string;
  taskCount?: number;
  completedCount?: number;
  blockedCount?: number;
  teamSize?: number;
  daysRemaining?: number;
}

// Mock responses for when Gemini is not configured
const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sprint') || lowerMessage.includes('progress')) {
    return "Based on your current sprint progress, you're on track. Consider focusing on the blocked tasks to maintain momentum. Would you like me to suggest specific actions?";
  }
  
  if (lowerMessage.includes('block') || lowerMessage.includes('stuck')) {
    return "I notice there are blocked tasks in your sprint. I recommend: 1) Identify dependencies, 2) Escalate if needed, 3) Consider parallel work. What specific blocker would you like help with?";
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('member')) {
    return "Team collaboration is key to sprint success. Consider having a quick sync to address any impediments. Is there a specific team concern I can help with?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
    return "I can help you with: Sprint planning, identifying blockers, team health insights, progress tracking, and suggesting improvements. What would you like to explore?";
  }
  
  return "I'm here to help with your sprint and team management. Could you provide more details about what you'd like assistance with?";
};

// Generate AI response using Gemini or mock
export const generateAIResponse = async (
  message: string,
  context?: SprintContext,
  chatHistory?: ChatMessage[]
): Promise<string> => {
  const client = getGeminiClient();
  
  if (!client) {
    // Return mock response when Gemini is not configured
    return Promise.resolve(getMockResponse(message));
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build context-aware prompt
    let prompt = '';
    
    if (context) {
      prompt += 'Sprint Context:\n';
      if (context.sprintName) prompt += `- Sprint: ${context.sprintName}\n`;
      if (context.taskCount !== undefined) prompt += `- Total tasks: ${context.taskCount}\n`;
      if (context.completedCount !== undefined) prompt += `- Completed: ${context.completedCount}\n`;
      if (context.blockedCount !== undefined) prompt += `- Blocked: ${context.blockedCount}\n`;
      if (context.teamSize !== undefined) prompt += `- Team size: ${context.teamSize}\n`;
      if (context.daysRemaining !== undefined) prompt += `- Days remaining: ${context.daysRemaining}\n`;
      prompt += '\n';
    }
    
    prompt += `You are an AI assistant helping with SCRUM sprint management. Be concise, actionable, and focus on practical advice. Avoid technical jargon when possible.\n\nUser question: ${message}\n\nProvide a helpful, concise response:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getMockResponse(message);
  }
};

// Generate smart nudges based on sprint data
export const generateSmartNudge = async (
  issue: string,
  context: SprintContext
): Promise<string> => {
  const client = getGeminiClient();
  
  if (!client) {
    // Return mock nudge
    if (issue.includes('blocked')) {
      return 'Consider reviewing blocked tasks and escalating if needed. Quick action can prevent sprint delays.';
    }
    if (issue.includes('velocity')) {
      return 'Your velocity has changed. Review task estimates and team capacity to stay on track.';
    }
    return 'Monitor your sprint health regularly to ensure success.';
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    let prompt = 'Sprint Context:\n';
    if (context.sprintName) prompt += `- Sprint: ${context.sprintName}\n`;
    if (context.taskCount !== undefined) prompt += `- Total tasks: ${context.taskCount}\n`;
    if (context.completedCount !== undefined) prompt += `- Completed: ${context.completedCount}\n`;
    if (context.blockedCount !== undefined) prompt += `- Blocked: ${context.blockedCount}\n`;
    
    prompt += `\nIssue detected: ${issue}\n\nProvide a brief, actionable suggestion (max 2 sentences) to address this:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating nudge:', error);
    return 'Review this issue and take appropriate action to keep your sprint on track.';
  }
};

// Check if Gemini is configured
export const isGeminiConfigured = (): boolean => {
  return !!apiKey;
};
