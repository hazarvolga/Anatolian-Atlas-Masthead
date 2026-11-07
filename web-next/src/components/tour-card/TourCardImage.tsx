"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TourCardImageProps {
  tour: {
    id: string;
    name: string;
    duration: number;
    image_url?: string;
    tour_type?: "multiple_day" | "one_day" | "date_range";
  };
  isHovered: boolean;
}

export default function TourCardImage({ tour, isHovered }: TourCardImageProps) {
  const badgeLabel =
    tour.tour_type === "multiple_day"
      ? `${tour.duration} Days`
      : `${tour.duration} Hours`;

  return (
    <Link
      href={`/tours/${tour.id}`}
      className="relative block overflow-hidden aspect-[4/3] bg-muted"
    >
      <img
        src={
          tour.image_url ||
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80"
        }
        alt={tour.name}
        className={cn(
          "w-full h-full object-cover transition-transform duration-500 ease-out",
          isHovered ? "scale-[1.03]" : "scale-100"
        )}
      />

      {/* Single allowed badge on photograph */}
      <div className="absolute top-3.5 left-3.5">
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-background/95 text-foreground text-xs font-medium tracking-wide border border-border/80 tabular-nums">
          {badgeLabel}
        </span>
      </div>
    </Link>
  );
}
