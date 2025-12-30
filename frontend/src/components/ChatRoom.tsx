import { useEffect, useState, useRef } from 'react';
import { getStompClient, waitForConnection } from '../lib/ws';

// ... existing interface ...

export default function ChatRoom({ sessionId, matchData }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let subscription: any = null;
    let isMounted = true;

    const setupConnection = async () => {
      try {
        const client = getStompClient();
        await waitForConnection(client);
        
        if (!isMounted) return;

        subscription = client.subscribe(`/topic/chat/${matchData.roomId}`, (message) => {
          const data = JSON.parse(message.body);
          setMessages((prev) => [...prev, data]);
        });
      } catch (error) {
        console.error('Failed to setup chat connection:', error);
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [matchData.roomId]);

  // ... rest of the component stays the same ...
  
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const client = getStompClient();
      await waitForConnection(client);
      
      const chatMessage: ChatMessage = {
        roomId: matchData.roomId,
        senderSessionId: sessionId,
        message: input,
        timestamp: new Date().toISOString(),
      };

      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(chatMessage),
      });

      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // ... rest of JSX stays the same ...
}