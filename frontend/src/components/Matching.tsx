import { useEffect, useRef } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "../lib/ws";

type MatchFound = { roomId: string; peerSessionId: string };

interface MatchingProps {
  sessionId: string;
  mood: string;
  onMatchFound: (data: MatchFound) => void;
}

export default function Matching({ sessionId, mood, onMatchFound }: MatchingProps) {
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const setupConnection = async () => {
      try {
        const client = getStompClient();
        await waitForConnection(client);

        if (!isMounted) return;

        // Guard against React StrictMode double-effect in dev
        if (startedRef.current) return;
        startedRef.current = true;

        subscriptionRef.current = client.subscribe(
          `/topic/match/${sessionId}`,
          (message: IMessage) => {
            const data = JSON.parse(message.body) as MatchFound;
            onMatchFound(data);
          }
        );

        // Send match request
        client.publish({
          destination: "/app/match.join",
          body: JSON.stringify({ sessionId, mood }),
        });
      } catch (error) {
        console.error("Failed to setup WebSocket:", error);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      startedRef.current = false;

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [sessionId, mood, onMatchFound]);

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2>Looking for someone...</h2>
      <p style={{ marginTop: "1rem", color: "#666" }}>
        We're finding someone who understands.
      </p>
    </div>
  );
}
