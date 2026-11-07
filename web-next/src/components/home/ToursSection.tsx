"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import TourCard from "@/components/TourCard";
import { useTours } from "@/hooks/useTours";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/config/site";

export default function ToursSection() {
  const { t } = useLanguage();
  const { data: tours, isLoading, error } = useTours();

  const safeTours = Array.isArray(tours) ? tours.slice(0, 5) : [];
  const leadTour = safeTours[0] || null;
  const catalogueTours = safeTours.slice(1, 5);

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
        ) : error ? (
          <div className="p-10 border-x border-b border-border bg-card text-center">
            <p className="text-text-secondary">
              Unable to load field itineraries at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Lead Expedition Feature — 40% Deep Bosphorus Ink Tonal Mass */}
            {leadTour && (
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-foreground text-background border-x border-b border-border">
                <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] overflow-hidden border-b lg:border-b-0 lg:border-r border-background/15">
                  <img
                    src={
                      leadTour.image_url ||
                      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=85"
                    }
                    alt={leadTour.name}
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
                          <span className="block text-[10px] uppercase tracking-[0.16em] text-[#D89A8B] font-semibold">
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
                                  <span className="text-[#D89A8B] font-mono text-[10px]">
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

            {/* 2-Column Asymmetric Catalogue Grid (Never 3-Card Repetition) */}
            {catalogueTours.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
