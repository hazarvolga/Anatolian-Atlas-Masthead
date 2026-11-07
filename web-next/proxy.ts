import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isFullyTranslatedRoute,
  isNonLocalizedPath,
  parseLocalizedPathname,
} from "./src/lib/i18n/locale-utils";

function generateRequestNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function attachSecurityAndNonceHeaders(res: NextResponse, nonce: string) {
  res.headers.set("x-nonce", nonce);
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // When CSP_STRICT_NONCE=true (full dynamic SSR mode), replace 'unsafe-inline' with per-request cryptographic nonce.
  // In default ISR mode, static/ISR pages (/, /tours, /destinations) remain cached at edge/server without calling headers() in root layout.
  if (process.env.CSP_STRICT_NONCE === "true") {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      "http://localhost:3001";
    const strictCsp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://images.pexels.com https://res.cloudinary.com https://*.tile.openstreetmap.org",
      `connect-src 'self' ${apiOrigin} http://localhost:3001 http://127.0.0.1:3001 https://api.stripe.com`,
      "frame-src 'self' https://www.google.com https://maps.google.com https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");
    res.headers.set("Content-Security-Policy", strictCsp);
  }
}

/**
 * Next.js 16 `proxy.ts` convention (replaces deprecated `middleware.ts`).
 * Implements `localePrefix: 'as-needed'`, per-request cryptographic `x-nonce` generation,
 * enforces `noindex` on admin/auth/checkout/account routes, and marks untranslated
 * locale prose variants (`/tr/journal/*`, `/tr/tours/[id]`, etc.) as `noindex, follow`
 * with canonical pointing to the English URL.
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

  const nonce = generateRequestNonce();

  // Non-localized routes (/admin, /auth, /booking-success, /booking-cancel, /profile, /my-reservations, /design-system)
  if (isNonLocalizedPath(pathname)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nst-locale", DEFAULT_LOCALE);
    requestHeaders.set("x-nst-stripped-pathname", pathname);
    requestHeaders.set("x-nonce", nonce);

    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    attachSecurityAndNonceHeaders(res, nonce);
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
  requestHeaders.set("x-nonce", nonce);

  if (locale !== DEFAULT_LOCALE) {
    const rewriteUrl = new URL(`${strippedPathname}${search}`, req.url);
    const res = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    res.headers.set("Content-Language", locale);
    if (!isFullyTranslatedRoute(strippedPathname)) {
      res.headers.set("X-Robots-Tag", "noindex, follow");
    }
    attachSecurityAndNonceHeaders(res, nonce);
    return res;
  }

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  res.headers.set("Content-Language", DEFAULT_LOCALE);
  attachSecurityAndNonceHeaders(res, nonce);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
