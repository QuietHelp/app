'use client';

import { useEffect, useRef, useState } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "../lib/ws";

export type ChatMessage = {
  roomId: string;
  senderSessionId: string;
  message: string;
  timestamp: string; // ISO
};

export type MatchFound = {
  roomId: string;
  peerSessionId: string;
};

export type ChatRoomProps = {
  sessionId: string;
  matchData: MatchFound;
};

export default function ChatRoom({ sessionId, matchData }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const subscriptionRef = useRef<StompSubscription | null>(null);
  const didSubscribeRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const setupConnection = async () => {
      try {
        const client = getStompClient();
        await waitForConnection(client);

        if (!isMounted) return;

        // React StrictMode can run effects twice in dev; guard to avoid double subscribe
        if (didSubscribeRef.current) return;
        didSubscribeRef.current = true;

        subscriptionRef.current = client.subscribe(
          `/topic/chat/${matchData.roomId}`,
          (message: IMessage) => {
            const data = JSON.parse(message.body) as ChatMessage;
            setMessages((prev) => [...prev, data]);
          }
        );
      } catch (error) {
        console.error("Failed to setup chat connection:", error);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      didSubscribeRef.current = false;

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [matchData.roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const client = getStompClient();
      await waitForConnection(client);

      const chatMessage: ChatMessage = {
        roomId: matchData.roomId,
        senderSessionId: sessionId,
        message: input.trim(),
        timestamp: new Date().toISOString(),
      };

      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(chatMessage),
      });

      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Chat Room</h2>

      <div style={{ border: "1px solid #ddd", padding: 12, height: 300, overflowY: "auto" }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {m.senderSessionId === sessionId ? "You" : "Peer"} • {new Date(m.timestamp).toLocaleTimeString()}
            </div>
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 10 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 14px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

