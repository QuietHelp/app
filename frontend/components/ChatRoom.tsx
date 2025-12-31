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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subscriptionRef = useRef<StompSubscription | null>(null);
  const didSubscribeRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 mb-4">
        <h2 className="h4 text-white mb-2">Chat Room</h2>
        <p className="text-sm text-white/80">You're connected with someone who understands</p>
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 overflow-y-auto mb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.senderSessionId === sessionId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] sm:max-w-[70%] ${m.senderSessionId === sessionId ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'} rounded-lg p-3 sm:p-4`}>
                  <div className="text-xs opacity-70 mb-1">
                    {m.senderSessionId === sessionId ? "You" : "Peer"} • {new Date(m.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm sm:text-base break-words">{m.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 sm:p-4 text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button 
          onClick={sendMessage}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

