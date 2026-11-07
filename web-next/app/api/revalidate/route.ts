import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { invalidateCatalogCacheByTags } from "@/lib/data/server-catalog";

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || "nst-internal-revalidate-secret";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(clientKey: string): {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitBuckets.get(clientKey) || []).filter(
    (ts) => ts > windowStart
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = recent[0] || now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000)
    );
    rateLimitBuckets.set(clientKey, recent);
    return { limited: true, remaining: 0, retryAfterSeconds };
  }

  recent.push(now);
  rateLimitBuckets.set(clientKey, recent);
  return {
    limited: false,
    remaining: RATE_LIMIT_MAX_REQUESTS - recent.length,
    retryAfterSeconds: 0,
  };
}

function verifySecretTimingSafe(provided: string | null): boolean {
  if (!provided || !REVALIDATE_SECRET) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(REVALIDATE_SECRET, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * POST /api/revalidate
 * Server-to-server on-demand ISR tag & path revalidation endpoint.
 * Strictly requires `x-revalidate-secret` header matching `REVALIDATE_SECRET`
 * and enforces per-IP rate limiting. Never called directly from browser hooks.
 */
export async function POST(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : req.headers.get("x-real-ip") || "127.0.0.1";

  const rateCheck = isRateLimited(clientIp);
  if (rateCheck.limited) {
    return NextResponse.json(
      {
        revalidated: false,
        message: "Too many revalidation requests. Please retry later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfterSeconds),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const secretHeader = req.headers.get("x-revalidate-secret");
  if (!verifySecretTimingSafe(secretHeader)) {
    return NextResponse.json(
      {
        revalidated: false,
        message: "Forbidden: valid x-revalidate-secret header required",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const tags: string[] = Array.isArray(body?.tags)
      ? body.tags.filter((t: unknown) => typeof t === "string")
      : ["catalog-tours", "catalog-destinations", "cms-pages"];

    const paths: string[] = Array.isArray(body?.paths)
      ? body.paths.filter((p: unknown) => typeof p === "string")
      : ["/", "/tours", "/destinations"];

    const result = invalidateCatalogCacheByTags(tags, paths);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        message: err instanceof Error ? err.message : "Revalidation failed",
      },
      { status: 500 }
    );
  }
}
