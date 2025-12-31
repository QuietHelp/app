'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '../../components/Matching';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

type MatchFound = { roomId: string; peerSessionId: string };

export default function MatchingContent() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ mood: string; age: number; country: string } | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    const savedFormData = localStorage.getItem('matchingData');
    
    if (!savedSessionId) {
      router.push('/');
      return;
    }
    
    if (!savedFormData) {
      router.push('/mood');
      return;
    }

    try {
      const data = JSON.parse(savedFormData);
      setSessionId(savedSessionId);
      setFormData(data);
    } catch (error) {
      console.error('Failed to parse form data:', error);
      router.push('/mood');
    }
  }, [router]);

  const handleMatchFound = (data: MatchFound) => {
    // Store match data in localStorage for the chat page
    localStorage.setItem('matchData', JSON.stringify(data));
    router.push(`/chat/${data.roomId}`);
  };

  if (!sessionId || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
        <main className="grow flex items-center justify-center">
          <motion.div
            className="max-w-2xl mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Matching
              sessionId={sessionId}
              mood={formData.mood}
              age={formData.age}
              country={formData.country}
              onMatchFound={handleMatchFound}
            />
          </motion.div>
        </main>
      </div>
    </ScrollArea>
  );
}

