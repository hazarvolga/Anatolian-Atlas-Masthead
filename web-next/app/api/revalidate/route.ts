import { NextRequest, NextResponse } from "next/server";
import { invalidateCatalogCacheByTags } from "@/lib/data/server-catalog";

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || "nst-internal-revalidate-secret";

/**
 * POST /api/revalidate
 * On-demand ISR tag & path revalidation endpoint invoked whenever Admin
 * creates, updates, or deletes a Tour, Destination, or CMS Page.
 * Calls Next.js 16 `revalidateTag(tag, { expire: 0 })` and purges the
 * validated in-memory server catalog cache.
 */
export async function POST(req: NextRequest) {
  try {
    const secretHeader = req.headers.get("x-revalidate-secret");
    const authHeader = req.headers.get("authorization");
    const originHeader = req.headers.get("origin") || "";
    const isSameOrigin =
      originHeader.includes("localhost") ||
      originHeader.includes("127.0.0.1") ||
      Boolean(authHeader?.startsWith("Bearer "));

    if (secretHeader !== REVALIDATE_SECRET && !isSameOrigin) {
      return NextResponse.json(
        { revalidated: false, message: "Unauthorized revalidation request" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const tags: string[] = Array.isArray(body?.tags)
      ? body.tags.filter((t: unknown) => typeof t === "string")
      : ["catalog-tours", "catalog-destinations", "cms-pages"];

    const paths: string[] = Array.isArray(body?.paths)
      ? body.paths.filter((p: unknown) => typeof p === "string")
      : ["/", "/tours", "/destinations"];

    const result = invalidateCatalogCacheByTags(tags, paths);
    return NextResponse.json(result, { status: 200 });
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
