"use client";

import HeroSwitch from "@/components/sections/Hero/HeroSwitch";
import DestinationsSwitch from "@/components/sections/Destinations/DestinationsSwitch";
import ToursSection from "@/components/home/ToursSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import type { PageManifest } from "@/config/pages/home.manifest";
import type {
  DestinationIndexVariant,
  HomeLayoutVariant,
} from "@/config/theme.config";
import type { Destination } from "@/hooks/useDestinations";
import type { DemoTour } from "@/lib/data/demo-content";

export default function HomeManifestDispatcher({
  fallbackManifest,
  initialDestinations,
  initialTours,
}: {
  fallbackManifest: PageManifest;
  initialDestinations: Destination[];
  initialTours: DemoTour[];
}) {
  const { concept } = useDesignSystem();
  const activeSections =
    concept?.pageManifests?.home?.sections || fallbackManifest.sections;

  const enabledSections = activeSections.filter((s) => s.enabled);

  return (
    <div
      data-testid="home-manifest-dispatcher"
      data-home-concept={concept.id}
    >
      {enabledSections.map((section) => {
        let content: React.ReactNode = null;
        switch (section.type) {
          case "hero":
            content = (
              <HeroSwitch
                variant={section.variant as HomeLayoutVariant | undefined}
                initialDestinations={initialDestinations}
                initialTours={initialTours}
              />
            );
            break;

          case "destination-index":
            content = (
              <DestinationsSwitch
                variant={
                  section.variant as DestinationIndexVariant | undefined
                }
                initialDestinations={initialDestinations}
              />
            );
            break;

          case "featured-tours":
            content = <ToursSection initialTours={initialTours} />;
            break;

          case "manifesto":
            content = <WelcomeSection />;
            break;

          case "testimonials":
            content = <TestimonialsSection />;
            break;

          case "cta-band":
            content = <CTASection />;
            break;

          default:
            content = null;
        }

        if (!content) return null;

        return (
          <div
            key={section.id}
            data-manifest-section={section.type}
            data-manifest-variant={section.variant || "default"}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
