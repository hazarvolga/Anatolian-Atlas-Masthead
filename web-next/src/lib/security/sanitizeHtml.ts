/**
 * Strict, SSR-safe allowlist HTML sanitizer for CMS content (DynamicPage, rich text blocks).
 * Strips executable tags (<script>, <iframe>, <object>, <embed>, <svg>, <math>, <style>, <form>),
 * event handler attributes (on*), and dangerous URI schemes (javascript:, vbscript:, data:).
 */

const FORBIDDEN_BLOCK_TAGS =
  /<(script|iframe|object|embed|applet|form|input|button|select|textarea|style|link|meta|base|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi;

const FORBIDDEN_SELF_CLOSING_TAGS =
  /<(script|iframe|object|embed|applet|form|input|button|select|textarea|style|link|meta|base|svg|math|template|noscript)\b[^>]*\/?>/gi;

const ALLOWED_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "code",
  "pre",
  "br",
  "hr",
  "span",
  "div",
  "section",
  "article",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "a",
  "img",
  "sup",
  "sub",
  "small",
]);

const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  td: new Set(["colspan", "rowspan"]),
  "*": new Set(["class", "id", "lang", "dir"]),
};

function isSafeUrl(rawValue: string, allowRelative = true): boolean {
  const decoded = rawValue
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/[\u0000-\u0020]+/g, "")
    .trim();

  if (!decoded) return false;
  if (allowRelative && (decoded.startsWith("/") || decoded.startsWith("#"))) {
    return !decoded.startsWith("//");
  }

  try {
    const parsed = new URL(decoded);
    return (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:"
    );
  } catch {
    return false;
  }
}

export function sanitizeSafeImageUrl(url: unknown): string | undefined {
  if (typeof url !== "string" || !url.trim()) return undefined;
  const trimmed = url.trim();
  if (!isSafeUrl(trimmed, true)) return undefined;
  // Escape characters that could break out of CSS url("...")
  return trimmed.replace(/["'()\\]/g, "");
}

export function sanitizeHtml(dirty: unknown): string {
  if (typeof dirty !== "string" || !dirty.trim()) return "";

  let html = dirty
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(FORBIDDEN_BLOCK_TAGS, "")
    .replace(FORBIDDEN_SELF_CLOSING_TAGS, "");

  html = html.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (fullMatch, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = fullMatch.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (isClosing) {
      return `</${tag}>`;
    }

    const tagAllowed = ALLOWED_ATTRS_BY_TAG[tag];
    const globalAllowed = ALLOWED_ATTRS_BY_TAG["*"];
    const safeAttrs: string[] = [];

    const attrRegex = /([a-zA-Z0-9:-]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let match: RegExpExecArray | null;

    while ((match = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = match[1].toLowerCase();
      if (attrName === "/" || attrName.startsWith("on") || attrName === "style" || attrName === "srcdoc") {
        continue;
      }

      const isAllowed =
        (tagAllowed && tagAllowed.has(attrName)) ||
        (globalAllowed && globalAllowed.has(attrName));
      if (!isAllowed) continue;

      const rawVal = match[2] ?? match[3] ?? match[4] ?? "";
      if (attrName === "href" || attrName === "src") {
        if (!isSafeUrl(rawVal, true)) continue;
      }

      const escapedVal = rawVal
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      safeAttrs.push(`${attrName}="${escapedVal}"`);
    }

    if (tag === "a") {
      const hasRel = safeAttrs.some((a) => a.startsWith("rel="));
      if (!hasRel) {
        safeAttrs.push('rel="noopener noreferrer"');
      }
    }

    const selfClosing = tag === "br" || tag === "hr" || tag === "img" ? " /" : "";
    const attrString = safeAttrs.length > 0 ? ` ${safeAttrs.join(" ")}` : "";
    return `<${tag}${attrString}${selfClosing}>`;
  });

  return html;
}
