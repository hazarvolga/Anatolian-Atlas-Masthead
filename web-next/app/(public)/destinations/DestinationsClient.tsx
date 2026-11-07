"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useDestinations, type Destination } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import { formatPrice } from "@/config/site";
import type { DemoTour } from "@/lib/data/demo-content";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85";

export default function DestinationsClient({
  initialDestinations,
  initialTours,
}: {
  initialDestinations?: Destination[];
  initialTours?: DemoTour[];
} = {}) {
  const { data: fetchedDestinations, isLoading: queryLoading } =
    useDestinations();
  const { data: fetchedTours } = useTours();

  const safeDestinations =
    Array.isArray(fetchedDestinations) && fetchedDestinations.length > 0
      ? fetchedDestinations
      : initialDestinations || [];
  const safeTours =
    Array.isArray(fetchedTours) && fetchedTours.length > 0
      ? fetchedTours
      : initialTours || [];
  const destinationsLoading = safeDestinations.length === 0 && queryLoading;

  return (
    <main className="pt-20 bg-background min-h-screen">
      {/* Top Issue Header */}
      <section className="border-b border-border bg-card">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="editorial-kicker block">
                02 — REGIONAL MONOGRAPHS & GEOGRAPHIC ARCHIVE
              </span>
              <h1 className="font-serif text-foreground">
                Six Distinct Regions of Anatolia
              </h1>
            </div>
            <div className="lg:col-span-4 space-y-4 lg:text-right">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                From the maritime corridors of the Bosphorus and Lycia to the volcanic tufa valleys of Cappadocia and the limestone ridges of Upper Mesopotamia.
              </p>
              <div className="text-[11px] uppercase tracking-[0.16em] text-primary font-semibold tabular-nums">
                {safeDestinations.length} ACTIVE FIELD REGIONS · HISTORIAN-LED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Monograph Spreads */}
      <section className="py-16 md:py-24">
        <div className="container space-y-20">
          {destinationsLoading ? (
            <div className="space-y-12">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[460px] border border-border bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : (
            safeDestinations.map((dest: any, idx: number) => {
              const indexStr = String(idx + 1).padStart(2, "0");
              const isReversed = idx % 2 === 1;
              const isDarkAccent = idx === 1 || idx === 4;

              const regionalTours = safeTours.filter(
                (t: any) =>
                  t.destination_id === dest.id ||
                  t.destinations?.id === dest.id ||
                  (dest.city &&
                    t.location
                      ?.toLowerCase()
                      .includes(dest.city.toLowerCase()))
              );

              return (
                <article
                  key={dest.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 border border-border ${
                    isDarkAccent
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground"
                  }`}
                >
                  {/* Photographic Plate Column (7 cols) */}
                  <div
                    className={`lg:col-span-7 relative min-h-[340px] lg:min-h-[480px] overflow-hidden border-b lg:border-b-0 ${
                      isReversed
                        ? "lg:order-2 lg:border-l"
                        : "lg:order-1 lg:border-r"
                    } ${
                      isDarkAccent ? "border-background/15" : "border-border"
                    }`}
                  >
                    <img
                      src={dest.image_url || DEFAULT_FALLBACK_IMAGE}
                      alt={`${dest.name} — ${dest.city || "Türkiye"}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6 bg-background/95 text-foreground px-3.5 py-1.5 border border-border text-[10px] uppercase tracking-[0.18em] font-semibold tabular-nums">
                      REGION {indexStr} / {dest.city || "ANATOLIA"}
                    </div>
                  </div>

                  {/* Editorial Dossier Column (5 cols) */}
                  <div
                    className={`lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="space-y-5">
                      <div
                        className={`flex items-center justify-between text-[11px] uppercase tracking-[0.16em] pb-3 border-b tabular-nums ${
                          isDarkAccent
                            ? "border-background/15 text-background/70"
                            : "border-border text-text-secondary"
                        }`}
                      >
                        <span>DOSSIER NO. {indexStr}</span>
                        <span>
                          {dest.best_time
                            ? `SEASON: ${dest.best_time}`
                            : "YEAR-ROUND DISPATCH"}
                        </span>
                      </div>

                      <h2
                        className={`font-serif text-3xl sm:text-4xl leading-tight ${
                          isDarkAccent ? "text-background" : "text-foreground"
                        }`}
                      >
                        {dest.name}
                      </h2>

                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isDarkAccent
                            ? "text-background/80"
                            : "text-text-secondary"
                        }`}
                      >
                        {dest.description}
                      </p>

                      {/* Linked Regional Journeys */}
                      {regionalTours.length > 0 && (
                        <div
                          className={`pt-4 border-t space-y-2.5 ${
                            isDarkAccent
                              ? "border-background/15"
                              : "border-border"
                          }`}
                        >
                          <span
                            className={`block text-[10px] uppercase tracking-[0.16em] font-semibold ${
                              isDarkAccent ? "text-primary-subtle" : "text-primary"
                            }`}
                          >
                            SCHEDULED EXPEDITIONS IN THIS REGION
                          </span>
                          <div className="space-y-2">
                            {regionalTours.slice(0, 2).map((rt: any) => (
                              <Link
                                key={rt.id}
                                href={`/tours/${rt.id}`}
                                className={`flex items-center justify-between p-3 border text-xs transition-colors ${
                                  isDarkAccent
                                    ? "border-background/20 hover:bg-background/10 text-background"
                                    : "border-border bg-background hover:border-foreground text-foreground"
                                }`}
                              >
                                <span className="font-serif text-base truncate pr-3">
                                  {rt.name}
                                </span>
                                <span className="font-mono text-xs tabular-nums shrink-0">
                                  {formatPrice(rt.price)}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 ${
                        isDarkAccent ? "border-background/15" : "border-border"
                      }`}
                    >
                      <Link
                        href={`/tours?destination=${dest.id}`}
                        className={`text-xs uppercase tracking-[0.15em] font-semibold underline underline-offset-4 ${
                          isDarkAccent
                            ? "text-primary-subtle hover:text-background"
                            : "text-primary hover:text-foreground"
                        }`}
                      >
                        Filter Regional Routes
                      </Link>

                      <Link
                        href={`/destinations/${dest.id}`}
                        className="btn-primary py-3 px-6"
                      >
                        <span>Open Monograph</span>
                        <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
