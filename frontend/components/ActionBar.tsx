"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight, MessageSquare, Bot, Users } from "lucide-react";
import { createSession } from "@/lib/CreateSession";

interface ActionBarProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function ActionBar({ variant = "default", className = "" }: ActionBarProps) {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleStart = async () => {
    await createSession();
    router.push("/mood");
  };

  const handleGlobalChat = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/global-chat/session`, {
        method: "GET",
      });
      const data = await response.json();
      sessionStorage.setItem("sessionId", data.sessionId);
      router.push("/chat-broadcast");
    } catch (error) {
      console.error("Failed to create global chat session:", error);
    }
  };

  const handleAIChat = () => {
    router.push("/ai-chat");
  };

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-3 justify-center ${className}`}>
        <Button
          onClick={handleStart}
          size="lg"
          className="rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-white/20"
        >
          <Users className="mr-2 h-5 w-5 text-white" />
          Peer Support
        </Button>
        <Button
          onClick={handleGlobalChat}
          size="lg"
          className="rounded-xl font-semibold transition-all border border-white/30"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Global Chat
        </Button>
        <Button
          onClick={handleAIChat}
          size="lg"
          className="rounded-x font-semibold transition-all border border-white/30"
        >
          <Bot className="mr-2 h-5 w-5" />
          AI Support
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {/* Peer Support Card */}
      <button
        onClick={handleStart}
        className="group landing-card p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-blue-200"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          1-on-1 Peer Support
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Get matched with someone who understands what you are going through.
        </p>
        <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
          Get Started <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </button>

      {/* Global Chat Card */}
      <button
        onClick={handleGlobalChat}
        className="group landing-card p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-purple-200"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <MessageSquare className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Global Chat Room
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Join a supportive community chat with others who care.
        </p>
        <span className="inline-flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
          Join Chat <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </button>

      {/* AI Chat Card */}
      <button
        onClick={handleAIChat}
        className="group landing-card p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-emerald-200"
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Bot className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI Companion
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Chat with our supportive AI anytime, day or night.
        </p>
        <span className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
          Start Chat <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
