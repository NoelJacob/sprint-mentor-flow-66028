import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { generateAIResponse, isGeminiConfigured } from "@/services/geminiService";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: isGeminiConfigured() 
        ? "Hi! I'm your AI Coach powered by Gemini. Ask me anything about your sprint or team."
        : "Hi! I'm your AI Coach. (Using mock responses - configure VITE_GEMINI_API_KEY for real AI)"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get context from metrics (you can enhance this with actual sprint data)
      const context = {
        sprintName: 'Current Sprint',
        taskCount: 15,
        completedCount: 8,
        blockedCount: 2,
        teamSize: 5,
        daysRemaining: 5,
      };

      const response = await generateAIResponse(input, context, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-3 sm:p-4 flex flex-col h-[350px] sm:h-[400px]">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        <h3 className="text-sm sm:text-base font-semibold">AI Coach</h3>
        {!isGeminiConfigured() && (
          <Badge variant="secondary" className="ml-auto text-xs">Mock Mode</Badge>
        )}
      </div>

      <ScrollArea className="flex-1 pr-2 sm:pr-4 mb-3 sm:mb-4">
        <div className="space-y-2 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg bg-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask about your sprint..."
          className="flex-1 text-xs sm:text-sm h-9"
          disabled={isLoading}
        />
        <Button onClick={handleSend} size="icon" className="h-9 w-9 flex-shrink-0" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" /> : <Send className="w-3 sm:w-4 h-3 sm:h-4" />}
        </Button>
      </div>
    </Card>
  );
};
