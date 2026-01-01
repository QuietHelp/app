'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchingForm from '../../components/MatchingForm';
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
      <main className="grow flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MatchingForm onSubmit={handleFormSubmit} />
        </motion.div>
      </main>
    </div>
  );
}

