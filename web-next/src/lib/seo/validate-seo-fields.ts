/**
 * Server-side & shared validation for SEO metadata fields (`canonical_url`, `og_image`,
 * `meta_title`, `meta_description`).
 *
 * Security invariants:
 * - Rejects `javascript:`, `data:`, `vbscript:`, `file:`, `blob:` schemes.
 * - Rejects protocol-relative URLs (`//evil.example`) to prevent open-redirect / canonical hijacking.
 * - Rejects HTML angle brackets (`<`, `>`), quotes (`"`, `'`, `` ` ``), and control characters.
 * - Allows empty string `""`, root-relative paths (`/tours/tour-cappadocia-tuff`), or valid `http(s)://` URLs.
 */

export interface SeoUrlValidationResult {
  valid: boolean;
  sanitized: string;
  error?: string;
}

const DANGEROUS_CHARACTERS = /[<>"'`\u0000-\u001F\u007F\s]/;
const DANGEROUS_SCHEME_PREFIX = /^\s*(?:javascript|data|vbscript|file|blob):/i;

export function validateSafeSeoUrl(
  raw: unknown,
  fieldName = "url",
  options: { allowRelative?: boolean } = { allowRelative: true }
): SeoUrlValidationResult {
  if (raw === undefined || raw === null || raw === "") {
    return { valid: true, sanitized: "" };
  }

  if (typeof raw !== "string") {
    return {
      valid: false,
      sanitized: "",
      error: `${fieldName} must be a string.`,
    };
  }

  const trimmed = raw.trim();
  if (trimmed === "") {
    return { valid: true, sanitized: "" };
  }

  if (trimmed.length > 2048) {
    return {
      valid: false,
      sanitized: "",
      error: `${fieldName} exceeds maximum length of 2048 characters.`,
    };
  }

  if (DANGEROUS_SCHEME_PREFIX.test(trimmed)) {
    return {
      valid: false,
      sanitized: "",
      error: `Invalid ${fieldName}: dangerous URI scheme is forbidden.`,
    };
  }

  if (DANGEROUS_CHARACTERS.test(trimmed)) {
    return {
      valid: false,
      sanitized: "",
      error: `Invalid ${fieldName}: contains forbidden HTML, quote, whitespace, or control characters.`,
    };
  }

  // Root-relative path (e.g., `/tours/tour-cappadocia-tuff` or `/demo/istanbul-bosphorus.jpg`)
  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//")) {
      return {
        valid: false,
        sanitized: "",
        error: `Invalid ${fieldName}: protocol-relative URLs (//...) are not allowed.`,
      };
    }
    if (options.allowRelative === false) {
      return {
        valid: false,
        sanitized: "",
        error: `Invalid ${fieldName}: must be an absolute http(s):// URL.`,
      };
    }
    return { valid: true, sanitized: trimmed };
  }

  // Absolute http(s) URL
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        sanitized: "",
        error: `Invalid ${fieldName}: only http:// and https:// protocols are permitted.`,
      };
    }
    return { valid: true, sanitized: parsed.toString() };
  } catch {
    return {
      valid: false,
      sanitized: "",
      error: `Invalid ${fieldName}: must be a valid http(s):// URL or root-relative / path.`,
    };
  }
}

export function sanitizeSafeSeoUrlOrFallback(
  raw: unknown,
  fallback = ""
): string {
  const result = validateSafeSeoUrl(raw);
  return result.valid && result.sanitized ? result.sanitized : fallback;
}
