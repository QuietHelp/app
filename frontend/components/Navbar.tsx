"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import clsx from "clsx";
import { createSession } from "@/lib/CreateSession";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleStart = async () => {
    await createSession();
    router.push("/mood");
  };
  const isOnGetStarted =
    pathname === "/" || pathname.startsWith("/mood") || pathname.startsWith("/chat");
  const isOnResources = pathname === "/resources";
  const isOnAbout = pathname === "/about";

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm z-20 sticky top-0">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-1"
        >
          <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
            QH
          </span>
          <span>QuietHelp</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm bg-blue-600 hover:bg-blue-700 text-white",
              isOnGetStarted && "ring-2 ring-offset-2 ring-blue-400 ring-offset-white"
            )}
            onClick={() => handleStart()}
          >
            Get Started
          </Button>

          <Link href="/about" className="hidden sm:inline-flex">
            <Button
              variant="secondary"
              size="sm"
              className={clsx(
                "rounded-full px-4 py-1.5",
                isOnAbout && "bg-blue-100! text-blue-800! border-blue-200! hover:bg-blue-200!"
              )}
            >
              About Us
            </Button>
          </Link>

          <Link href="/resources" className="hidden sm:inline-flex">
            <Button
              variant="secondary"
              size="sm"
              className={clsx(
                "rounded-full px-4 py-1.5",
                isOnResources && "bg-blue-100! text-blue-800! border-blue-200! hover:bg-blue-200!"
              )}
            >
              Helplines
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
