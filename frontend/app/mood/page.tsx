'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchingForm from '../../components/MatchingForm';

export default function MoodPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted and load sessionId from sessionStorage
    setMounted(true);
    const storedSessionId = sessionStorage.getItem('sessionId');
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!sessionId) {
      router.push('/');
    }
  }, [sessionId, router, mounted]);

  const handleFormSubmit = (data: { mood: string; age: number; country: string }) => {
    // Store all form data
    sessionStorage.setItem('matchingData', JSON.stringify(data));
    router.push('/matching');
  };

  // Always show loading until mounted and sessionId is loaded
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
        <div className="w-full max-w-[520px]">
          <MatchingForm onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  );
}

