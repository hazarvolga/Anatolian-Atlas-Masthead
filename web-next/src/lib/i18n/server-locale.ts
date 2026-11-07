import { headers } from "next/headers";
import type { Metadata } from "next";
import { en } from "@/locales/en";
import { tr } from "@/locales/tr";
import { es } from "@/locales/es";
import { it } from "@/locales/it";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  isFullyTranslatedRoute,
  buildAlternatesMetadata,
  type SupportedLocale,
} from "./locale-utils";

const translations: Record<SupportedLocale, typeof en> = {
  en,
  tr,
  es,
  it,
};

export async function getServerLocale(): Promise<SupportedLocale> {
  try {
    const hdrs = await headers();
    const rawLocale = hdrs.get("x-nst-locale");
    if (isSupportedLocale(rawLocale)) {
      return rawLocale;
    }
  } catch {
    // Fallback outside request context (e.g., static generation)
  }
  return DEFAULT_LOCALE;
}

export async function getServerPathname(fallbackPath = "/"): Promise<string> {
  try {
    const hdrs = await headers();
    const rawPath = hdrs.get("x-nst-stripped-pathname");
    if (rawPath) return rawPath;
  } catch {
    // Ignore outside request context
  }
  return fallbackPath;
}

export async function getServerDictionary() {
  const locale = await getServerLocale();
  return {
    locale,
    t: translations[locale] || translations.en,
  };
}

export async function buildPageSeoMetadata({
  pathname,
  title,
  description,
  openGraphType = "website",
  images,
  noindex = false,
}: {
  pathname: string;
  title: string;
  description: string;
  openGraphType?: "website" | "article";
  images?: string[];
  noindex?: boolean;
}): Promise<Metadata> {
  const locale = await getServerLocale();
  const translatedRoute = isFullyTranslatedRoute(pathname);

  // If a page has English-only prose/DB content and is accessed under /tr, /es, or /it,
  // set noindex, follow and point canonical to the English URL (without hreflang).
  const shouldNoindexUntranslatedLocale =
    locale !== DEFAULT_LOCALE && !translatedRoute;
  const effectiveNoindex = noindex || shouldNoindexUntranslatedLocale;

  const alternates = noindex
    ? undefined
    : buildAlternatesMetadata(pathname, locale);

  const ogLocaleMap: Record<SupportedLocale, string> = {
    en: "en_US",
    tr: "tr_TR",
    es: "es_ES",
    it: "it_IT",
  };

  const activeOgLocale = translatedRoute ? ogLocaleMap[locale] : "en_US";

  return {
    title,
    description,
    alternates,
    robots: effectiveNoindex
      ? { index: false, follow: !noindex }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: openGraphType,
      locale: activeOgLocale,
      ...(translatedRoute
        ? {
            alternateLocale: (
              ["en_US", "tr_TR", "es_ES", "it_IT"] as const
            ).filter((l) => l !== activeOgLocale),
          }
        : {}),
      ...(images && images.length > 0 ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images && images.length > 0 ? { images } : {}),
    },
  };
}
