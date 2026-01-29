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
        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6"
      >
        Looking for someone...
      </h2>
      <p 
        className="text-lg sm:text-lg text-gray-600 dark:text-gray-400"
      >
        We're finding someone who understands.
      </p>
      <div 
        className="mt-10 flex justify-center"
      >
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400"></div>
      </div>
      <footer 
        className="mt-10 text-gray-600 dark:text-gray-400 text-sm"
      >
      </footer>
    </div>
  );
}

