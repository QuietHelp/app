'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { getStompClient, waitForConnection } from "@/lib/ws";
import { formatMessageTime, formatFullTimestamp, shouldShowDateSeparator, formatDateSeparator } from "../lib/chatUtils";


export type ChatMessage = {
  roomId?: string;
  senderSessionId?: string;
  message: string;
  timestamp: number | string; // Epoch milliseconds (number) or ISO string
  username?: string; // Optional, from backend
  /** Epoch ms; backend sets createdAt + 30 min. Used to hide expired messages in UI. */
  expiresAt?: number;
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
  const [sessionEnded, setSessionEnded] = useState(false);
  const [finding, setFinding] = useState(false);
  const [moderationMessage, setModerationMessage] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const router = useRouter();
 

  const subscriptionRef = useRef<StompSubscription | null>(null);
  const didSubscribeRef = useRef(false);
  const sessionIdRef = useRef<string>(sessionId);

   // Handler function for processing messages
   const handleMessage = (messageBody: string) => {
    try {
      const data = JSON.parse(messageBody) as Record<string, unknown>;
      if (data?.type === 'messagesExpired' && Array.isArray(data.expiredTimestamps)) {
        const expired = new Set((data.expiredTimestamps as number[]).map(Number));
        setMessages((prev) =>
          prev.filter((m) => {
            const t = typeof m.timestamp === 'string' ? new Date(m.timestamp).getTime() : m.timestamp;
            return !expired.has(t);
          })
        );
        return;
      }
      const chat = data as ChatMessage;
      if (!chat || typeof chat.message !== 'string') return;

      // Validate message structure
      if (chat && typeof chat.message === 'string') {
          // If this is a system 'Session ended.' message, clear previous messages and stop
          if (chat.username === 'system' && chat.message === 'Session ended.') {
            setMessages([{ ...chat, timestamp: Date.now() }]);
            // unsubscribe
            if (subscriptionRef.current) {
              subscriptionRef.current.unsubscribe();
              subscriptionRef.current = null;
            }
            setSessionEnded(true);
            sessionStorage.removeItem('matchData');
            // navigate back to home
            router.push('/');
            return;
          }
        // Track peer's username from their messages
        if (chat.senderSessionId && chat.senderSessionId !== sessionIdRef.current) {
          if (chat.username) {
            setPeerUsername(chat.username);
          }
        }

        const roomMessage: ChatMessage = {
          ...chat,
          roomId: matchData.roomId,
          senderSessionId: chat.senderSessionId || sessionIdRef.current,
          timestamp: chat.timestamp || Date.now(),
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

  // Load chat history when component mounts or roomId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/chat/history?roomId=${matchData.roomId}`);
        if (!response.ok) {
          console.error('Failed to load chat history');
          return;
        }
        
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          const historyMessages: ChatMessage[] = data.messages.map((msg: any) => ({
            roomId: matchData.roomId,
            senderSessionId: msg.senderSessionId,
            message: msg.message,
            timestamp: msg.timestamp,
            username: msg.username,
            expiresAt: msg.expiresAt,
          }));
          
          setMessages(historyMessages);
          
          // Track peer username from history
          historyMessages.forEach((m) => {
            if (m.senderSessionId && m.senderSessionId !== sessionIdRef.current && m.username) {
              setPeerUsername(m.username);
            }
          });
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Don't block UI if history fails to load
      }
    };

    loadChatHistory();
  }, [matchData.roomId, API_BASE]);

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
      setSessionEnded(false);
    };
  }, [matchData.roomId]);

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) return;

    if (sessionEnded || finding) return;

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
        setModerationMessage(`Message cannot be sent: ${moderationResult.reason || 'Content violates community guidelines'}`);
        setTimeout
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

  const endSession = async () => {
    try {
      await fetch(`${API_BASE}/api/session/${sessionId}/end`, { method: 'POST' });
    } catch (e) {
      // ignore errors
    }

    // Clear UI and stop subscribing
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    setMessages([]);
    setSessionEnded(true);
    // show neutral system message locally then navigate to home
    sessionStorage.removeItem('matchData');
    router.push('/');
  };

  const changeFriend = async () => {
    // retrieve matchingData (mood/age/country) to provide to backend
    const matchingDataRaw = sessionStorage.getItem('matchingData');
    let body = {} as any;
    if (matchingDataRaw) {
      try { body = JSON.parse(matchingDataRaw); } catch { body = {}; }
    }

    try {
      await fetch(`${API_BASE}/api/session/${sessionId}/change-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      // ignore
    }

    // Clear UI and show finding state
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    setMessages([]);
    setFinding(true);
    // navigate to matching which will enqueue and find a new friend
    router.push('/matching');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-4">
      <div className="surface-card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Chat Room</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {peerUsername 
                  ? `Connected to ${peerUsername}`
                  : "Connected"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={changeFriend} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm">Change Friend</button>
            <button onClick={endSession} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">End Session</button>
          </div>
        </div>
      </div>

      <div className="flex-1 surface-card p-4 sm:p-6 overflow-y-auto min-h-0 scrollbar-hide">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
          This chat resets every 30 minutes.
        </p>
        {(() => {
          const now = Date.now();
          const visibleMessages = messages.filter((m) => !m.expiresAt || m.expiresAt > now);
          if (visibleMessages.length === 0) {
            return (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">Start the conversation!</h3>
                <p className="text-sm">Share what's on your mind. Your peer is listening.</p>
              </div>
            );
          }
          return (
          <div className="space-y-4">
            {visibleMessages.map((m, idx) => {
              const isMyMessage = m.senderSessionId === sessionIdRef.current;
              const timestamp = typeof m.timestamp === 'string' ? new Date(m.timestamp).getTime() : m.timestamp;
              const showDateSeparator = shouldShowDateSeparator(m, visibleMessages[idx - 1]);
              
              return (
                <div key={idx}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-5">
                      <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                        {formatDateSeparator(timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-3 shadow-sm ${
                        isMyMessage 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                      }`}
                      title={formatFullTimestamp(timestamp)}
                    >
                      <div className="text-sm sm:text-base break-words leading-relaxed">
                        {m.message}
                      </div>
                      <div className={`text-[11px] opacity-70 mt-2 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        {formatMessageTime(timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            rows={1}
            className="w-full p-3 sm:p-4 text-base bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-12 max-h-32 overflow-y-auto scrollbar-hide transition-all"
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
          className="px-5 sm:px-6 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.96] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center min-w-12 shadow-md"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

