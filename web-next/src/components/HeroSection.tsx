"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDestinations } from "@/hooks/useDestinations";

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: destinations = [] } = useDestinations();

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPace, setSelectedPace] = useState<string>("all");

  const safeDestinations = Array.isArray(destinations) ? destinations : [];

  const handleDiscoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedRegion !== "all") {
      params.set("destination", selectedRegion);
    }
    if (selectedPace !== "all") {
      params.set("difficulty", selectedPace);
    }
    const queryString = params.toString();
    router.push(queryString ? `/tours?${queryString}` : "/tours");
  };

  return (
    <section className="relative pt-16 md:pt-20 bg-background border-b border-border">
      {/* Top Issue / Monograph Metadata Strip */}
      <div className="border-b border-border bg-card/60">
        <div className="container py-2.5 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-text-secondary tabular-nums">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-primary" />
            <span className="font-semibold text-foreground">
              ISSUE 04 — ANATOLIAN GEOGRAPHIC & CULTURAL ARCHIVE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>DISPATCH: GALATA, İSTANBUL</span>
            <span className="text-border">|</span>
            <span>6 REGIONS · SMALL-GROUP & PRIVATE</span>
            <span className="text-border">|</span>
            <span className="text-primary font-semibold">AUTUMN / SPRING EDITION</span>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Editorial Composition ("Leke": ~58% Paper Field / ~42% Dark Ink & Photographic Plate) */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-border">
          {/* Left Column (7 cols): Monumental Display Typography & Route Ledger */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="editorial-kicker">
                  00 / FIELD MONOGRAPH — {t.hero.subtitle}
                </span>
                <span className="editorial-meta hidden sm:inline">
                  EST. İSTANBUL
                </span>
              </div>

              <h1 className="font-serif text-foreground tracking-[-0.035em] leading-[0.95]">
                {t.hero.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                <div className="md:col-span-4 border-l-2 border-primary pl-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-foreground font-semibold mb-1">
                    Curatorial Premise
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Paced archaeological, culinary, and coastal itineraries led by regional historians. Max 12 guests.
                  </p>
                </div>
                <div className="md:col-span-8">
                  <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                    {t.hero.description}
                  </p>
                </div>
              </div>

              {/* Editorial Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/tours" className="btn-primary">
                  <span>{t.hero.bookStay}</span>
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
                <Link href="/destinations" className="btn-outline">
                  <span>{t.hero.exploreApartments}</span>
                </Link>
              </div>
            </div>

            {/* Flush Architectural Route Index Filter */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
                  ROUTE INDEX & EXPEDITION FILTER
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-primary tabular-nums">
                  DIRECT DISPATCH
                </span>
              </div>

              <form
                onSubmit={handleDiscoverySubmit}
                className="grid grid-cols-1 sm:grid-cols-12 border border-border bg-card"
                aria-label="Filter journeys by region and walking pace"
              >
                <div className="sm:col-span-5 p-3.5 border-b sm:border-b-0 sm:border-r border-border">
                  <label
                    htmlFor="hero-region-select"
                    className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary mb-1"
                  >
                    01 / Geographic Region
                  </label>
                  <select
                    id="hero-region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-transparent text-foreground font-serif text-base focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Six Regions of Türkiye</option>
                    {safeDestinations.map((dest: any) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4 p-3.5 border-b sm:border-b-0 sm:border-r border-border">
                  <label
                    htmlFor="hero-pace-select"
                    className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary mb-1"
                  >
                    02 / Terrain & Pace
                  </label>
                  <select
                    id="hero-pace-select"
                    value={selectedPace}
                    onChange={(e) => setSelectedPace(e.target.value)}
                    className="w-full bg-transparent text-foreground font-serif text-base focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Walking Paces</option>
                    <option value="easy">Easy — Urban & Maritime</option>
                    <option value="moderate">Moderate — Valleys & Trails</option>
                    <option value="challenging">Challenging — High Ridges</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex">
                  <button
                    type="submit"
                    className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-4 text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Consult</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (5 cols): Dominant Dark Ink & Photographic Mass */}
          <div className="lg:col-span-5 bg-foreground text-background flex flex-col justify-between">
            {/* Top Plate Header inside Dark Mass */}
            <div className="px-6 py-4 border-b border-background/15 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-background/75 tabular-nums">
              <span>PLATE I — MARMARA & THE STRAITS</span>
              <span>ARCHIVE NO. NST-01</span>
            </div>

            {/* Tall Editorial Monograph Photograph */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground">
              <img
                src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85"
                alt="Morning ferry crossing the Bosphorus Strait toward Ortaköy in İstanbul, Türkiye"
                className="w-full h-full object-cover opacity-92 contrast-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 text-background">
                <span className="inline-block px-2.5 py-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.16em] font-semibold mb-3">
                  LEAD REGION — İSTANBUL
                </span>
                <p className="font-serif text-2xl md:text-3xl text-background leading-tight">
                  Dawn crossings between the imperial peninsula, Galata quays, and the Asian shore.
                </p>
              </div>
            </div>

            {/* Bottom Dark Ink Ledger Caption */}
            <div className="p-6 border-t border-background/15 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-background/60 mb-1">
                  SEASON WINDOW
                </span>
                <span className="font-medium text-background tabular-nums">
                  Apr – Jun · Sep – Nov
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-background/60 mb-1">
                  GROUP CEILING
                </span>
                <span className="font-medium text-background tabular-nums">
                  Max 10 – 12 Guests
                </span>
              </div>
              <div className="text-right">
                <Link
                  href="/destinations/dest-istanbul"
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary-subtle hover:text-background font-semibold mt-2"
                >
                  <span>Read Dossier</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
