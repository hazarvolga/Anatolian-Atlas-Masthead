"use client";

import DestinationsSection from "@/components/home/DestinationsSection";
import DestinationsGridMosaic from "./DestinationsGridMosaic";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import type { DestinationIndexVariant } from "@/config/theme.config";
import type { Destination } from "@/hooks/useDestinations";

export default function DestinationsSwitch({
  variant: variantProp,
  initialDestinations,
}: {
  variant?: DestinationIndexVariant;
  initialDestinations?: Destination[];
}) {
  const { config } = useDesignSystem();
  const activeVariant =
    config.layout.destinationIndex || variantProp || "map-index";

  if (activeVariant === "grid-mosaic") {
    return <DestinationsGridMosaic initialDestinations={initialDestinations} />;
  }

  return <DestinationsSection initialDestinations={initialDestinations} />;
}
