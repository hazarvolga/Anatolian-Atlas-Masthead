import { NextResponse } from "next/server";
import { isDemoMode } from "@/config/site.config";
import { getServerToursWithStatus } from "@/lib/data/server-catalog";

export async function GET() {
  const result = await getServerToursWithStatus();
  if (result.upstreamError && !isDemoMode()) {
    return NextResponse.json(
      {
        status: "unavailable",
        demoMode: false,
        code: "ERR_503_UPSTREAM_CATALOGUE",
        message: result.errorMessage || "Catalogue service unavailable",
        tours: [],
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      demoMode: isDemoMode(),
      count: result.data.length,
    },
    { status: 200 }
  );
}
