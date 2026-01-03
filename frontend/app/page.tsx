'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, GlobeIcon, MessageSquare } from "lucide-react"

export default function Home() {
  const router = useRouter();

  const handleStart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, {
        method: 'GET',
      });
      const data = await response.json();
      // Use sessionStorage
      sessionStorage.setItem('sessionId', data.sessionId);
      router.push('/mood');
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleGlobalChat = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/global-chat/session`, {
        method: 'GET',
      });
      const data = await response.json();
      sessionStorage.setItem('sessionId', data.sessionId);
      router.push('/chat-broadcast');
    } catch (error) {
      console.error('Failed to create global chat session:', error);
    }
  };

  
  return (
    <div className="min-h-screen gradient-bg">
      <div className="h-full overflow-auto">
        <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
          <main className="grow flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="h1 text-white mb-4 sm:mb-6">
                QuietHelp
              </h1>
              <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12">
                A quiet, anonymous space.
                No logins, no pressure, just peer support from one human to another.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleStart} size="lg" className="rounded-full hover-lift">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={handleGlobalChat}
                  size="lg"
                  className="rounded-full hover-lift bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try Global Chat <GlobeIcon className="ml-2 h-5 w-5  text-blue-600" />
                </Button>
              </div>
            </div> 
          </main>
        </div>
      </div>
    </div>
  )
}