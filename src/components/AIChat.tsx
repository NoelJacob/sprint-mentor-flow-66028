import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AIChat = () => {
  const { messages, isLoading, error, sendMessage } = useGeminiChat();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  return (
    <Card className="p-3 sm:p-4 flex flex-col h-[350px] sm:h-[400px]">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        <h3 className="text-sm sm:text-base font-semibold">
          AI Coach Assistant
        </h3>
        <span className="text-xs text-muted-foreground ml-auto">
          Powered by Gemini 2.5 Flash
        </span>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 pr-2 sm:pr-4 mb-3 sm:mb-4">
        <div className="space-y-2 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
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
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask about metrics, blockers, or get suggestions..."
          className="flex-1 text-xs sm:text-sm h-9"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
          ) : (
            <Send className="w-3 sm:w-4 h-3 sm:h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};
