'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, GlobeIcon, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import Particles from '@/components/Particles';

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
    try {
      const response = await fetch(`${API_BASE}/api/session`, {
        method: 'GET',
      });
      const data = await response.json();
      // Use sessionStorage
      sessionStorage.setItem('sessionId', data.sessionId);
      router.push('/mood');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

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
    <div className="min-h-screen gradient-bg">
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full h-full max-w-[600px] text-center landing-card">
        <Particles particleColors={['#ffffff', '#ffffff']} particleCount={500} particleSpread={10} speed={0.1} particleBaseSize={100} moveParticlesOnHover={true} alphaParticles={false} disableRotation={false} />
          <h1 className="h1 text-white mb-4 sm:mb-6 transition-opacity duration-300">
           QuietHelp
          </h1>
          <p className="text-lg sm:text-xl text-white mb-3 sm:mb-4 font-medium">
            Anonymous peer support. No logins. No pressure.
          </p>
          {calmMessage && (
            <p className="text-xs sm:text-xl text-white/70 mb-8 sm:mb-10 italic font-medium">
              {calmMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Button 
              onClick={handleStart} 
              size="lg" 
              className="rounded-full hover-lift transition-all duration-200 hover:shadow-xl hover:shadow-white/20 active:scale-[0.98] !bg-white !text-blue-600 hover:!bg-white/95 font-semibold flex-1 sm:flex-none"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 text-blue-600" />
            </Button>
            <Button
              onClick={handleGlobalChat}
              size="lg"
              className="rounded-full hover-lift transition-all duration-200 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 active:scale-[0.98] backdrop-blur-sm font-semibold flex-1 sm:flex-none"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Try Global Chat
              <GlobeIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div> 
      </main>
    </div>
  )
}