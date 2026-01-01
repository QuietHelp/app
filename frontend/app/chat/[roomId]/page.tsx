'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatRoom from '../../../components/ChatRoom';

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{ roomId: string; peerSessionId: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to indicate we're on the client
    setMounted(true);
    
    // Only access sessionStorage on the client side (sessionStorage is per-tab, localStorage is shared)
    const storedSessionId = sessionStorage.getItem('sessionId');
    const savedMatchData = sessionStorage.getItem('matchData');
    
    setSessionId(storedSessionId);
    
    if (savedMatchData) {
      try {
        const parsed = JSON.parse(savedMatchData);
        // Verify the roomId matches
        if (parsed.roomId === roomId) {
          setMatchData(parsed);
        } else {
          setMatchData(null);
        }
      } catch {
        setMatchData(null);
      }
    } else {
      setMatchData(null);
    }
  }, [roomId]);

  useEffect(() => {
    if (!mounted) return;
    
    if (!sessionId) {
      router.push('/');
      return;
    }

    if (!roomId) {
      router.push('/matching');
      return;
    }

    if (!matchData) {
      router.push('/matching');
      return;
    }
  }, [sessionId, roomId, matchData, router, mounted]);

  // Always show loading until mounted and data is loaded
  if (!mounted || !sessionId || !matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <ChatRoom sessionId={sessionId} matchData={matchData} />
      </div>
    </div>
  );
}
