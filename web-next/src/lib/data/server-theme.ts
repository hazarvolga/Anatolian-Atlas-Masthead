import defaultThemeConfig, {
  resolveThemeFromConcept,
  type DestinationIndexVariant,
  type FooterLayoutVariant,
  type HeaderLayoutVariant,
  type HomeLayoutVariant,
  type ThemeConfig,
  type ThemeLayoutSlots,
  type TourCardVariant,
  type TourDetailVariant,
} from "@/config/theme.config";
import {
  normalizePresetId,
  THEME_PRESETS,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemeRadius,
} from "@/design/tokens";
import { sanitizeSafeSeoUrlOrFallback } from "@/lib/seo/validate-seo-fields";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:3001";

export const THEME_COOKIE_NAME = "nst_theme_config";

const VALID_HOME_VARIANTS: HomeLayoutVariant[] = [
  "masthead",
  "split-cinema",
  "fullscreen-reel",
  "editorial-index",
];
const VALID_TOUR_CARD_VARIANTS: TourCardVariant[] = [
  "portrait-4x5",
  "landscape-row",
  "minimal-list",
  "full-bleed-minimal",
];
const VALID_DEST_INDEX_VARIANTS: DestinationIndexVariant[] = [
  "map-index",
  "grid-mosaic",
  "horizontal-scroll",
];
const VALID_HEADER_VARIANTS: HeaderLayoutVariant[] = [
  "swiss-bar",
  "centered-logo",
  "minimal-overlay",
  "sidebar-rail",
];
const VALID_FOOTER_VARIANTS: FooterLayoutVariant[] = [
  "atlas-columns",
  "minimal",
  "big-wordmark",
];
const VALID_TOUR_DETAIL_VARIANTS: TourDetailVariant[] = [
  "dossier",
  "story-scroll",
  "tabs",
];

/**
 * Merges and validates an incoming `theme_config` payload on top of a base `ThemeConfig`.
 * When `candidate.preset` is provided, defaults come from that preset's `ConceptPack`,
 * and any explicit per-slot overrides in `candidate.layout` / `candidate.overrides` are applied on top.
 */
export function mergeAndValidateThemeConfig(
  base: ThemeConfig,
  raw: unknown
): ThemeConfig {
  if (!raw || typeof raw !== "object") {
    return resolveThemeFromConcept(base.preset, base.overrides);
  }

  const candidate = raw as Record<string, any>;
  const targetPreset =
    typeof candidate.preset === "string" && candidate.preset in THEME_PRESETS
      ? normalizePresetId(candidate.preset)
      : normalizePresetId(base.preset);

  // Start from the target ConceptPack's canonical defaults
  const conceptDefault = resolveThemeFromConcept(targetPreset);

  const next: ThemeConfig = {
    ...conceptDefault,
    layout: { ...conceptDefault.layout },
    motion: { ...conceptDefault.motion },
  };

  if (candidate.mode === "light" || candidate.mode === "dark") {
    next.mode = candidate.mode as ThemeMode;
  }

  if (candidate.radius === "sharp" || candidate.radius === "soft") {
    next.radius = candidate.radius as ThemeRadius;
  }

  if (candidate.density === "airy" || candidate.density === "comfortable") {
    next.density = candidate.density as ThemeDensity;
  }

  const motionLevel =
    candidate.motion?.level ??
    (typeof candidate.motion === "string" ? candidate.motion : undefined);
  if (
    motionLevel === "full" ||
    motionLevel === "subtle" ||
    motionLevel === "off"
  ) {
    next.motion.level = motionLevel as MotionLevel;
  }

  // Apply explicit layout slot overrides from either `candidate.overrides.layout` or `candidate.layout`
  const rawLayout =
    candidate.overrides?.layout && typeof candidate.overrides.layout === "object"
      ? candidate.overrides.layout
      : candidate.layout && typeof candidate.layout === "object"
        ? candidate.layout
        : null;

  if (rawLayout) {
    const layoutOverrides: Partial<ThemeLayoutSlots> = {};
    if (VALID_HOME_VARIANTS.includes(rawLayout.home)) {
      next.layout.home = rawLayout.home;
      layoutOverrides.home = rawLayout.home;
    }
    if (VALID_TOUR_CARD_VARIANTS.includes(rawLayout.tourCard)) {
      next.layout.tourCard = rawLayout.tourCard;
      layoutOverrides.tourCard = rawLayout.tourCard;
    }
    if (VALID_DEST_INDEX_VARIANTS.includes(rawLayout.destinationIndex)) {
      next.layout.destinationIndex = rawLayout.destinationIndex;
      layoutOverrides.destinationIndex = rawLayout.destinationIndex;
    }
    if (VALID_HEADER_VARIANTS.includes(rawLayout.header)) {
      next.layout.header = rawLayout.header;
      layoutOverrides.header = rawLayout.header;
    }
    if (VALID_FOOTER_VARIANTS.includes(rawLayout.footer)) {
      next.layout.footer = rawLayout.footer;
      layoutOverrides.footer = rawLayout.footer;
    }
    if (VALID_TOUR_DETAIL_VARIANTS.includes(rawLayout.tourDetail)) {
      next.layout.tourDetail = rawLayout.tourDetail;
      layoutOverrides.tourDetail = rawLayout.tourDetail;
    }
    if (Object.keys(layoutOverrides).length > 0) {
      next.overrides = {
        ...next.overrides,
        layout: layoutOverrides,
      };
    }
  }

  return next;
}

export interface ServerSiteSettingsPayload {
  site_title?: string;
  site_tagline?: string;
  company_name?: string;
  tursab_license_no?: string;
  tax_id?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  default_meta_description?: string;
  default_meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  og_image_url?: string;
  theme_config?: Partial<ThemeConfig>;
}

/**
 * Fetches site settings from Express backend using Next.js ISR Data Cache
 * tagged with `site-settings`.
 * NEVER reads `cookies()` or `headers()` so static/ISR routes (`/`, `/tours`, `/destinations`)
 * remain Static/ISR (`○` / `revalidate`) in `next build`.
 */
export async function getServerSiteSettings(): Promise<ServerSiteSettingsPayload> {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/api/site-settings`, {
      next: { revalidate: 3600, tags: ["site-settings"] },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return {};
    const data = await res.json();
    const raw =
      data?.value && typeof data.value === "object" ? data.value : data;
    if (!raw || typeof raw !== "object") return {};

    return {
      ...raw,
      canonical_url: sanitizeSafeSeoUrlOrFallback(raw.canonical_url, ""),
      og_image: sanitizeSafeSeoUrlOrFallback(
        raw.og_image || raw.og_image_url,
        ""
      ),
      og_image_url: sanitizeSafeSeoUrlOrFallback(
        raw.og_image_url || raw.og_image,
        ""
      ),
    };
  } catch {
    return {};
  }
}

/**
 * Resolves the active `ThemeConfig` on the server strictly from `defaultThemeConfig`
 * and the `site-settings` tagged ISR fetch (revalidated immediately on Admin save).
 * Does NOT call `cookies()` so root `app/layout.tsx` preserves Static/ISR rendering.
 */
export async function getServerThemeConfig(): Promise<ThemeConfig> {
  const siteSettings = await getServerSiteSettings();
  return mergeAndValidateThemeConfig(
    defaultThemeConfig,
    siteSettings.theme_config
  );
}
