'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export default function Home() {
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
    <ScrollArea className="h-full">
        <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
          <main className="grow flex items-center justify-center">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1
                className="h1 text-white mb-4 sm:mb-6"
                variants={itemVariants}
              >
               QuietHelp
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-white mb-8 sm:mb-12"
                variants={itemVariants}
              >
                Help us match you with the right friend.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button onClick={handleStart} size="lg" className="rounded-full hover-lift">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </ScrollArea>
  )
}
