'use client';

import { useEffect, useRef } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "../lib/ws";
import { motion } from "framer-motion";

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
  }, [sessionId, mood, age, country, onMatchFound]);

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.h2 
        className="h1 text-white mb-4 sm:mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Looking for someone...
      </motion.h2>
      <motion.p 
        className="text-lg sm:text-xl text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        We're finding someone who understands.
      </motion.p>
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
      </motion.div>
      <motion.footer
        className="mt-8 text-white/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
      </motion.footer>
    </motion.div>
  );
}

