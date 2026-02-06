'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { createSession } from "@/lib/CreateSession";

const CALMING_MESSAGES = [
  "Inhale for 4… hold… exhale for 6.",
  "It's okay to not be okay.",
  "Small steps are still progress.",
  "You're doing better than you think.",
  "Take your time. There's no rush."
];

export default function Home() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const [calmMessage, setCalmMessage] = useState('');

  useEffect(() => {
    // Random calming message on mount/refresh
    const randomMessage = CALMING_MESSAGES[Math.floor(Math.random() * CALMING_MESSAGES.length)];
    setCalmMessage(randomMessage);
  }, []);

  const handleStart = async () => {
    await createSession();
    router.push("/mood");
  }
  const handleGlobalChat = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/global-chat/session`, {
        method: 'GET',
      });
      const data = await response.json();
      sessionStorage.setItem('sessionId', data.sessionId);
      router.push('/chat-broadcast');
    } catch (error) {
      console.error('Failed to create global chat session:', error);
    }
  };

  
  return (
      <div className="min-h-screen relative overflow-hidden gradient-bg">
      {/* Content layer */}
      <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[600px] text-center landing-card p-8 sm:p-12">
          <h1 className="h1 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-white mb-4 sm:mb-6">
            QuietHelp
          </h1>
          <p className="text-lg sm:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 font-medium">
            Anonymous peer support. No logins. No pressure.
          </p>
          {calmMessage && (
            <p className="text-base sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 italic font-medium">
              {calmMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Button 
              onClick={handleStart} 
              size="lg" 
              className="rounded-xl hover-lift transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 sm:flex-none shadow-md hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={handleGlobalChat}
              size="lg"
              className="rounded-xl hover-lift transition-all duration-200 bg-gray-100 hover:bg-gray-200 font-semibold flex-1 sm:flex-none dark:bg-gray-700 dark:hover:bg-gray-600 shadow-md hover:shadow-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5 text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-500" />
              <span className="text-slate-400 dark:text-slate-500">Global Chat</span>
            </Button>
          </div>
        </div> 
      </main>
    </div>
  )
}