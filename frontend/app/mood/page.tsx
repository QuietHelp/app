'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchingForm from '../../components/MatchingForm';
import { ScrollArea } from "@/components/ui/scroll-area";
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

  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (!savedSessionId) {
      router.push('/');
      return;
    }
    setSessionId(savedSessionId);
  }, [router]);

  const handleFormSubmit = (data: { mood: string; age: number; country: string }) => {
    // Store all form data
    localStorage.setItem('matchingData', JSON.stringify(data));
    router.push('/matching');
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
        <main className="grow flex items-center justify-center">
          <motion.div
            className="max-w-2xl mx-auto w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <MatchingForm sessionId={sessionId} onSubmit={handleFormSubmit} />
          </motion.div>
        </main>
      </div>
    </ScrollArea>
  );
}

