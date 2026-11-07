/**
 * Triggers Next.js `/api/revalidate` (`revalidateTag(tag, { expire: 0 })`)
 * after any Admin mutation (Tour, Destination, or CMS Page).
 */
export async function triggerCatalogRevalidate(
  tags: string[],
  paths: string[] = ["/", "/tours", "/destinations"]
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const token = localStorage.getItem("authToken");
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ tags, paths }),
    });
  } catch {
    // Non-blocking best-effort cache invalidation
  }
}
