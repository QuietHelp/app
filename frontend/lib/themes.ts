/**
 * Frontend-only theme palettes for QuietHelp.
 *
 * Each palette is exposed to CSS through the `data-theme` attribute on the
 * <html> element (see `globals.css`). Consumers should import `THEMES` or
 * `THEME_LIST` and let the ThemeProvider drive the attribute.
 */

export type ThemeId =
  | "calm-blue"
  | "soft-lavender"
  | "warm-sunset"
  | "sage-green"
  | "minimal-neutral";

export interface ThemePalette {
  id: ThemeId;
  name: string;
  description: string;
  // Swatch colors used to preview the palette in the picker UI.
  swatch: {
    bg: string;
    accent: string;
    soft: string;
  };
}

export const DEFAULT_THEME: ThemeId = "calm-blue";

export const THEME_LIST: ThemePalette[] = [
  {
    id: "calm-blue",
    name: "Calm Blue",
    description: "Gentle blues — the QuietHelp default.",
    swatch: { bg: "#E8EBF8", accent: "#3B82F6", soft: "#DBEAFE" },
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender",
    description: "Airy lavenders for a serene mood.",
    swatch: { bg: "#EDE9FE", accent: "#8B5CF6", soft: "#EDE9FE" },
  },
  {
    id: "warm-sunset",
    name: "Warm Sunset",
    description: "Warm peach tones, like early evening light.",
    swatch: { bg: "#FFE4D6", accent: "#F97316", soft: "#FFEDD5" },
  },
  {
    id: "sage-green",
    name: "Sage Green",
    description: "Grounded, restorative sage.",
    swatch: { bg: "#DEEADE", accent: "#4B9F6B", soft: "#DCEEE2" },
  },
  {
    id: "minimal-neutral",
    name: "Minimal Neutral",
    description: "Quiet neutrals for a focused, distraction-free feel.",
    swatch: { bg: "#EFEFEF", accent: "#4B5563", soft: "#F3F4F6" },
  },
];

export const THEMES: Record<ThemeId, ThemePalette> = THEME_LIST.reduce(
  (acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  },
  {} as Record<ThemeId, ThemePalette>
);

export const THEME_STORAGE_KEY = "quiethelp.theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && value in THEMES;
}
