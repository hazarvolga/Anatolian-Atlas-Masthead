import {
  normalizePresetId,
  type CanonicalConceptId,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
  type ThemeRadius,
} from "@/design/tokens";
import { getConceptPack, type ConceptPack } from "@/design/concepts";

export type HeaderLayoutVariant =
  | "swiss-bar"
  | "centered-logo"
  | "minimal-overlay"
  | "sidebar-rail";

export type FooterLayoutVariant =
  | "atlas-columns"
  | "minimal"
  | "big-wordmark";

export type HomeLayoutVariant =
  | "masthead"
  | "split-cinema"
  | "fullscreen-reel"
  | "editorial-index";

export type TourCardVariant =
  | "portrait-4x5"
  | "landscape-row"
  | "minimal-list"
  | "full-bleed-minimal";

export type DestinationIndexVariant =
  | "map-index"
  | "grid-mosaic"
  | "horizontal-scroll";

export type TourDetailVariant =
  | "dossier"
  | "story-scroll"
  | "tabs";

export interface ThemeLayoutSlots {
  header: HeaderLayoutVariant;
  footer: FooterLayoutVariant;
  home: HomeLayoutVariant;
  tourCard: TourCardVariant;
  destinationIndex: DestinationIndexVariant;
  tourDetail: TourDetailVariant;
}

export interface ThemeSlotOverrides {
  mode?: ThemeMode;
  radius?: ThemeRadius;
  density?: ThemeDensity;
  motion?: Partial<{
    level: MotionLevel;
    smoothScroll: boolean;
  }>;
  layout?: Partial<ThemeLayoutSlots>;
}

export interface ThemeConfig {
  preset: ThemePresetId;
  mode: ThemeMode;
  layout: ThemeLayoutSlots;
  motion: {
    level: MotionLevel;
    smoothScroll: boolean;
  };
  radius: ThemeRadius;
  density: ThemeDensity;
  overrides?: ThemeSlotOverrides;
}

/**
 * Resolves a complete `ThemeConfig` from a preset ID (`atlas-editorial`, `aegean-linen`,
 * `ottoman-noir`) and optional per-slot `overrides`.
 * When `preset` changes, layout slots, mode, radius, density, and motion automatically
 * derive from that preset's `ConceptPack` unless explicitly overridden per slot.
 */
export function resolveThemeFromConcept(
  preset: ThemePresetId | string = "atlas-editorial",
  overrides?: ThemeSlotOverrides
): ThemeConfig {
  const canonicalPreset: CanonicalConceptId = normalizePresetId(preset);
  const concept: ConceptPack = getConceptPack(canonicalPreset);

  return {
    preset: canonicalPreset,
    mode: overrides?.mode ?? concept.tokens.defaultMode,
    radius: overrides?.radius ?? concept.shape.radius,
    density: overrides?.density ?? concept.tokens.defaultDensity,
    motion: {
      level: overrides?.motion?.level ?? concept.motion.defaultLevel,
      smoothScroll:
        overrides?.motion?.smoothScroll ?? concept.motion.smoothScroll,
    },
    layout: {
      header: overrides?.layout?.header ?? concept.layout.header,
      footer: overrides?.layout?.footer ?? concept.layout.footer,
      home: overrides?.layout?.home ?? concept.layout.home,
      tourCard: overrides?.layout?.tourCard ?? concept.layout.tourCard,
      destinationIndex:
        overrides?.layout?.destinationIndex ?? concept.layout.destinationIndex,
      tourDetail: overrides?.layout?.tourDetail ?? concept.layout.tourDetail,
    },
    ...(overrides ? { overrides } : {}),
  };
}

/**
 * Declarative Theme Configuration (`theme.config.ts`).
 * Selects ONLY the active concept preset (`preset`) and optional per-slot `overrides`.
 * All tokens, layout variants, section manifests, motion curves, image treatments,
 * and shapes derive from `CONCEPT_PACKS[preset]`.
 */
export const ACTIVE_THEME_PRESET: CanonicalConceptId = "atlas-editorial";
export const ACTIVE_THEME_OVERRIDES: ThemeSlotOverrides = {};

export const themeConfig: ThemeConfig = resolveThemeFromConcept(
  ACTIVE_THEME_PRESET,
  ACTIVE_THEME_OVERRIDES
);

export default themeConfig;
