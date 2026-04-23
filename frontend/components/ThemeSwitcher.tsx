"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEME_LIST } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, setTheme, palette } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change color palette (current: ${palette.name})`}
        title={`Theme: ${palette.name}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-sm text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 qh-accent-ring"
      >
        <Palette className="h-4 w-4 qh-accent-text" />
        <span
          aria-hidden
          className="h-3 w-3 rounded-full border border-black/10"
          style={{ background: palette.swatch.accent }}
        />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Color palette options"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Color palette
            </p>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1">
            {THEME_LIST.map((item) => {
              const isActive = item.id === theme;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      setTheme(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                      isActive && "bg-gray-50"
                    )}
                  >
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/5"
                      style={{
                        background: `linear-gradient(135deg, ${item.swatch.bg} 0%, ${item.swatch.soft} 100%)`,
                      }}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ background: item.swatch.accent }}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {item.description}
                      </span>
                    </span>
                    {isActive && (
                      <Check
                        className="h-4 w-4 shrink-0 qh-accent-text"
                        aria-hidden
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
