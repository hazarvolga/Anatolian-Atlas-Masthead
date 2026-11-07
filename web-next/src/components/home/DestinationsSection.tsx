"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDestinations } from "@/hooks/useDestinations";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80";

export default function DestinationsSection() {
  const { t } = useLanguage();
  const { data: destinations = [], isLoading } = useDestinations();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const safeDestinations = Array.isArray(destinations)
    ? destinations.slice(0, 6)
    : [];

  const activeDestination =
    safeDestinations[activeIndex] || safeDestinations[0] || null;

  return (
    <section className="section bg-background border-b border-border">
      <div className="container">
        {/* Section Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-border items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="editorial-kicker block">
              01 — REGIONAL INDEX & CARTOGRAPHY
            </span>
            <h2 className="font-serif text-foreground">
              {(t.home as Record<string, any>).featuredDestinations ||
                "Six Distinct Regions of Anatolia"}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-end lg:items-end gap-4">
            <p className="text-text-secondary text-sm md:text-base max-w-md lg:text-right">
              {(t.home as Record<string, any>).featuredDestinationsSubtitle ||
                "Select a region below to inspect its seasonal window, field focus, and scheduled small-group departures."}
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-primary hover:text-foreground transition-colors"
            >
              <span>
                {(t.home as Record<string, any>).viewAllDestinations ||
                  "Inspect All Six Regions"}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-b border-border">
            <div className="lg:col-span-5 divide-y divide-border border-r border-border">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-muted/40 animate-pulse" />
              ))}
            </div>
            <div className="lg:col-span-7 h-[520px] bg-muted/30 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-b border-border bg-card">
            {/* Left 5 Columns: Numbered Swiss Tabular Index */}
            <div
              className="lg:col-span-5 divide-y divide-border border-b lg:border-b-0 lg:border-r border-border"
              role="tablist"
              aria-label="Anatolian regional index"
            >
              {safeDestinations.map((dest: any, index: number) => {
                const isSelected = index === activeIndex;
                const indexLabel = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={dest.id}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    className={`group cursor-pointer p-5 sm:p-6 transition-colors duration-150 flex items-start justify-between gap-4 ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "bg-card hover:bg-background text-foreground"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.16em] tabular-nums ${
                          isSelected ? "text-[#D89A8B]" : "text-primary"
                        }`}
                      >
                        {indexLabel}
                      </span>
                      <div>
                        <h3
                          className={`font-serif text-xl sm:text-2xl leading-tight ${
                            isSelected ? "text-background" : "text-foreground"
                          }`}
                        >
                          {dest.name}
                        </h3>
                        <div
                          className={`mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.13em] tabular-nums ${
                            isSelected
                              ? "text-background/70"
                              : "text-text-secondary"
                          }`}
                        >
                          <span>{dest.city || dest.region || "Anatolia"}</span>
                          {dest.best_time && (
                            <>
                              <span>·</span>
                              <span>Season: {dest.best_time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/destinations/${dest.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`shrink-0 p-2 border transition-colors ${
                        isSelected
                          ? "border-background/25 text-background hover:bg-primary hover:border-primary"
                          : "border-border text-text-secondary hover:border-foreground hover:text-foreground"
                      }`}
                      aria-label={`Open ${dest.name} dossier`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right 7 Columns: Dominant Active Region Monograph Plate */}
            {activeDestination && (
              <div className="lg:col-span-7 flex flex-col justify-between bg-background">
                <div>
                  {/* Plate Metadata Bar */}
                  <div className="px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.15em] text-text-secondary tabular-nums">
                    <span>
                      REGION DOSSIER{" "}
                      {String(activeIndex + 1).padStart(2, "0")} / 06 —{" "}
                      {activeDestination.city || "TÜRKİYE"}
                    </span>
                    <span className="text-primary font-semibold">
                      {activeDestination.best_time
                        ? `OPTIMAL WINDOW: ${activeDestination.best_time}`
                        : "SMALL-GROUP FIELD ACCESS"}
                    </span>
                  </div>

                  {/* Large Unrounded Monograph Plate */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-foreground border-b border-border">
                    <img
                      src={
                        activeDestination.image_url || DEFAULT_FALLBACK_IMAGE
                      }
                      alt={`${activeDestination.name} landscape in Türkiye`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#172D2B]/90 via-[#172D2B]/35 to-transparent p-6 sm:p-8">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#D89A8B] font-semibold block mb-1">
                        GEOGRAPHIC ARCHIVE
                      </span>
                      <h3 className="font-serif text-2xl sm:text-4xl text-background leading-tight">
                        {activeDestination.name}
                      </h3>
                    </div>
                  </div>

                  {/* Editorial Field Summary */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <p className="text-base sm:text-lg text-foreground/90 leading-relaxed max-w-[64ch]">
                      {activeDestination.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Ledger */}
                <div className="px-6 sm:px-8 py-5 border-t border-border bg-card flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-text-secondary">
                    <span className="uppercase tracking-[0.14em] text-[10px] block text-text-tertiary">
                      FIELD DISPATCH
                    </span>
                    <span className="font-medium text-foreground">
                      Historian-led routes & private charters available
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/tours?destination=${activeDestination.id}`}
                      className="btn-outline py-3 px-5"
                    >
                      Routes in {activeDestination.city || activeDestination.name.split("&")[0]}
                    </Link>
                    <Link
                      href={`/destinations/${activeDestination.id}`}
                      className="btn-primary py-3 px-5"
                    >
                      <span>Read Full Dossier</span>
                      <ArrowUpRight className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
