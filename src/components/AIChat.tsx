import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send } from "lucide-react";

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
      content: "Hi! I'm your AI Coach. Ask me anything about your team's performance or get suggestions for improvement."
    }
  ]);
  const [input, setInput] = useState('');

  const predefinedResponses: Record<string, string> = {
    'velocity': "Your team velocity dropped last sprint from 48 to 42 points. Consider reviewing story estimates and checking for hidden blockers.",
    'engagement': "Team engagement is at 78%. I recommend a quick morale check-in and trying a new retrospective format.",
    'blockers': "There are 3 active blockers. The payment API delay is affecting 3 stories. I suggest escalating to stakeholders.",
    'debt': "Tech debt is at 23% and trending up. Schedule a refactoring session in the next sprint to prevent accumulation.",
    'default': "I can help you with: team velocity, engagement trends, blockers, tech debt, or sprint health. What would you like to explore?"
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple keyword matching for demo
    const lowerInput = input.toLowerCase();
    let response = predefinedResponses.default;
    
    for (const [key, value] of Object.entries(predefinedResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  return (
    <Card className="p-3 sm:p-4 flex flex-col h-[350px] sm:h-[400px]">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        <h3 className="text-sm sm:text-base font-semibold">AI Coach Assistant</h3>
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
                <p className="text-xs sm:text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about velocity, engagement..."
          className="flex-1 text-xs sm:text-sm h-9"
        />
        <Button onClick={handleSend} size="icon" className="h-9 w-9 flex-shrink-0">
          <Send className="w-3 sm:w-4 h-3 sm:h-4" />
        </Button>
      </div>
    </Card>
  );
};
