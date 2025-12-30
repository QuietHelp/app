import { useEffect } from 'react';
import { getStompClient, waitForConnection } from '../lib/ws';

interface MatchingProps {
  sessionId: string;
  mood: string;
  onMatchFound: (data: { roomId: string; peerSessionId: string }) => void;
}

export default function Matching({ sessionId, mood, onMatchFound }: MatchingProps) {
  useEffect(() => {
    let subscription: any = null;
    let isMounted = true;

    const setupConnection = async () => {
      try {
        const client = getStompClient();
        
        // Wait for connection
        await waitForConnection(client);
        
        if (!isMounted) return;

        subscription = client.subscribe(`/topic/match/${sessionId}`, (message) => {
          const data = JSON.parse(message.body);
          onMatchFound(data);
        });

        // Send match request
        client.publish({
          destination: '/app/match.join',
          body: JSON.stringify({ sessionId, mood }),
        });
      } catch (error) {
        console.error('Failed to setup WebSocket:', error);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [sessionId, mood, onMatchFound]);

  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <h2>Looking for someone...</h2>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        We're finding someone who understands.
      </p>
    </div>
  );
}