'use client';

import { useEffect, useRef, useState } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "@/lib/ws";
import { formatMessageTime, formatFullTimestamp, shouldShowDateSeparator, formatDateSeparator } from "../lib/chatUtils";

export type ChatMessage = {
  roomId?: string;
  senderSessionId?: string;
  message: string;
  timestamp: number | string; // Epoch milliseconds (number) or ISO string
  username?: string; // Optional, from backend
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
  const [myUsername, setMyUsername] = useState<string>("");
  const [peerUsername, setPeerUsername] = useState<string>("");
 

  const subscriptionRef = useRef<StompSubscription | null>(null);
  const didSubscribeRef = useRef(false);
  const sessionIdRef = useRef<string>(sessionId);

   // Handler function for processing messages
   const handleMessage = (messageBody: string) => {
    try {
      const data = JSON.parse(messageBody) as ChatMessage;
      
      // Validate message structure
      if (data && typeof data.message === 'string') {
        // Track peer's username from their messages
        if (data.senderSessionId && data.senderSessionId !== sessionIdRef.current) {
          if (data.username) {
            setPeerUsername(data.username);
          }
        }
        
        // Ensure roomId and senderSessionId are set for room-based chat
        const roomMessage: ChatMessage = {
          ...data,
          roomId: matchData.roomId,
          senderSessionId: data.senderSessionId || sessionIdRef.current,
          timestamp: data.timestamp || Date.now(),
        };
        
        setMessages((prev) => [...prev, roomMessage]);
      }
    } catch (error) {
      console.error("Failed to parse chat message:", error);
    }
  };

  const setupConnection = async (isMounted: boolean) => {
    try {
      const client = getStompClient();
      await waitForConnection(client);

      if (!isMounted) return;

      // React StrictMode can run effects twice in dev; guard to avoid double subscribe
      if (didSubscribeRef.current) return;
      didSubscribeRef.current = true;

      // Subscribe to room-specific topic
      subscriptionRef.current = client.subscribe(
        `/topic/chat/${matchData.roomId}`,
        (message: IMessage) => handleMessage(message.body)
      );
    } catch (error) {
      console.error("Failed to setup chat connection:", error);
    }
  };
  
  // Generate or retrieve username for current user
  useEffect(() => {
    const storedUsername = sessionStorage.getItem(`chat_username_${sessionId}`);
    if (storedUsername) {
      setMyUsername(storedUsername);
    } else {
      // Generate a unique guest username using sessionId (UUID) to ensure uniqueness
      // Each UUID is unique, so we use multiple parts of it to create a unique numeric identifier
      const uuidHex = sessionId.replace(/-/g, '');
      // Use parts from different sections of the UUID and combine them
      const part1 = parseInt(uuidHex.substring(0, 6), 16);
      const part2 = parseInt(uuidHex.substring(8, 14), 16);
      const part3 = parseInt(uuidHex.substring(16, 22), 16);
      // Combine all parts using XOR to distribute values better
      const combined = (part1 ^ part2 ^ part3) % 99999999;
      const usernameSuffix = String(combined + 1).padStart(8, '0'); // +1 to avoid 00000000
      const username = `Friend${usernameSuffix}`;
      sessionStorage.setItem(`chat_username_${sessionId}`, username);
      setMyUsername(username);
    }
  }, [sessionId]);

  // Keep sessionId ref updated
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    let isMounted = true;
    setupConnection(isMounted);

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
    const messageText = input.trim();
    if (!messageText) return;

    try {
      // Moderate message before sending
      const moderationResponse = await fetch('/api/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      const moderationResult = await moderationResponse.json();

      if (!moderationResult.isAppropriate) {
        alert(`Message cannot be sent: ${moderationResult.reason || 'Content violates community guidelines'}`);
        return;
      }

      const client = getStompClient();
      await waitForConnection(client);

      const chatMessage = {
        roomId: matchData.roomId,
        senderSessionId: sessionId,
        message: messageText,
        username: myUsername, // Send our username so backend can use it
      };

      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(chatMessage),
      });

      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="h4 text-white mb-1">Chat Room</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-white/80">
                {peerUsername 
                  ? `Connected to ${peerUsername}`
                  : "Connected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 overflow-y-auto mb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <h3 className="h3 text-white mb-1">Start the conversation!</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, idx) => {
              const isMyMessage = m.senderSessionId === sessionIdRef.current;
              const timestamp = typeof m.timestamp === 'string' ? new Date(m.timestamp).getTime() : m.timestamp;
              const showDateSeparator = shouldShowDateSeparator(m, messages[idx - 1]);
              
              return (
                <div key={idx}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">
                        {formatDateSeparator(timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-1`}
                  >
                    <div 
                      className={`max-w-[75%] sm:max-w-[65%] ${
                        isMyMessage 
                          ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white/20 text-white rounded-2xl rounded-tl-sm'
                      } px-4 py-2.5 shadow-sm`}
                      title={formatFullTimestamp(timestamp)}
                    >
                      <div className="text-sm sm:text-base wrap-break-word leading-relaxed">
                        {m.message}
                      </div>
                      <div className={`text-[10px] opacity-70 mt-1.5 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        {formatMessageTime(timestamp)}
                      </div>
                    </div>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            rows={1}
            className="w-full p-3 sm:p-4 text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 resize-none min-h-[48px] max-h-32 overflow-y-auto scrollbar-hide"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{
              height: 'auto',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
        </div>
        <button 
          onClick={sendMessage}
          disabled={!input.trim()}
          className="px-5 sm:px-6 py-3 sm:py-4 bg-white height-8 text-blue-600 rounded-2xl font-medium hover:bg-white/90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center min-w-[64px]"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-5 h-9"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

