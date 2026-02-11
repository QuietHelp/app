'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { formatMessageTime, formatFullTimestamp, shouldShowDateSeparator, formatDateSeparator } from "../lib/chatUtils";
import { GlobeIcon } from "lucide-react";

interface ChatMessage {
  username?: string;
  message: string;
  timestamp: number | string;
  senderSessionId?: string;
  /** Epoch ms; backend sets createdAt + 30 min. Used to hide expired messages in UI. */
  expiresAt?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const WS_URL = `${API_BASE.replace(/\/$/, '')}/ws`;

export type ChatBroadcastProps = {
  sessionId: string;
};

export default function ChatBroadcast({ sessionId }: ChatBroadcastProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const sessionIdRef = useRef<string>(sessionId);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usernameRef = useRef<string>('');

  // Generate username once on mount
  useEffect(() => {
    // Generate or retrieve username from localStorage (use a global key for broadcast chat)
    let username = localStorage.getItem('chat_username_broadcast');
    if (!username) {
      // Generate a unique username using timestamp
      const timestamp = Date.now().toString().slice(-6);
      const randomNum = Math.floor(Math.random() * 1000);
      username = `Friend${timestamp}${randomNum}`;
      localStorage.setItem('chat_username_broadcast', username);
    }
    usernameRef.current = username;
  }, []);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/chat/history`);
        if (!response.ok) {
          console.error('Failed to load chat history');
          return;
        }
        
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          const historyMessages: ChatMessage[] = data.messages.map((msg: any) => ({
            message: msg.message,
            timestamp: msg.timestamp,
            username: msg.username,
            senderSessionId: msg.senderSessionId,
            expiresAt: msg.expiresAt,
          }));
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Don't block UI if history fails to load
      }
    };

    loadChatHistory();
  }, [API_BASE]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      // Clean up existing connection
      if (clientRef.current) {
        clientRef.current.deactivate();
      }

      const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setIsConnected(true);
          setError(null);

          // Subscribe to global chat messages
          subscriptionRef.current = client.subscribe(
            '/topic/chat',
            (message: IMessage) => {
              try {
                const data = JSON.parse(message.body) as Record<string, unknown>;
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
                if (chat && typeof chat.username === 'string' && typeof chat.message === 'string') {
                  setMessages((prev) => [...prev, chat]);
                }
              } catch (err) {
                console.error('Error parsing message:', err);
              }
            }
          );
        },
        onDisconnect: () => {
          setIsConnected(false);
          subscriptionRef.current = null;
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message'], frame.body);
          setError('Connection error. Reconnecting...');
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
          setError('Connection error. Reconnecting...');
        },
      });

      clientRef.current = client;
      client.activate();
    } catch (err) {
      console.error('Error connecting to WebSocket:', err);
      setError('Failed to connect. Retrying...');
      
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  }, []);

  // Keep sessionId ref updated (similar to ChatRoom pattern)
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Initialize connection
  useEffect(() => {
    connect();

    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [connect]);

  // Handle manual reconnection
  const handleReconnect = useCallback(() => {
    if (clientRef.current && clientRef.current.connected) {
      return; // Already connected
    }
    connect();
  }, [connect]);

  // Send message
  const sendMessage = useCallback(async () => {
    const messageText = input.trim();
    if (!messageText || !clientRef.current || !clientRef.current.connected) {
      return;
    }

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
        setError(`Message cannot be sent: ${moderationResult.reason || 'Content violates community guidelines'}`);
        setTimeout(() => setError(null), 5000);
        return;
      }

      // Send message with senderSessionId for broadcast chat (similar to ChatRoom pattern)
      const chatMessage = {
        message: messageText,
        username: usernameRef.current,
        senderSessionId: sessionId, // Use sessionId directly like ChatRoom does
      };

      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(chatMessage),
      });

      setInput('');
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  }, [input, sessionId]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header - Pinned at top */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-5 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
              Global Chat
              <GlobeIcon className="w-5 h-5 text-cyan-500"/>
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          {!isConnected && (
            <button
              onClick={handleReconnect}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline px-2 py-1 transition-colors font-medium"
            >
              Reconnect
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0 scrollbar-hide">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
          This chat resets every 30 minutes.
        </p>
        {(() => {
          const now = Date.now();
          const visibleMessages = messages.filter((m) => !m.expiresAt || m.expiresAt > now);
          if (visibleMessages.length === 0) {
            return (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Start the conversation!</h3>
                <p className="text-sm">Be kind and supportive with others.</p>
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
                      <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
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
                      <div className="text-xs font-semibold mb-1.5 opacity-90">
                        {m.username || 'Guest'}
                      </div>
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

      {/* Input Bar - Pinned at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-5 bg-white dark:bg-gray-800">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              rows={1}
              className="w-full p-3 sm:p-4 text-base bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-12 max-h-32 overflow-y-auto scrollbar-hide disabled:opacity-50 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!isConnected}
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
            disabled={!isConnected || !input.trim()}
            className="px-5 sm:px-6 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.96] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center min-w-12"
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
    </div>
  );
}

