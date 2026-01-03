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
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
        <main className="grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <ChatBroadcast sessionId={sessionId} />
          </div>
        </main>
      </div>
    </div>
  );
}


