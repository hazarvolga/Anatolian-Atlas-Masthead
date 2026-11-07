import HomeManifestDispatcher from "@/components/sections/HomeManifestDispatcher";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import type { PageManifest } from "@/config/pages/home.manifest";

/**
 * Server Component Section Registry & Manifest Renderer
 * Fetches catalog data (`tours`, `destinations`) on the server (SSR/ISR)
 * and delegates concept-specific section ordering & variants to `HomeManifestDispatcher`.
 */
export default async function SectionRenderer({
  manifest,
}: {
  manifest: PageManifest;
}) {
  const [initialDestinations, initialTours] = await Promise.all([
    getServerDestinations(),
    getServerTours(),
  ]);

  return (
    <HomeManifestDispatcher
      fallbackManifest={manifest}
      initialDestinations={initialDestinations}
      initialTours={initialTours}
    />
  );
}
