"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
  type ThemePalette,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeId;
  palette: ThemePalette;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  // Sync with localStorage once the component mounts on the client. The
  // inline bootstrap script in layout.tsx handles the pre-paint paint so
  // there's no flash of the default theme.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(stored)) {
        setThemeState(stored);
        applyTheme(stored);
        return;
      }
    } catch {
      /* localStorage may be unavailable (private mode, etc.) — fall through */
    }
    applyTheme(DEFAULT_THEME);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    applyTheme(id);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* ignore write failures; theme still applies for this session */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, palette: THEMES[theme], setTheme }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
