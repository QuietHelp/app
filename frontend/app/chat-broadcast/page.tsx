'use client';

import ChatBroadcast from '@/components/ChatBroadcast';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatBroadcastPage() {
  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 gradient-bg">
        <main className="grow flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            <ChatBroadcast />
          </div>
        </main>
      </div>
    </ScrollArea>
  );
}

