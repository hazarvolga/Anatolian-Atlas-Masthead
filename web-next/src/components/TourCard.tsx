"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import type { TourCardVariant } from "@/config/theme.config";

const DEFAULT_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1000&q=80";

export interface TourCardProps {
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
  variant?: TourCardVariant;
}

export default function TourCard({
  tour,
  indexNumber,
  variant: variantProp,
}: TourCardProps) {
  const { t } = useLanguage();
  const { config } = useDesignSystem();
  const activeVariant: TourCardVariant = variantProp || config.layout.tourCard;

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
  const formattedIndex =
    typeof indexNumber === "number"
      ? String(indexNumber).padStart(2, "0")
      : "01";

  // Variant 3: Minimal Archival Index List Row
  if (activeVariant === "minimal-list") {
    return (
      <article className="group grid grid-cols-1 lg:grid-cols-12 items-center gap-4 py-6 px-5 border border-border bg-card rounded-card hover:border-foreground transition-colors">
        <div className="lg:col-span-3 flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-primary tabular-nums">
            {formattedIndex}
          </span>
          <span className="text-border">/</span>
          <div>
            <span className="block text-xs uppercase tracking-[0.14em] font-medium text-foreground">
              {regionLabel}
            </span>
            <span className="editorial-meta">
              {durationLabel} · Max {tour.max_group_size || 12} Guests · {paceLabel}
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-1">
          <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
            <Link href={`/tours/${tour.id}`}>{tour.name}</Link>
          </h3>
          {tour.description && (
            <p className="text-xs text-text-secondary line-clamp-1">
              {tour.description}
            </p>
          )}
        </div>

        <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
          <div className="text-left lg:text-right">
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
              className="px-3.5 py-2.5 border border-border rounded-control bg-background text-foreground hover:border-foreground text-[11px] uppercase tracking-[0.13em] font-medium transition-colors"
            >
              Dossier
            </Link>
            <Link
              href={`/book/${tour.id}`}
              className="px-3.5 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover rounded-control text-[11px] uppercase tracking-[0.13em] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>{t.nav?.bookNow || "Reserve"}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Variant 2: Asymmetric Horizontal Landscape Row
  if (activeVariant === "landscape-row") {
    return (
      <article className="group grid grid-cols-1 lg:grid-cols-12 bg-card border border-border rounded-card overflow-hidden hover:border-foreground transition-colors">
        <Link
          href={`/tours/${tour.id}`}
          className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:min-h-[260px] overflow-hidden bg-foreground border-b lg:border-b-0 lg:border-r border-border"
        >
          <img
            src={tour.image_url || DEFAULT_TOUR_IMAGE}
            alt={`${tour.name} — ${regionLabel}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
            {formattedIndex} · {regionLabel}
          </div>
        </Link>

        <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border space-y-4">
          <div className="space-y-3">
            <span className="editorial-kicker block">
              {durationLabel} · Pace: {paceLabel}
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl text-foreground leading-snug group-hover:text-primary transition-colors">
              <Link href={`/tours/${tour.id}`}>{tour.name}</Link>
            </h3>
            {tour.description && (
              <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                {tour.description}
              </p>
            )}
          </div>

          {highlights.length > 0 && (
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
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

        <div className="lg:col-span-3 p-6 lg:p-8 bg-background/40 flex flex-col justify-between gap-6">
          <div className="space-y-2 text-xs tabular-nums">
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-text-secondary uppercase tracking-[0.12em] text-[10px]">
                Duration
              </span>
              <span className="font-medium text-foreground">{durationLabel}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/60">
              <span className="text-text-secondary uppercase tracking-[0.12em] text-[10px]">
                Ceiling
              </span>
              <span className="font-medium text-foreground">
                Max {tour.max_group_size || 12} Guests
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary uppercase tracking-[0.12em] text-[10px]">
                Format
              </span>
              <span className="font-medium text-foreground">Scholar-Led</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
                Tariff / Guest
              </span>
              <span className="font-serif text-3xl text-foreground tabular-nums">
                {formatPrice(tour.price)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/tours/${tour.id}`}
                className="px-3 py-2.5 text-center border border-border rounded-control bg-card text-foreground hover:border-foreground text-[11px] uppercase tracking-[0.13em] font-medium transition-colors"
              >
                Dossier
              </Link>
              <Link
                href={`/book/${tour.id}`}
                className="px-3 py-2.5 text-center bg-primary text-primary-foreground hover:bg-primary-hover rounded-control text-[11px] uppercase tracking-[0.13em] font-semibold inline-flex items-center justify-center gap-1 transition-colors"
              >
                <span>{t.nav?.bookNow || "Reserve"}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant 1 (Default): Portrait 4:5 Editorial Plate
  return (
    <article className="group flex flex-col justify-between bg-card border border-border rounded-card overflow-hidden transition-colors duration-200 hover:border-foreground">
      <div>
        {/* Top Hairline Specification Strip */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-text-secondary tabular-nums bg-background/60">
          <div className="flex items-center gap-2.5">
            {typeof indexNumber === "number" && (
              <span className="text-primary font-semibold">
                {formattedIndex} /
              </span>
            )}
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {regionLabel}
            </span>
          </div>
          <span>PACE: {paceLabel}</span>
        </div>

        {/* 4:5 Editorial Portrait Plate */}
        <Link
          href={`/tours/${tour.id}`}
          className="block relative aspect-[4/5] overflow-hidden bg-foreground border-b border-border"
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
            className="px-4 py-2.5 border border-border rounded-control bg-card text-foreground hover:border-foreground text-[11px] uppercase tracking-[0.14em] font-medium transition-colors"
          >
            Dossier
          </Link>
          <Link
            href={`/book/${tour.id}`}
            className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover rounded-control text-[11px] uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{t.nav?.bookNow || "Reserve"}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
