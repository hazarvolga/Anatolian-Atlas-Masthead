import { cookies } from "next/headers";
import defaultThemeConfig, {
  type DestinationIndexVariant,
  type FooterLayoutVariant,
  type HeaderLayoutVariant,
  type HomeLayoutVariant,
  type ThemeConfig,
  type TourCardVariant,
} from "@/config/theme.config";
import {
  THEME_PRESETS,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
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

export function mergeAndValidateThemeConfig(
  base: ThemeConfig,
  raw: unknown
): ThemeConfig {
  const next: ThemeConfig = {
    ...base,
    layout: { ...base.layout },
    motion: { ...base.motion },
  };

  if (!raw || typeof raw !== "object") {
    return next;
  }

  const candidate = raw as Record<string, any>;

  if (
    typeof candidate.preset === "string" &&
    candidate.preset in THEME_PRESETS
  ) {
    next.preset = candidate.preset as ThemePresetId;
  }

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

  if (candidate.layout && typeof candidate.layout === "object") {
    if (VALID_HOME_VARIANTS.includes(candidate.layout.home)) {
      next.layout.home = candidate.layout.home;
    }
    if (VALID_TOUR_CARD_VARIANTS.includes(candidate.layout.tourCard)) {
      next.layout.tourCard = candidate.layout.tourCard;
    }
    if (VALID_DEST_INDEX_VARIANTS.includes(candidate.layout.destinationIndex)) {
      next.layout.destinationIndex = candidate.layout.destinationIndex;
    }
    if (VALID_HEADER_VARIANTS.includes(candidate.layout.header)) {
      next.layout.header = candidate.layout.header;
    }
    if (VALID_FOOTER_VARIANTS.includes(candidate.layout.footer)) {
      next.layout.footer = candidate.layout.footer;
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

export async function getServerSiteSettings(): Promise<ServerSiteSettingsPayload> {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/api/site-settings`, {
      next: { revalidate: 60, tags: ["site-settings"] },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return {};
    const data = await res.json();
    const raw = data?.value && typeof data.value === "object" ? data.value : data;
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
 * Resolves the active ThemeConfig on the server during SSR so `<html data-theme=...>`
 * and `<DesignSystemProvider initialConfig={...}>` render the exact theme on the first byte
 * with zero client-side flash (FOUC).
 *
 * Precedence:
 * 1. `defaultThemeConfig` (`theme.config.ts`)
 * 2. Admin-saved global theme (`SiteSettings.value.theme_config` from Express backend)
 * 3. Optional visitor/studio cookie (`nst_theme_config`)
 */
export async function getServerThemeConfig(): Promise<ThemeConfig> {
  const siteSettings = await getServerSiteSettings();
  let resolved = mergeAndValidateThemeConfig(
    defaultThemeConfig,
    siteSettings.theme_config
  );

  try {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
    if (rawCookie) {
      const parsedCookie = JSON.parse(decodeURIComponent(rawCookie));
      resolved = mergeAndValidateThemeConfig(resolved, parsedCookie);
    }
  } catch {
    // Ignore malformed cookie or static generation context
  }

  return resolved;
}
