"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import TourCardImage from "./tour-card/TourCardImage";
import TourCardContent from "./tour-card/TourCardContent";
import TourCardActions from "./tour-card/TourCardActions";

interface TourCardProps {
  tour: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    max_group_size: number;
    image_url?: string;
    location?: string;
    highlights?: string[];
    rating?: number;
    difficulty?: string;
    tour_type?: "multiple_day" | "one_day" | "date_range";
    destinations?: {
      city?: string;
      country?: string;
    };
  };
}

export default function TourCard({ tour }: TourCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(
        "group flex flex-col h-full overflow-hidden rounded-lg bg-card border border-border",
        "transition-shadow duration-200 hover:shadow-md hover:border-foreground/25"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photograph with at most 1 badge */}
      <TourCardImage tour={tour} isHovered={isHovered} />

      {/* Metadata & Editorial Copy Below Photograph */}
      <div className="flex flex-col flex-1 justify-between p-6 space-y-5">
        <TourCardContent tour={tour} />
        <TourCardActions tourId={tour.id} price={tour.price} />
      </div>
    </article>
  );
}
