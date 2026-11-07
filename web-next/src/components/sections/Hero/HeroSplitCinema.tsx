"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoordTag } from "@/components/ui/coord-tag";
import { SplitTextHeading, MagneticCTA } from "@/components/motion";
import { isDemoMode } from "@/config/site";
import type { Destination } from "@/hooks/useDestinations";
import type { DemoTour } from "@/lib/data/demo-content";
import { DEMO_DESTINATIONS, DEMO_TOURS } from "@/lib/data/demo-content";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export default function HeroSplitCinema({
  initialDestinations,
  initialTours,
}: {
  initialDestinations?: Destination[];
  initialTours?: DemoTour[];
}) {
  const { t } = useLanguage();
  const regions =
    Array.isArray(initialDestinations) && initialDestinations.length > 0
      ? initialDestinations.slice(0, 6)
      : isDemoMode()
        ? DEMO_DESTINATIONS.slice(0, 6)
        : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeRegion = regions[activeIndex] || regions[0];

  const availableTours =
    Array.isArray(initialTours) && initialTours.length > 0
      ? initialTours
      : isDemoMode()
        ? DEMO_TOURS
        : [];

  const matchingTour =
    availableTours.find(
      (tr) =>
        tr.destination_id === activeRegion?.id ||
        tr.city?.toLowerCase() === activeRegion?.city?.toLowerCase()
    ) || availableTours[0];

  return (
    <section className="relative pt-16 md:pt-20 bg-background border-b border-border">
      {/* Top Cartographic Telemetry Bar */}
      <div className="border-b border-border bg-surface-container/60">
        <div className="container py-2.5 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-text-secondary tabular-nums">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-primary" />
            <span className="font-semibold text-foreground">
              SPLIT-CINEMA DISPATCH — ANATOLIAN REGIONAL ATLAS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[11px]">
            <span>PLATE {ROMAN_NUMERALS[activeIndex] || "I"} OF VI</span>
            <span className="text-border">|</span>
            <span>{activeRegion?.coords || "41.0082° N, 28.9784° E"}</span>
            <span className="text-border">|</span>
            <span className="text-primary font-medium">
              {activeRegion?.best_time || "APR – NOV"}
            </span>
          </div>
        </div>
      </div>

      {/* 5/7 Asymmetric Split-Cinema Grid */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-border min-h-[680px]">
          {/* Left 5 Columns: Architectural Dossier Rail & Region Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-card border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <span className="editorial-kicker">
                  PLATE {ROMAN_NUMERALS[activeIndex] || "I"} / FIELD DOSSIER
                </span>
                <CoordTag
                  coordinates={activeRegion?.coords || "41.0082° N, 28.9784° E"}
                  elevation={activeRegion?.city?.toUpperCase() || "ANATOLIA"}
                />
              </div>

              <SplitTextHeading
                as="h1"
                text={activeRegion?.name || t.hero.title}
                className="font-serif text-fluid-3xl lg:text-fluid-4xl text-foreground leading-[0.98] tracking-[-0.03em]"
              />

              {/* Answer-First Regional Summary */}
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed border-l-2 border-primary pl-4">
                {activeRegion?.description || t.hero.description}
              </p>

              {/* Key Field Focus */}
              {activeRegion?.activities && (
                <div className="pt-2 space-y-1.5">
                  <span className="editorial-meta block">
                    Curatorial Focus & Field Notes
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    {activeRegion.activities}
                  </p>
                </div>
              )}
            </div>

            {/* Interactive 6-Region Index Rail */}
            <div className="pt-8 space-y-5">
              <div className="border-t border-border pt-4">
                <span className="editorial-meta block mb-3">
                  Select Regional Plate (01 — 06)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {regions.map((reg, idx) => {
                    const selected = idx === activeIndex;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`text-left px-3 py-2.5 border rounded-control transition-colors flex items-center justify-between ${
                          selected
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        <span className="text-xs font-medium truncate pr-2">
                          {reg.city || reg.name.split("&")[0]}
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            selected ? "text-primary-subtle" : "text-primary"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <MagneticCTA className="flex-1">
                  <Link
                    href={`/destinations/${activeRegion?.id || "dest-istanbul"}`}
                    className="btn-primary w-full"
                  >
                    <span>Open Region Dossier</span>
                    <ArrowUpRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </MagneticCTA>
                <Link href="/tours" className="btn-outline">
                  All Routes
                </Link>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Full-Height Cinema Viewport */}
          <div className="lg:col-span-7 relative min-h-[460px] lg:min-h-[680px] bg-black text-white flex flex-col justify-between overflow-hidden">
            <img
              src={
                activeRegion?.image_url ||
                "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85"
              }
              alt={`${activeRegion?.name} — ${activeRegion?.city}, Türkiye`}
              width={1400}
              height={960}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-700"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35"
              aria-hidden="true"
            />

            {/* Top Cinema Frame Overlay */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-white/15 text-[11px] font-mono uppercase tracking-[0.14em] text-white/85">
              <span>
                ARCHIVAL PLATE {ROMAN_NUMERALS[activeIndex] || "I"} ·{" "}
                {activeRegion?.city || "İSTANBUL"}
              </span>
              <span>SEASON: {activeRegion?.best_time || "APR – NOV"}</span>
            </div>

            {/* Bottom Cinema Frame Dispatch Card */}
            <div className="relative z-10 p-6 sm:p-10 space-y-4">
              {matchingTour && (
                <div className="border border-white/20 bg-black/75 backdrop-blur-md p-5 sm:p-6 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 block">
                      FEATURED REGIONAL ROUTE · MAX{" "}
                      {matchingTour.max_group_size || 10} GUESTS
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-white">
                      {matchingTour.name}
                    </h2>
                  </div>
                  <Link
                    href={`/tours/${matchingTour.id}`}
                    className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary-hover rounded-control text-[11px] uppercase tracking-[0.14em] font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>Inspect Route</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
