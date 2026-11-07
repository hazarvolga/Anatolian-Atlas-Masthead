"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1000&q=80";

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
  indexNumber?: number;
}

export default function TourCard({ tour, indexNumber }: TourCardProps) {
  const { t } = useLanguage();

  const regionLabel =
    tour.destinations?.city || tour.location || "Anatolia, Türkiye";
  const durationLabel =
    tour.tour_type === "multiple_day" && tour.duration >= 24
      ? `${Math.round(tour.duration / 24)} Days`
      : `${tour.duration || 8} Hours`;
  const paceLabel = tour.difficulty
    ? tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)
    : "Moderate";
  const highlights = Array.isArray(tour.highlights)
    ? tour.highlights.slice(0, 3)
    : [];

  return (
    <article className="group flex flex-col justify-between bg-card border border-border transition-colors duration-200 hover:border-foreground">
      <div>
        {/* Top Hairline Specification Strip */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-text-secondary tabular-nums bg-background/60">
          <div className="flex items-center gap-2.5">
            {typeof indexNumber === "number" && (
              <span className="text-primary font-semibold">
                {String(indexNumber).padStart(2, "0")} /
              </span>
            )}
            <span className="font-medium text-foreground truncate max-w-[220px]">
              {regionLabel}
            </span>
          </div>
          <span>PACE: {paceLabel}</span>
        </div>

        {/* Unrounded Editorial Plate */}
        <Link
          href={`/tours/${tour.id}`}
          className="block relative aspect-[16/10] overflow-hidden bg-foreground border-b border-border"
        >
          <img
            src={tour.image_url || DEFAULT_TOUR_IMAGE}
            alt={`${tour.name} — ${regionLabel}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>

        {/* Tabular Route Metrics Bar */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-background/40 text-xs tabular-nums">
          <div className="px-4 py-2.5">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
              DURATION
            </span>
            <span className="font-medium text-foreground">{durationLabel}</span>
          </div>
          <div className="px-4 py-2.5">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
              CEILING
            </span>
            <span className="font-medium text-foreground">
              Max {tour.max_group_size || 12} Guests
            </span>
          </div>
          <div className="px-4 py-2.5">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
              FORMAT
            </span>
            <span className="font-medium text-foreground">Scholar-Led</span>
          </div>
        </div>

        {/* Editorial Headline & Route Notes */}
        <div className="p-6 space-y-4">
          <h3 className="font-serif text-2xl text-foreground leading-snug group-hover:text-primary transition-colors">
            <Link href={`/tours/${tour.id}`}>{tour.name}</Link>
          </h3>

          {tour.description && (
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
              {tour.description}
            </p>
          )}

          {highlights.length > 0 && (
            <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
              <span className="text-[10px] uppercase tracking-[0.14em] text-primary font-semibold mr-1">
                STOPS:
              </span>
              {highlights.map((stop, idx) => (
                <span key={idx} className="inline-flex items-center">
                  {idx > 0 && <span className="mx-1.5 text-border">·</span>}
                  <span>{stop}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flush Bottom Pricing & Dispatch Bar */}
      <div className="px-6 py-4 border-t border-border bg-background/50 flex items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
            Tariff / Guest
          </span>
          <span className="font-serif text-2xl text-foreground tabular-nums">
            {formatPrice(tour.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tours/${tour.id}`}
            className="px-4 py-2.5 border border-border bg-card text-foreground hover:border-foreground text-[11px] uppercase tracking-[0.14em] font-medium transition-colors"
          >
            Dossier
          </Link>
          <Link
            href={`/book/${tour.id}`}
            className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-[#8B3726] text-[11px] uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{t.nav?.bookNow || "Reserve"}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
