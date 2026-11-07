"use client";

import HeroSection from "@/components/HeroSection";
import HeroSplitCinema from "./HeroSplitCinema";
import HeroFullscreenReel from "./HeroFullscreenReel";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import type { HomeLayoutVariant } from "@/config/theme.config";
import type { Destination } from "@/hooks/useDestinations";
import type { DemoTour } from "@/lib/data/demo-content";

export default function HeroSwitch({
  variant: variantProp,
  initialDestinations,
  initialTours,
}: {
  variant?: HomeLayoutVariant;
  initialDestinations?: Destination[];
  initialTours?: DemoTour[];
}) {
  const { config } = useDesignSystem();
  const activeVariant = config.layout.home || variantProp || "masthead";

  if (activeVariant === "split-cinema") {
    return (
      <HeroSplitCinema
        initialDestinations={initialDestinations}
        initialTours={initialTours}
      />
    );
  }

  if (activeVariant === "fullscreen-reel") {
    return (
      <HeroFullscreenReel
        initialDestinations={initialDestinations}
        initialTours={initialTours}
      />
    );
  }

  return <HeroSection initialDestinations={initialDestinations} />;
}
