'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MoodSelect from '../../components/MoodSelect';

export default function MoodPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (!savedSessionId) {
      router.push('/');
      return;
    }
    setSessionId(savedSessionId);
  }, [router]);

  const handleMoodSelected = (mood: string) => {
    localStorage.setItem('selectedMood', mood);
    router.push(`/matching?mood=${mood}`);
  };

  if (!sessionId) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <MoodSelect sessionId={sessionId} onMoodSelected={handleMoodSelected} />
    </div>
  );
}

