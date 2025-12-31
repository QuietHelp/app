'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Matching from '../../components/Matching';

type MatchFound = { roomId: string; peerSessionId: string };

export default function MatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    const moodParam = searchParams.get('mood');
    
    if (!savedSessionId) {
      router.push('/');
      return;
    }
    
    if (!moodParam) {
      router.push('/mood');
      return;
    }

    setSessionId(savedSessionId);
    setMood(moodParam);
  }, [router, searchParams]);

  const handleMatchFound = (data: MatchFound) => {
    // Store match data in localStorage for the chat page
    localStorage.setItem('matchData', JSON.stringify(data));
    router.push(`/chat/${data.roomId}`);
  };

  if (!sessionId || !mood) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Matching
        sessionId={sessionId}
        mood={mood}
        onMatchFound={handleMatchFound}
      />
    </div>
  );
}

