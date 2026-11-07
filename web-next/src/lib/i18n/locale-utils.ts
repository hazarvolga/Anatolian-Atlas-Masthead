import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";

export const SUPPORTED_LOCALES = ["en", "tr", "es", "it"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "en";

export const NON_LOCALIZED_PREFIXES = [
  "/admin",
  "/auth",
  "/api",
  "/booking-success",
  "/booking-cancel",
  "/profile",
  "/my-reservations",
  "/design-system",
  "/_next",
  "/llms.txt",
  "/sitemap.xml",
  "/robots.txt",
] as const;

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return Boolean(value && (SUPPORTED_LOCALES as readonly string[]).includes(value));
}

export function isNonLocalizedPath(pathname: string): boolean {
  return NON_LOCALIZED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Extracts `{ locale, strippedPathname, hasExplicitDefaultLocale }` from a URL pathname.
 * Implements `localePrefix: 'as-needed'`:
 * - `/tours` -> `{ locale: 'en', strippedPathname: '/tours', hasExplicitDefaultLocale: false }`
 * - `/tr/tours` -> `{ locale: 'tr', strippedPathname: '/tours', hasExplicitDefaultLocale: false }`
 * - `/en/tours` -> `{ locale: 'en', strippedPathname: '/tours', hasExplicitDefaultLocale: true }`
 */
export function parseLocalizedPathname(pathname: string): {
  locale: SupportedLocale;
  strippedPathname: string;
  hasExplicitDefaultLocale: boolean;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase();

  if (first && isSupportedLocale(first)) {
    const rest = "/" + segments.slice(1).join("/");
    const strippedPathname = rest === "/" ? "/" : rest.replace(/\/$/, "");
    return {
      locale: first,
      strippedPathname,
      hasExplicitDefaultLocale: first === DEFAULT_LOCALE,
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    strippedPathname: pathname === "/" ? "/" : pathname.replace(/\/$/, ""),
    hasExplicitDefaultLocale: false,
  };
}

/**
 * Builds a localized path under `localePrefix: 'as-needed'`:
 * - `en` -> `/tours` (no prefix)
 * - `tr` -> `/tr/tours`
 * - `es` -> `/es/tours`
 * - `it` -> `/it/tours`
 */
export function buildLocalizedPath(
  pathname: string,
  locale: SupportedLocale
): string {
  const { strippedPathname } = parseLocalizedPathname(pathname);
  if (isNonLocalizedPath(strippedPathname)) {
    return strippedPathname;
  }
  if (locale === DEFAULT_LOCALE) {
    return strippedPathname || "/";
  }
  return strippedPathname === "/" ? `/${locale}` : `/${locale}${strippedPathname}`;
}

export function buildAbsoluteLocalizedUrl(
  pathname: string,
  locale: SupportedLocale
): string {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const localizedPath = buildLocalizedPath(pathname, locale);
  return `${baseUrl}${localizedPath}`;
}

/**
 * Generates reciprocal `alternates` (`canonical` + `languages` hreflang + `x-default`)
 * for Next.js `Metadata`.
 */
export function buildAlternatesMetadata(
  pathname: string,
  activeLocale: SupportedLocale = DEFAULT_LOCALE
): Metadata["alternates"] {
  const { strippedPathname } = parseLocalizedPathname(pathname);
  return {
    canonical: buildAbsoluteLocalizedUrl(strippedPathname, activeLocale),
    languages: {
      en: buildAbsoluteLocalizedUrl(strippedPathname, "en"),
      tr: buildAbsoluteLocalizedUrl(strippedPathname, "tr"),
      es: buildAbsoluteLocalizedUrl(strippedPathname, "es"),
      it: buildAbsoluteLocalizedUrl(strippedPathname, "it"),
      "x-default": buildAbsoluteLocalizedUrl(strippedPathname, "en"),
    },
  };
}
