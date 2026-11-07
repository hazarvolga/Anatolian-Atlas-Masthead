"use client";

import Link from "next/link";
import { MapPin, Users, Compass } from "lucide-react";

interface TourCardContentProps {
  tour: {
    id: string;
    name: string;
    description?: string;
    highlights?: string[];
    max_group_size: number;
    difficulty?: string;
    location?: string;
    destinations?: {
      city?: string;
      country?: string;
    };
  };
}

export default function TourCardContent({ tour }: TourCardContentProps) {
  const location = tour.destinations?.city
    ? `${tour.destinations.city}, ${tour.destinations.country || "Türkiye"}`
    : tour.location || "Türkiye";

  const paceLabel = tour.difficulty
    ? tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)
    : "Easy";

  return (
    <div className="space-y-3.5">
      {/* Location & Group Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{location}</span>
        </span>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>Max {tour.max_group_size}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Compass className="h-3.5 w-3.5 shrink-0" />
          <span>{paceLabel} pace</span>
        </span>
      </div>

      {/* Editorial Title */}
      <h3 className="font-serif text-xl font-medium text-foreground leading-snug line-clamp-2">
        <Link
          href={`/tours/${tour.id}`}
          className="hover:text-primary transition-colors"
        >
          {tour.name}
        </Link>
      </h3>

      {/* Concise Description */}
      <p className="text-text-secondary line-clamp-2 text-sm leading-relaxed">
        {tour.description ||
          "Small-group historical and cultural itinerary across Türkiye."}
      </p>

      {/* Highlights */}
      {tour.highlights && tour.highlights.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {tour.highlights.slice(0, 2).map((highlight, index) => (
            <li
              key={index}
              className="text-xs text-text-secondary bg-muted/70 px-2.5 py-1 rounded border border-border/60 truncate max-w-[220px]"
            >
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
