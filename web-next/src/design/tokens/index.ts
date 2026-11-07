export * from "./primitives";
export * from "./semantic.atlas-editorial";
export * from "./semantic.aegean-linen";
export * from "./semantic.ottoman-noir";
export * from "./components";

import { semanticAtlasEditorial } from "./semantic.atlas-editorial";
import { semanticAegeanLinen } from "./semantic.aegean-linen";
import { semanticOttomanNoir } from "./semantic.ottoman-noir";

export const THEME_PRESETS = {
  "atlas-editorial": semanticAtlasEditorial,
  "aegean-linen": semanticAegeanLinen,
  "ottoman-noir": semanticOttomanNoir,
} as const;

export type ThemePresetId = keyof typeof THEME_PRESETS;
export type ThemeMode = "light" | "dark";
export type ThemeRadius = "sharp" | "soft";
export type ThemeDensity = "airy" | "comfortable";
export type MotionLevel = "full" | "subtle" | "off";
