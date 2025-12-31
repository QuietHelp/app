'use client';

import { useState } from 'react';
import { motion } from "framer-motion";

interface MoodSelectProps {
  sessionId: string;
  onMoodSelected: (mood: string) => void;
}

const MOODS = ['STRESS', 'LONELY', 'BURNOUT', 'PANIC', 'NOT_SURE'];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function MoodSelect({ onMoodSelected }: MoodSelectProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="text-center w-full">
      <motion.h2 
        className="h1 text-white mb-4 sm:mb-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        How are you feeling?
      </motion.h2>
      <div className="flex flex-col gap-4 sm:gap-6">
        {MOODS.map((mood, index) => (
          <motion.div
            key={mood}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <motion.button
              onClick={() => {
                setSelected(mood);
                onMoodSelected(mood);
              }}
              className={`
                w-full p-4 sm:p-6
                text-lg sm:text-xl font-medium
                rounded-lg
                cursor-pointer
                transition-all duration-300
                hover-lift
                relative overflow-hidden
                ${selected === mood 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                }
              `}
              whileHover={{ scale: selected === mood ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mood}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

