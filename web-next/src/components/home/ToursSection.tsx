"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TourCard from "@/components/TourCard";
import { useTours } from "@/hooks/useTours";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { ErrorState } from "@/components/ui/error-state";
import { formatPrice } from "@/config/site";
import type { DemoTour } from "@/lib/data/demo-content";
import { DEFAULT_DEMO_TOUR_IMAGE } from "@/lib/data/demo-images";

export default function ToursSection({
  initialTours,
}: {
  initialTours?: DemoTour[];
} = {}) {
  const { t } = useLanguage();
  const { config } = useDesignSystem();
  const { data: fetchedTours, isLoading: queryLoading, error } = useTours();

  const tours =
    Array.isArray(fetchedTours) && fetchedTours.length > 0
      ? fetchedTours
      : initialTours || [];
  const isLoading = tours.length === 0 && queryLoading;

  const safeTours = Array.isArray(tours) ? tours.slice(0, 5) : [];
  const leadTour = safeTours[0] || null;
  const catalogueTours = safeTours.slice(1, 5);
  const isStackedVariant =
    config.layout.tourCard === "landscape-row" ||
    config.layout.tourCard === "minimal-list";

  return (
    <section className="section bg-background border-b border-border">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-border items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="editorial-kicker block">
              02 — CURATED FIELD ITINERARIES
            </span>
            <h2 className="font-serif text-foreground">
              {t.home.featuredTours}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-end lg:items-end gap-4">
            <p className="text-text-secondary text-sm md:text-base max-w-md lg:text-right">
              {t.home.featuredToursSubtitle}
            </p>
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-primary hover:text-foreground transition-colors"
            >
              <span>{t.home.booking.viewTours}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-8 pt-10">
            <div className="h-[460px] bg-muted/40 animate-pulse border border-border" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[420px] bg-muted/40 animate-pulse border border-border" />
              <div className="h-[420px] bg-muted/40 animate-pulse border border-border" />
            </div>
          </div>
        ) : error || safeTours.length === 0 ? (
          <div className="pt-8">
            <ErrorState
              code="HTTP 503 — CATALOGUE GATEWAY UNAVAILABLE"
              title="Live expedition catalogue temporarily unreachable"
              description="Our reservation ledger did not respond within the expected window. In live mode, demo fallback tours are suppressed."
            />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Lead Expedition Feature — 40% Deep Bosphorus Ink Tonal Mass */}
            {leadTour && (
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-foreground text-background border-x border-b border-border">
                <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] overflow-hidden border-b lg:border-b-0 lg:border-r border-background/15">
                  <Image
                    src={leadTour.image_url || DEFAULT_DEMO_TOUR_IMAGE}
                    alt={leadTour.name}
                    width={1200}
                    height={800}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold">
                    01 / FLAGSHIP EXPEDITION
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-background/70 border-b border-background/15 pb-3 tabular-nums">
                      <span>
                        {leadTour.destinations?.city ||
                          leadTour.location ||
                          "Anatolia"}
                      </span>
                      <span>
                        MAX {leadTour.max_group_size || 10} GUESTS ·{" "}
                        {(leadTour.difficulty || "MODERATE").toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl text-background leading-tight">
                      {leadTour.name}
                    </h3>

                    <p className="text-sm sm:text-base text-background/80 leading-relaxed">
                      {leadTour.description}
                    </p>

                    {Array.isArray(leadTour.highlights) &&
                      leadTour.highlights.length > 0 && (
                        <div className="pt-3 space-y-2">
                          <span className="block text-[10px] uppercase tracking-[0.16em] text-primary-subtle font-semibold">
                            KEY FIELD STOPS
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-background/85">
                            {leadTour.highlights
                              .slice(0, 4)
                              .map((stop: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-baseline gap-2"
                                >
                                  <span className="text-primary-subtle font-mono text-[10px]">
                                    0{idx + 1}
                                  </span>
                                  <span>{stop}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  <div className="pt-6 border-t border-background/15 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-background/60">
                        ALL-INCLUSIVE TARIFF / GUEST
                      </span>
                      <span className="font-serif text-3xl text-background tabular-nums">
                        {formatPrice(leadTour.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/tours/${leadTour.id}`}
                        className="px-5 py-3.5 border border-background/30 text-background hover:bg-background hover:text-foreground text-xs uppercase tracking-[0.14em] font-medium transition-colors"
                      >
                        Read Route
                      </Link>
                      <Link
                        href={`/book/${leadTour.id}`}
                        className="btn-primary py-3.5 px-6"
                      >
                        <span>Reserve</span>
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Variant-Aware Catalogue Grid (2-Col Portrait 4:5 vs Stacked Landscape/Minimal Rows) */}
            {catalogueTours.length > 0 && (
              <div
                className={
                  isStackedVariant
                    ? "flex flex-col gap-6"
                    : "grid grid-cols-1 lg:grid-cols-2 gap-8"
                }
              >
                {catalogueTours.map((tour: any, idx: number) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    indexNumber={idx + 2}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
