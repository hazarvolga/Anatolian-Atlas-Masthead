"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useDestinations } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import TourCard from "@/components/TourCard";
import { DEFAULT_DEMO_HERO_IMAGE } from "@/lib/data/demo-images";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export default function DestinationDetailClient({ id }: { id: string }) {
  const { concept, config } = useDesignSystem();
  const { data: destinations = [], isLoading: destinationsLoading } =
    useDestinations();
  const { data: tours = [], isLoading: toursLoading } = useTours();

  if (destinationsLoading || toursLoading) {
    return (
      <main className="pt-28 pb-24 bg-background min-h-screen">
        <div className="container">
          <div className="h-[460px] bg-muted/40 animate-pulse border border-border" />
        </div>
      </main>
    );
  }

  const destination = destinations.find((dest: any) => dest.id === id);

  if (!destination) {
    return (
      <main className="pt-28 pb-24 bg-background min-h-screen">
        <div className="container">
          <div className="border border-border bg-card p-12 text-center space-y-4 max-w-xl mx-auto">
            <span className="editorial-kicker block">REGION NOT FOUND</span>
            <h1 className="font-serif text-3xl text-foreground">
              Regional Dossier Unavailable
            </h1>
            <Link href="/destinations" className="btn-outline inline-flex mt-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Regional Index
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const destKeyword = (destination.name || "")
    .split(/[&\s]/)[0]
    .toLowerCase()
    .replace("i̇", "i");

  const destinationTours = tours.filter((tour: any) => {
    if (tour.destination_id === destination.id) return true;
    const tourLoc = `${tour.location || ""} ${tour.name || ""} ${tour.destination_name || ""}`
      .toLowerCase()
      .replace("i̇", "i");
    return destKeyword.length >= 3 && tourLoc.includes(destKeyword);
  });

  const galleryImages = Array.isArray(destination.gallery_images)
    ? destination.gallery_images
    : [];

  const extraInfo =
    typeof destination.extra_info === "string" ? destination.extra_info : "";

  // ============================================================================
  // CONCEPT 2: AEGEAN LINEN — ASYMMETRIC OVERLAPPING COASTAL PANORAMA
  // ============================================================================
  if (concept.id === "aegean-linen") {
    return (
      <main
        data-testid="destination-detail-aegean"
        className="pt-24 pb-32 bg-background min-h-screen"
      >
        <div className="container mb-8">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Coastal & Regional Horizon</span>
          </Link>
        </div>

        {/* Asymmetric Full-Bleed Panorama + Overlapping Linen Sheet */}
        <section className="container mb-24">
          <div className="relative">
            <div className="lg:w-10/12 rounded-2xl overflow-hidden shadow-lg aspect-[16/9] relative bg-muted">
              <Image
                src={destination.image_url || DEFAULT_DEMO_HERO_IMAGE}
                alt={destination.name}
                width={1400}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 85vw"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative lg:-mt-32 lg:ml-auto lg:w-7/12 rounded-2xl bg-card/95 backdrop-blur-md border border-border/60 shadow-lg p-8 sm:p-12 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium block">
                {concept.voice.eyebrowPrefix} · {destination.city || "Türkiye"}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.06] font-normal">
                {destination.name}
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {destination.description}
              </p>
              <div className="flex flex-wrap gap-6 pt-4 border-t border-border/60 text-xs text-text-secondary">
                {destination.best_time && (
                  <div>
                    <span className="uppercase tracking-[0.16em] text-[10px] text-primary block mb-1">
                      Season
                    </span>
                    <span className="text-foreground font-medium">
                      {destination.best_time}
                    </span>
                  </div>
                )}
                {destination.activities && (
                  <div>
                    <span className="uppercase tracking-[0.16em] text-[10px] text-primary block mb-1">
                      Atmosphere
                    </span>
                    <span className="text-foreground font-medium">
                      {destination.activities}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="tours-section" className="container">
          <div className="mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary block">
              Slow Itineraries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
              Journeys Across {destination.name}
            </h2>
          </div>
          <div className="space-y-10">
            {destinationTours.map((tour: any, idx: number) => (
              <TourCard
                key={tour.id}
                tour={tour}
                indexNumber={idx + 1}
                variant="landscape-row"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ============================================================================
  // CONCEPT 3: OTTOMAN NOIR — CENTERED SYMMETRICAL SALON MONUMENT
  // ============================================================================
  if (concept.id === "ottoman-noir") {
    return (
      <main
        data-testid="destination-detail-noir"
        className="pt-20 pb-28 bg-background min-h-screen"
      >
        <section className="relative border-b border-primary/30 py-16 md:py-24 overflow-hidden">
          <div className="container max-w-5xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.28em] text-primary">
              <span className="h-px w-10 bg-primary/50" />
              <span>
                {concept.voice.eyebrowPrefix} · {(destination.city || "ANATOLIA").toUpperCase()}
              </span>
              <span className="h-px w-10 bg-primary/50" />
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-foreground tracking-tight leading-[1.03]">
              {destination.name}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {destination.description}
            </p>

            {/* Framed Centerpiece Portrait Plate */}
            <div className="relative max-w-4xl mx-auto p-3 border border-primary/40 bg-card">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={destination.image_url || DEFAULT_DEMO_HERO_IMAGE}
                  alt={destination.name}
                  width={1200}
                  height={675}
                  priority
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4 border-t border-primary/25 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary block mb-1">
                  I · OPTIMAL SEASON
                </span>
                <span className="text-foreground">
                  {destination.best_time || "Year-Round Private Access"}
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary block mb-1">
                  II · CURATORIAL FOCUS
                </span>
                <span className="text-foreground">
                  {destination.activities || "Architectural & Private Collections"}
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary block mb-1">
                  III · COMMISSIONS
                </span>
                <span className="text-foreground">
                  {destinationTours.length} Private Departures
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="tours-section" className="container pt-16 md:pt-24">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary block">
              PRIVATE SALON COMMISSIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              Curated Journeys in {destination.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationTours.map((tour: any, idx: number) => (
              <TourCard
                key={tour.id}
                tour={tour}
                indexNumber={idx + 1}
                variant="full-bleed-minimal"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ============================================================================
  // CONCEPT 1: ATLAS EDITORIAL — 12-COLUMN SWISS MONOGRAPH & LEDGER
  // ============================================================================
  return (
    <main
      data-testid="destination-detail-atlas"
      className="pt-20 pb-24 bg-background min-h-screen"
    >
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-border bg-card">
        <div className="container py-3 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-text-secondary tabular-nums">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO REGIONAL INDEX</span>
          </Link>
          <span>
            REGIONAL MONOGRAPH · {(destination.city || "TÜRKİYE").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Split Editorial Region Monograph */}
      <section className="border-b border-border bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-border bg-card">
            {/* Left 6 Columns: Monograph Plate & Archival Strip */}
            <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between bg-foreground text-background">
              <div className="px-6 py-3.5 border-b border-background/15 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-background/70 tabular-nums">
                <span>PRIMARY GEOGRAPHIC PLATE</span>
                <span>{destination.city || "ANATOLIA"}</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
                <Image
                  src={destination.image_url || DEFAULT_DEMO_HERO_IMAGE}
                  alt={destination.name}
                  width={1200}
                  height={900}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-full object-cover"
                />
              </div>
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-3 divide-x divide-background/15 border-t border-background/15">
                  {galleryImages.slice(0, 3).map((url: string, i: number) => (
                    <Image
                      key={url + i}
                      src={url}
                      alt={`${destination.name} archive ${i + 1}`}
                      width={400}
                      height={240}
                      sizes="(max-width: 1024px) 33vw, 17vw"
                      className="w-full h-24 object-cover bg-foreground"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right 6 Columns: Editorial Dossier */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-14 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <span className="editorial-kicker block">
                  REGIONAL DOSSIER — {destination.city || destination.name}
                </span>

                <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.02]">
                  {destination.name}
                </h1>

                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  {destination.description ||
                    "Explore the historical strata, architecture, and landscapes of this region in Türkiye."}
                </p>

                <dl className="divide-y divide-border border-y border-border text-xs tabular-nums">
                  {destination.best_time && (
                    <div className="py-3.5 grid grid-cols-12 gap-4">
                      <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                        OPTIMAL SEASON
                      </dt>
                      <dd className="col-span-7 text-foreground font-medium">
                        {destination.best_time}
                      </dd>
                    </div>
                  )}
                  {destination.activities && (
                    <div className="py-3.5 grid grid-cols-12 gap-4">
                      <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                        FIELD FOCUS
                      </dt>
                      <dd className="col-span-7 text-foreground font-medium">
                        {destination.activities}
                      </dd>
                    </div>
                  )}
                  <div className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                      ACTIVE ROUTES
                    </dt>
                    <dd className="col-span-7 text-foreground font-medium">
                      {destinationTours.length} Scheduled Itineraries
                    </dd>
                  </div>
                </dl>

                {extraInfo && (
                  <div className="p-4 bg-background border-l-2 border-primary text-xs text-text-secondary leading-relaxed">
                    <strong className="text-foreground block mb-1 uppercase tracking-[0.14em]">
                      CURATORIAL FIELD NOTE
                    </strong>
                    {extraInfo}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/destinations" className="btn-outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All Regions
                </Link>
                <a href="#tours-section" className="btn-primary">
                  <span>Inspect Regional Journeys</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Journeys Section */}
      <section id="tours-section" className="container pt-16 md:pt-24">
        <div className="pb-10 border-b border-border mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="editorial-kicker block">
              SCHEDULED REGIONAL EXPEDITIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              Journeys in {destination.name}
            </h2>
          </div>
          <Link
            href="/tours"
            className="text-xs uppercase tracking-[0.15em] text-primary font-semibold hover:text-foreground"
          >
            View Complete Route Catalogue →
          </Link>
        </div>

        {destinationTours.length === 0 ? (
          <div className="p-12 bg-card border border-border text-center space-y-4">
            <p className="text-text-secondary">
              No scheduled departures are listed for this region yet.
            </p>
            <Link href="/tours" className="btn-outline inline-flex">
              Browse All Journeys
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {destinationTours.map((tour: any, idx: number) => (
              <TourCard
                key={tour.id}
                tour={tour}
                indexNumber={idx + 1}
                variant={config.layout.tourCard}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
