import sanitize from "sanitize-html";

/**
 * Production-grade, AST-based HTML sanitizer powered by `sanitize-html` (htmlparser2).
 * Works deterministically in both Node.js Server Components and Client Components.
 */

function isSafeHttpOrRelativeUrl(rawValue: string): boolean {
  const trimmed = rawValue.replace(/[\u0000-\u0020]+/g, "").trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//");
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: [
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
  ],
  disallowedTagsMode: "discard",
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["class", "id", "lang", "dir"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const nextAttribs = { ...attribs };
      if (nextAttribs.target === "_blank") {
        nextAttribs.rel = "noopener noreferrer";
      } else if (!nextAttribs.rel) {
        nextAttribs.rel = "noopener noreferrer";
      }
      return {
        tagName,
        attribs: nextAttribs,
      };
    },
    img: (tagName, attribs) => {
      const nextAttribs = { ...attribs };
      if (!nextAttribs.src || !isSafeHttpOrRelativeUrl(nextAttribs.src)) {
        delete nextAttribs.src;
      }
      return {
        tagName,
        attribs: nextAttribs,
      };
    },
  },
};

export function sanitizeSafeImageUrl(url: unknown): string | undefined {
  if (typeof url !== "string" || !url.trim()) return undefined;
  const trimmed = url.trim();
  if (!isSafeHttpOrRelativeUrl(trimmed)) return undefined;
  return trimmed.replace(/["'()\\]/g, "");
}

export function sanitizeHtml(dirty: unknown): string {
  if (typeof dirty !== "string" || !dirty.trim()) return "";
  return sanitize(dirty, SANITIZE_OPTIONS);
}
