'use client';

import { useEffect, useState } from 'react';
import ChatBroadcast from '@/components/ChatBroadcast';

export default function ChatBroadcastPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to indicate we're on the client
    setMounted(true);
    
    // Get or create sessionId from sessionStorage
    let storedSessionId = sessionStorage.getItem('sessionId');
    
    // If no sessionId exists, create one (for users accessing broadcast chat directly)
    if (!storedSessionId) {
      // Generate a new sessionId
      const newSessionId = crypto.randomUUID ? crypto.randomUUID() : 
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', newSessionId);
      storedSessionId = newSessionId;
    }
    
    setSessionId(storedSessionId);
  }, []);

  // Show loading until mounted and sessionId is loaded
  if (!mounted || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[760px] h-[calc(100vh-8rem)] sm:h-[calc(100vh-4rem)]">
          <ChatBroadcast sessionId={sessionId} />
        </div>
      </main>
    </div>
  );
}


