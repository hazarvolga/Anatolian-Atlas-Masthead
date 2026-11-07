export type DataMode = "demo" | "connected";

export const siteConfig = {
  brand: {
    name: "NextStopTurkey",
    shortName: "Anatolian Atlas",
    tagline: "Anatolian Atlas — Regional Journeys",
    headline: "Türkiye, place by place.",
    description:
      "Small-group archaeological, culinary, and coastal journeys across İstanbul, Cappadocia, Ephesus, the Lycian Coast, Pamukkale, and Southeastern Anatolia.",
    foundedYear: 2019,
    // Empty placeholder by default — populate via NEXT_PUBLIC_TURSAB_LICENSE_NO in production
    tursabLicenseNo: process.env.NEXT_PUBLIC_TURSAB_LICENSE_NO || "",
  },
  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://nextstopturkey.com",
    titleTemplate: "%s | NextStopTurkey — Anatolian Atlas",
    defaultTitle: "NextStopTurkey — Anatolian Atlas & Regional Journeys",
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
    locale: "en_US",
  },
  contact: {
    // Empty placeholders by default — populate via NEXT_PUBLIC_* or Admin Site Settings in production
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    reservationsEmail: process.env.NEXT_PUBLIC_RESERVATIONS_EMAIL || "",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "",
    coordinates: process.env.NEXT_PUBLIC_OFFICE_COORDINATES || "",
    addressLines: process.env.NEXT_PUBLIC_CONTACT_ADDRESS
      ? process.env.NEXT_PUBLIC_CONTACT_ADDRESS.split("|")
      : ([] as string[]),
    hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || "",
    mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || "",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
  },
  currency: {
    code: "EUR",
    symbol: "€",
  },
  locales: {
    default: "en",
    supported: ["en", "tr", "es", "it"] as const,
  },
  features: {
    enableDesignStudio: process.env.ENABLE_DESIGN_STUDIO !== "false",
    allowUrlThemePreview: process.env.NEXT_PUBLIC_ALLOW_THEME_PREVIEW !== "false",
  },
  dataMode: (process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    ? "demo"
    : "connected") as DataMode,
} as const;

/**
 * Strictly returns true ONLY when NEXT_PUBLIC_DEMO_MODE === "true".
 * In live mode (default), upstream errors must return HTTP 503 / ErrorState
 * and never fall back to fake demo tours.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Resolves the Express backend URL for server-side (SSR/ISR) requests.
 * Prioritizes API_INTERNAL_URL so internal container/loopback traffic never
 * traverses public ingress.
 */
export function getInternalApiBaseUrl(): string {
  const raw =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3001";
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

export function formatPrice(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${siteConfig.currency.symbol}${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default siteConfig;
