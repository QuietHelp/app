'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Matching from '../../components/Matching';

type MatchFound = { roomId: string; peerSessionId: string };

export default function MatchingContent() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ mood: string; age: number; country: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage only on the client side
  useEffect(() => {
    setMounted(true);
    
    const storedSessionId = sessionStorage.getItem('sessionId');
    setSessionId(storedSessionId);
    
    const savedFormData = sessionStorage.getItem('matchingData');
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch {
        setFormData(null);
      }
    } else {
      setFormData(null);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!sessionId) {
      router.push('/');
      return;
    }
    
    if (!formData) {
      router.push('/mood');
      return;
    }
  }, [sessionId, formData, router, mounted]);

  const handleMatchFound = useCallback((data: MatchFound) => {
    // Store match data in localStorage for the chat page
    sessionStorage.setItem('matchData', JSON.stringify(data));
    router.push(`/chat/${data.roomId}`);
  }, [router]);

  // Show loading until mounted and data is loaded
  if (!mounted || !sessionId || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
        <main className="grow flex items-center justify-center">
        
            <Matching
              sessionId={sessionId}
              mood={formData.mood}
              age={formData.age}
              country={formData.country}
              onMatchFound={handleMatchFound}
            />
         </main>
      </div>
    </div>
    
  );
}

