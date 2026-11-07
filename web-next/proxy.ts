import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isFullyTranslatedRoute,
  isNonLocalizedPath,
  parseLocalizedPathname,
} from "./src/lib/i18n/locale-utils";

/**
 * Next.js 16 `proxy.ts` convention (replaces deprecated `middleware.ts`).
 * Implements `localePrefix: 'as-needed'`, enforces `noindex` on admin/auth/checkout/account
 * routes, and marks untranslated locale prose variants (`/tr/journal/*`, `/tr/tours/[id]`, etc.)
 * as `noindex, follow` with canonical pointing to the English URL.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Non-localized routes (/admin, /auth, /booking-success, /booking-cancel, /profile, /my-reservations, /design-system)
  if (isNonLocalizedPath(pathname)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nst-locale", DEFAULT_LOCALE);
    requestHeaders.set("x-nst-stripped-pathname", pathname);

    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const { locale, strippedPathname, hasExplicitDefaultLocale } =
    parseLocalizedPathname(pathname);

  // Enforce localePrefix: 'as-needed' — redirect /en or /en/tours -> / or /tours
  if (hasExplicitDefaultLocale) {
    const targetUrl = new URL(`${strippedPathname}${search}`, req.url);
    return NextResponse.redirect(targetUrl, 308);
  }

  // Prevent /tr/admin or /es/auth from rewriting into admin/auth
  if (locale !== DEFAULT_LOCALE && isNonLocalizedPath(strippedPathname)) {
    const targetUrl = new URL(`${strippedPathname}${search}`, req.url);
    return NextResponse.redirect(targetUrl, 308);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nst-locale", locale);
  requestHeaders.set("x-nst-stripped-pathname", strippedPathname);

  if (locale !== DEFAULT_LOCALE) {
    const rewriteUrl = new URL(`${strippedPathname}${search}`, req.url);
    const res = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    res.headers.set("Content-Language", locale);
    if (!isFullyTranslatedRoute(strippedPathname)) {
      res.headers.set("X-Robots-Tag", "noindex, follow");
    }
    return res;
  }

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  res.headers.set("Content-Language", DEFAULT_LOCALE);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
