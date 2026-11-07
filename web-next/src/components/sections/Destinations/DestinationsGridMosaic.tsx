"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoordTag } from "@/components/ui/coord-tag";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Destination } from "@/hooks/useDestinations";
import { DEMO_DESTINATIONS } from "@/lib/data/demo-content";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export default function DestinationsGridMosaic({
  initialDestinations,
}: {
  initialDestinations?: Destination[];
}) {
  const { t } = useLanguage();
  const regions =
    Array.isArray(initialDestinations) && initialDestinations.length > 0
      ? initialDestinations.slice(0, 6)
      : DEMO_DESTINATIONS.slice(0, 6);

  return (
    <section className="section bg-background border-b border-border">
      <div className="container space-y-12">
        {/* Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-border items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="editorial-kicker block">
              01 — REGIONAL MOSAIC ARCHIVE
            </span>
            <h2 className="font-serif text-foreground">
              {((t.home as Record<string, unknown>)?.featuredDestinations as string) ||
                "Six Distinct Regions of Anatolia"}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-end lg:items-end gap-4">
            <p className="text-text-secondary text-sm md:text-base max-w-md lg:text-right">
              Asymmetric regional plates with geographic coordinates, seasonal windows, and historian-led field dispatches.
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-primary hover:text-foreground transition-colors"
            >
              <span>Inspect All Six Regions</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Asymmetric 12-Column Mosaic (Alternating 7/5 and 5/7 Plates) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {regions.map((dest, idx) => {
            // Pattern: row 0 -> 7/5, row 1 -> 5/7, row 2 -> 7/5
            const row = Math.floor(idx / 2);
            const isLeftInRow = idx % 2 === 0;
            const isWide =
              (row % 2 === 0 && isLeftInRow) ||
              (row % 2 === 1 && !isLeftInRow);

            return (
              <article
                key={dest.id}
                className={`${
                  isWide ? "lg:col-span-7" : "lg:col-span-5"
                } group bg-card border border-border rounded-card overflow-hidden flex flex-col justify-between hover:border-foreground transition-colors`}
              >
                <Link
                  href={`/destinations/${dest.id}`}
                  className="relative aspect-[16/10] overflow-hidden bg-foreground border-b border-border block"
                >
                  <img
                    src={
                      dest.image_url ||
                      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <CoordTag
                      plate={`PLATE ${ROMAN_NUMERALS[idx] || idx + 1}`}
                      coordinates={dest.coords || "38.64° N, 34.82° E"}
                    />
                  </div>
                </Link>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.13em] text-text-secondary">
                      <span>{dest.city || "Anatolia"}, Türkiye</span>
                      <span className="text-primary">
                        {dest.best_time || "APR – NOV"}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/destinations/${dest.id}`}>{dest.name}</Link>
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="editorial-meta">
                      {dest._count?.tours || 2} Scheduled Routes
                    </span>
                    <Link
                      href={`/destinations/${dest.id}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-semibold text-foreground group-hover:text-primary transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
