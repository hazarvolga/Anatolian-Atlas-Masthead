import HeroSwitch from "@/components/sections/Hero/HeroSwitch";
import DestinationsSwitch from "@/components/sections/Destinations/DestinationsSwitch";
import ToursSection from "@/components/home/ToursSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import type { PageManifest } from "@/config/pages/home.manifest";
import type {
  DestinationIndexVariant,
  HomeLayoutVariant,
} from "@/config/theme.config";

/**
 * Server Component Section Registry & Manifest Renderer
 * Fetches catalog data (`tours`, `destinations`) on the server (SSR/ISR)
 * and renders sections in manifest order.
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

  const enabledSections = manifest.sections.filter((s) => s.enabled);

  return (
    <>
      {enabledSections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <HeroSwitch
                key={section.id}
                variant={section.variant as HomeLayoutVariant | undefined}
                initialDestinations={initialDestinations}
                initialTours={initialTours}
              />
            );

          case "destination-index":
            return (
              <DestinationsSwitch
                key={section.id}
                variant={
                  section.variant as DestinationIndexVariant | undefined
                }
                initialDestinations={initialDestinations}
              />
            );

          case "featured-tours":
            return (
              <ToursSection
                key={section.id}
                initialTours={initialTours}
              />
            );

          case "manifesto":
            return <WelcomeSection key={section.id} />;

          case "testimonials":
            return <TestimonialsSection key={section.id} />;

          case "cta-band":
            return <CTASection key={section.id} />;

          default:
            return null;
        }
      })}
    </>
  );
}
