/**
 * Server-side helpers for metadata and route guards.
 *
 * `client.ts` is a "use client" module, so its API_BASE_URL export cannot be
 * read from a Server Component. Keep a separate constant here and always give
 * the upstream call a short timeout: metadata must never fail a build or a
 * prerender when the backend is unavailable.
 */
export const SERVER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export interface ServerFetchResult<T> {
  ok: boolean;
  status?: number | null;
  data?: T;
}

export async function fetchServerJson<T>(
  path: string
): Promise<ServerFetchResult<T>> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: null };
  }
}
