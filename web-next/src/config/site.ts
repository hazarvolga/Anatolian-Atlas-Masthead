export type DataMode = "demo" | "connected";

export const siteConfig = {
  brand: {
    name: "NextStopTurkey",
    tagline: "Anatolian Atlas — Regional Journeys",
    headline: "Türkiye, place by place.",
    description:
      "Small-group archaeological, culinary, and coastal journeys across Istanbul, Cappadocia, Ephesus, the Lycian Coast, Pamukkale, and Southeastern Anatolia.",
  },
  contact: {
    email: "hello@nextstopturkey.com",
    reservationsEmail: "journeys@nextstopturkey.com",
    phone: "+90 (212) 555 01 48",
    whatsapp: "+90 (531) 026 69 96",
    addressLines: [
      "Serdar-ı Ekrem Caddesi No. 28/4",
      "Galata, Beyoğlu 34421",
      "İstanbul, Türkiye",
    ],
    hours: "Monday – Saturday, 09:00 – 19:00 TRT (UTC+3)",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2286646635327!2d28.9719813!3d41.0258847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3dcc8b330b!2sGalata%20Tower!5e0!3m2!1sen!2str!4v1710000000000!5m2!1sen!2str",
  },
  social: {
    instagram: "https://instagram.com/nextstopturkey",
    youtube: "https://youtube.com/@nextstopturkey",
    linkedin: "https://linkedin.com/company/nextstopturkey",
  },
  currency: {
    code: "EUR",
    symbol: "€",
  },
  locales: {
    default: "en",
    supported: ["en", "tr", "es", "it"] as const,
  },
  dataMode: (process.env.NEXT_PUBLIC_DATA_MODE === "demo"
    ? "demo"
    : "connected") as DataMode,
} as const;

export function isDemoMode(): boolean {
  return siteConfig.dataMode === "demo";
}

export function formatPrice(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${siteConfig.currency.symbol}${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
