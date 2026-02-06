"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import clsx from "clsx";    
import { createSession } from "@/lib/CreateSession";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleStart=async ()=>{
    await createSession();
    router.push("/mood");
  }
  const isOnGetStarted =
    pathname === "/" || pathname.startsWith("/mood") || pathname.startsWith("/chat");
  const isOnResources = pathname.startsWith("/matching") || pathname.startsWith("/chat-broadcast");

  return (
    <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-sm z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-lg sm:text-xl font-semibold tracking-tight text-white flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-1"
        >
          <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            QH
          </span>
          <span>QuietHelp</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm bg-blue-600 hover:bg-blue-700",
              isOnGetStarted && "ring-2 ring-offset-2 ring-blue-400 ring-offset-slate-900"
            )}
            onClick={() => handleStart()} 
          >
            Get Started
          </Button>

          <Link href="/matching" className="hidden sm:inline-flex">
            <Button
              size="sm"
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium bg-slate-900/70 text-slate-100 hover:bg-slate-800 border border-white/10",
                isOnResources && "bg-blue-500 text-white border-blue-400"
              )}
            >
              Other resources
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
