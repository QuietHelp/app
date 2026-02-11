"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Sparkles, Wind, ClipboardList, Target } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STARTER_SUGGESTIONS = [
  "I am feeling anxious today",
  "I need someone to talk to",
  "Help me calm down",
  "I am having a tough day",
];

const GUIDED_FLOWS = [
  { id: "grounding", label: "Grounding exercise", icon: Wind },
  { id: "check-in", label: "Quick check-in", icon: ClipboardList },
  { id: "small_step", label: "One small step", icon: Target },
] as const;

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ai_chat_session_id");
  if (!id) {
    id = crypto.randomUUID?.() ?? `session-${Date.now()}`;
    sessionStorage.setItem("ai_chat_session_id", id);
  }
  return id;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sessionId] = useState(() => getSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm here to listen and support you. Share what's on your mind, or try a guided exercise below.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const sendToChat = useCallback(
    async (messageText: string, flow?: string) => {
      if (!messageText.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setSuggestions([]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            message: messageText.trim(),
            mood: undefined,
            flow: flow ?? undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            data.response ??
            "I hear you. Would you like to tell me more about how you're feeling?",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again, or if you need immediate support, check out our helplines in the Resources section.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (text) sendToChat(text);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleFlow = (flowId: string, label: string) => {
    sendToChat(label, flowId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const showStarterSuggestions = messages.length <= 1;
  const displaySuggestions = suggestions.length > 0 ? suggestions : STARTER_SUGGESTIONS;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-3xl mx-auto h-screen flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Support Companion</h1>
              <p className="text-sm text-gray-500">Here to listen, 24/7. Try a guided exercise or just chat.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-emerald-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Guided flows */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-500">Guided exercises</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {GUIDED_FLOWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleFlow(id, label)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-blue-700 transition-colors disabled:opacity-50"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-500">
              {suggestions.length > 0 ? "Suggestions" : "Start with"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(showStarterSuggestions ? STARTER_SUGGESTIONS : displaySuggestions).map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-600 transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 resize-none"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            This AI is here to support you, but is not a replacement for professional help.
          </p>
        </div>
      </div>
    </div>
  );
}
