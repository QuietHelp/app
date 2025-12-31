'use client';

import { useRouter } from 'next/navigation';
import Home from '../components/Home';

export default function HomePage() {
  const router = useRouter();

  const handleStart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      localStorage.setItem('sessionId', data.sessionId);
      router.push('/mood');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Home onStart={handleStart} />
    </div>
  );
}
