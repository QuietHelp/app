'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatRoom from '../../../components/ChatRoom';

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{ roomId: string; peerSessionId: string } | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    const savedMatchData = localStorage.getItem('matchData');
    const roomId = params.roomId as string;

    if (!savedSessionId) {
      router.push('/');
      return;
    }

    if (!roomId) {
      router.push('/matching');
      return;
    }

    if (!savedMatchData) {
      router.push('/matching');
      return;
    }

    try {
      const matchData = JSON.parse(savedMatchData);
      // Verify the roomId matches
      if (matchData.roomId !== roomId) {
        router.push('/matching');
        return;
      }
      setSessionId(savedSessionId);
      setMatchData(matchData);
    } catch (error) {
      console.error('Failed to parse match data:', error);
      router.push('/matching');
    }
  }, [params.roomId, router]);

  if (!sessionId || !matchData) {
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

