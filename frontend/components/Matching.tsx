'use client';

import { useEffect, useRef } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "../lib/ws";

type MatchFound = { roomId: string; peerSessionId: string };

interface MatchingProps {
  sessionId: string;
  mood: string;
  age: number;
  country: string;
  onMatchFound: (data: MatchFound) => void;
}

export default function Matching({ sessionId, mood, age, country, onMatchFound }: MatchingProps) {
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const startedRef = useRef(false);
  const onMatchFoundRef = useRef(onMatchFound);

  // Keep callback ref updated
  useEffect(() => {
    onMatchFoundRef.current = onMatchFound;
  }, [onMatchFound]);

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
            try {
              const data = JSON.parse(message.body) as MatchFound;
              onMatchFoundRef.current(data);
            } catch (error) {
              console.error("Failed to parse match message:", error);
            }
          }
        );

        // Send match request with all form data
        client.publish({
          destination: "/app/match.join",
          body: JSON.stringify({ sessionId, mood, age, country }),
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
  }, [sessionId, mood, age, country]);

  return (
    <div 
      className="text-center"
    >
      <h2 
        className="h1 text-white mb-4 sm:mb-6"
      >
        Looking for someone...
      </h2>
      <p 
        className="text-lg sm:text-xl text-white/90"
      >
        We&apos;re finding someone who understands.
      </p>
      <div 
        className="mt-8 flex justify-center"
      >
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
      </div>
      <footer 
        className="mt-8 text-white/70 text-sm"
      >
      </footer>
    </div>
  );
}

