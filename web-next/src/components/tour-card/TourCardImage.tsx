"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEFAULT_DEMO_HERO_IMAGE } from "@/lib/data/demo-images";

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
      <Image
        src={tour.image_url || DEFAULT_DEMO_HERO_IMAGE}
        alt={tour.name}
        width={1000}
        height={750}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
