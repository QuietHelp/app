'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStompClient, waitForConnection } from "../lib/ws";
import { formatMessageTime, formatFullTimestamp, shouldShowDateSeparator, formatDateSeparator } from "../lib/chatUtils";
import { motion } from "framer-motion";

interface ChatMessage {
  username?: string;
  message: string;
  timestamp: number | string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

export default function ChatBroadcast() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);
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
      username = `Guest${timestamp}${randomNum}`;
      localStorage.setItem('chat_username_broadcast', username);
    }
    usernameRef.current = username;
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history on mount
  const loadChatHistory = useCallback(async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${backendUrl}/api/chat/history`);
      
      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }
      
      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      // Don't show error to user - just continue without history
    }
  }, []);

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
                const data = JSON.parse(message.body) as ChatMessage;
                
                // Validate message structure
                if (data && typeof data.username === 'string' && typeof data.message === 'string') {
                  setMessages((prev) => [...prev, data]);
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

  // Initialize connection and load history
  useEffect(() => {
    loadChatHistory();
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
  }, [connect, loadChatHistory]);

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

      // Send message without roomId for broadcast chat
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          message: messageText,
          username: usernameRef.current,
          // No roomId or senderSessionId - this is broadcast chat
        }),
      });

      setInput('');
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  }, [input]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="h4 text-white mb-1">Global Chat</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
              <p className="text-sm text-white/80">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          {!isConnected && (
            <button
              onClick={handleReconnect}
              className="text-xs text-blue-300 hover:text-blue-200 underline px-2 py-1"
            >
              Reconnect
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-300 mt-2">
            {error}
          </p>
        )}
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 overflow-y-auto mb-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, idx) => {
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
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start mb-1"
                  >
                    <div 
                      className="max-w-[75%] sm:max-w-[65%] bg-white/20 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm"
                      title={formatFullTimestamp(timestamp)}
                    >
                      <div className="text-xs font-medium mb-1 opacity-90">
                        {m.username || 'Guest'}
                      </div>
                      <div className="text-sm sm:text-base wrap-break-word leading-relaxed">
                        {m.message}
                      </div>
                      <div className="text-[10px] opacity-70 mt-1.5">
                        {formatMessageTime(timestamp)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
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
            className="w-full p-3 sm:p-4 text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 resize-none min-h-[48px] max-h-32 overflow-y-auto scrollbar-hide disabled:opacity-50"
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
          className="px-5 sm:px-6 py-3 sm:py-4 bg-white text-blue-600 rounded-2xl font-medium hover:bg-white/90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center min-w-[64px]"
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

