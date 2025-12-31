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
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <ChatRoom sessionId={sessionId} matchData={matchData} />
    </div>
  );
}

