"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Minus } from "lucide-react";
import { useTour } from "@/hooks/useTours";
import { formatPrice, siteConfig } from "@/config/site";

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

const DEFAULT_TOUR_IMAGE =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85";

function normaliseTour(raw: any) {
  if (!raw) return null;

  const destination = raw.destination || raw.destinations;
  const location = destination
    ? [destination.name, destination.city, destination.country]
        .filter(Boolean)
        .join(", ")
    : raw.location || "Anatolia, Türkiye";

  const highlights: string[] = Array.isArray(raw.includes)
    ? raw.includes
    : Array.isArray(raw.highlights)
      ? raw.highlights
      : [
          "Timed morning entry with licensed regional historian",
          "Small-group pacing capped at 10–12 guests",
          "Curated regional table & artisan studio visits",
        ];

  const included: string[] = Array.isArray(raw.included)
    ? raw.included
    : Array.isArray(raw.includes)
      ? raw.includes
      : [
          "Licensed archaeologist or architectural historian leadership",
          "All timed museum, monument & conservation site admissions",
          "Private climate-controlled ground or maritime transfers",
          "Curated regional lunches & archival route dossier",
        ];

  const excluded: string[] = Array.isArray(raw.excluded)
    ? raw.excluded
    : [
        "International airfare to/from Türkiye",
        "Personal travel insurance & discretionary gratuities",
      ];

  const rawItinerary = Array.isArray(raw.itinerary)
    ? (raw.itinerary as unknown as ItineraryItem[]).filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "day" in item &&
          "title" in item &&
          "description" in item
      )
    : [];

  const itinerary: ItineraryItem[] =
    rawItinerary.length > 0
      ? rawItinerary
      : highlights.slice(0, 4).map((hl, idx) => ({
          day: idx + 1,
          title: hl,
          description:
            idx === 0
              ? "Morning field assembly and early entry ahead of general coach arrivals, focusing on primary architectural context and spatial history."
              : idx === 1
                ? "Guided traversal through secondary quarters, inscriptions, and conservation zones with time for independent photography and field notes."
                : "Regional lunch at a long-standing neighborhood kitchen followed by afternoon seminar discussion and return dispatch.",
        }));

  return {
    ...raw,
    name: raw.title ?? raw.name,
    price:
      typeof raw.price_adult === "number"
        ? raw.price_adult
        : Number(raw.price) || 195,
    duration: raw.duration_hours ?? raw.duration ?? 8,
    max_group_size: raw.max_participants ?? raw.max_group_size ?? 12,
    image_url:
      (Array.isArray(raw.images) && raw.images[0]) ||
      raw.image_url ||
      DEFAULT_TOUR_IMAGE,
    highlights,
    included,
    excluded,
    itinerary,
    location,
  };
}

export default function TourDetailClient({
  id,
  initialTour,
}: {
  id: string;
  initialTour?: any;
}) {
  const { data: fetchedTour, isLoading: queryLoading, error } = useTour(id);
  const rawTour = fetchedTour || initialTour;
  const isLoading = !rawTour && queryLoading;
  const tour = normaliseTour(rawTour);

  if (isLoading) {
    return (
      <main className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container space-y-8">
          <div className="h-[440px] border border-border bg-muted/40 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 border border-border bg-muted/30 animate-pulse" />
            <div className="lg:col-span-4 h-96 border border-border bg-muted/30 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="container">
          <div className="border border-border bg-card p-12 text-center space-y-4 max-w-xl mx-auto">
            <span className="editorial-kicker block">DOSSIER UNAVAILABLE</span>
            <h1 className="font-serif text-3xl text-foreground">
              Expedition Dossier Not Found
            </h1>
            <p className="text-sm text-text-secondary">
              {error?.message ||
                "The requested itinerary is currently unavailable or archived."}
            </p>
            <Link href="/tours" className="btn-outline inline-flex mt-2">
              Return to Expedition Catalogue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const durationLabel =
    tour.tour_type === "multiple_day" && tour.duration >= 24
      ? `${Math.round(tour.duration / 24)} Days`
      : `${tour.duration} Hours`;

  const paceLabel = tour.difficulty
    ? tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)
    : "Moderate";

  return (
    <main className="pt-20 bg-background min-h-screen">
      {/* Top Breadcrumb & Dossier Strip */}
      <div className="border-b border-border bg-card">
        <div className="container py-3 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-text-secondary tabular-nums">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO EXPEDITION CATALOGUE</span>
          </Link>
          <span>
            EXPEDITION DOSSIER · {tour.location.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Split Monograph Masthead */}
      <section className="border-b border-border bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-border">
            {/* Left 7 Columns: Title, Overview & Tabular Specs */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between space-y-10">
              <div className="space-y-6">
                <span className="editorial-kicker block">
                  FIELD ITINERARY — {tour.location}
                </span>
                <h1 className="font-serif text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.98]">
                  {tour.name}
                </h1>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[62ch]">
                  {tour.description}
                </p>
              </div>

              {/* 4-Cell Tabular Specification Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-card text-xs tabular-nums">
                <div className="p-4">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
                    DURATION
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    {durationLabel}
                  </span>
                </div>
                <div className="p-4">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
                    GROUP CEILING
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    Max {tour.max_group_size} Guests
                  </span>
                </div>
                <div className="p-4">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
                    WALKING PACE
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    {paceLabel}
                  </span>
                </div>
                <div className="p-4">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-primary font-semibold mb-1">
                    TARIFF / GUEST
                  </span>
                  <span className="font-serif text-lg text-foreground">
                    {formatPrice(tour.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Dominant Route Plate */}
            <div className="lg:col-span-5 bg-foreground text-background flex flex-col justify-between">
              <div className="px-6 py-3.5 border-b border-background/15 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-background/70 tabular-nums">
                <span>PRIMARY ROUTE PLATE</span>
                <span>SCHOLAR-LED</span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-foreground">
                <img
                  src={tour.image_url}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 border-t border-background/15 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-background/60">
                    ASSEMBLY & DISPATCH
                  </span>
                  <span className="text-background font-medium">
                    {tour.departure_location || tour.location} ·{" "}
                    {tour.departure_time || "08:00 Morning Assembly"}
                  </span>
                </div>
                <Link href={`/book/${tour.id}`} className="btn-primary py-3 px-5">
                  <span>Reserve</span>
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 12-Column Monograph Content & Sticky Reservation Ledger */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 8 Columns: Route Sequence, Highlights & Inclusions */}
            <div className="lg:col-span-8 space-y-16">
              {/* 01 / Chronological Route Sequence */}
              <div className="space-y-6">
                <div className="border-b border-border pb-4 flex items-baseline justify-between">
                  <span className="editorial-kicker">
                    01 — CHRONOLOGICAL ROUTE SEQUENCE
                  </span>
                  <span className="editorial-meta">
                    {tour.itinerary.length} STAGES
                  </span>
                </div>

                <div className="border border-border divide-y divide-border bg-card">
                  {tour.itinerary.map((item: ItineraryItem, idx: number) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6"
                    >
                      <div className="sm:col-span-3">
                        <span className="inline-block px-2.5 py-1 bg-foreground text-background text-[11px] uppercase tracking-[0.16em] font-semibold tabular-nums">
                          {tour.tour_type === "one_day"
                            ? `STAGE 0${item.day || idx + 1}`
                            : `DAY 0${item.day || idx + 1}`}
                        </span>
                      </div>
                      <div className="sm:col-span-9 space-y-2">
                        <h3 className="font-serif text-2xl text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 02 / Key Archaeological & Cultural Stops */}
              {tour.highlights.length > 0 && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <span className="editorial-kicker">
                      02 — KEY ARCHAEOLOGICAL & CULTURAL STOPS
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-card">
                    <ul className="divide-y divide-border">
                      {tour.highlights
                        .slice(0, Math.ceil(tour.highlights.length / 2))
                        .map((hl: string, i: number) => (
                          <li
                            key={i}
                            className="p-5 flex items-baseline gap-3.5 text-sm text-foreground"
                          >
                            <span className="text-xs font-semibold text-primary tabular-nums">
                              0{i + 1}
                            </span>
                            <span>{hl}</span>
                          </li>
                        ))}
                    </ul>
                    <ul className="divide-y divide-border">
                      {tour.highlights
                        .slice(Math.ceil(tour.highlights.length / 2))
                        .map((hl: string, i: number) => {
                          const num =
                            Math.ceil(tour.highlights.length / 2) + i + 1;
                          return (
                            <li
                              key={i}
                              className="p-5 flex items-baseline gap-3.5 text-sm text-foreground"
                            >
                              <span className="text-xs font-semibold text-primary tabular-nums">
                                {String(num).padStart(2, "0")}
                              </span>
                              <span>{hl}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              )}

              {/* 03 / Tariff Inclusions & Exclusions */}
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <span className="editorial-kicker">
                    03 — EXPEDITION PROVISIONS & LOGISTICS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 border border-border divide-y md:divide-y-0 md:divide-x divide-border bg-card">
                  <div className="p-6 sm:p-8 space-y-4">
                    <h4 className="font-sans text-xs uppercase tracking-[0.16em] text-primary font-semibold">
                      INCLUDED IN EXPEDITION TARIFF
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground">
                      {tour.included.map((inc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 bg-background/40">
                    <h4 className="font-sans text-xs uppercase tracking-[0.16em] text-text-secondary font-semibold">
                      NOT INCLUDED
                    </h4>
                    <ul className="space-y-3 text-sm text-text-secondary">
                      {tour.excluded.map((exc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Minus className="h-4 w-4 text-text-tertiary shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Reservation Dossier */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 border border-border bg-card">
              <div className="p-6 sm:p-8 bg-foreground text-background space-y-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-primary-subtle font-semibold block">
                  RESERVATION LEDGER
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl tabular-nums">
                    {formatPrice(tour.price)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-background/70">
                    PER GUEST (EUR)
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <dl className="divide-y divide-border border-y border-border text-xs tabular-nums">
                  <div className="py-3 flex justify-between">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      DURATION
                    </dt>
                    <dd className="font-medium text-foreground">
                      {durationLabel}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      GROUP CEILING
                    </dt>
                    <dd className="font-medium text-foreground">
                      Max {tour.max_group_size} Guests
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      ASSEMBLY
                    </dt>
                    <dd className="font-medium text-foreground">
                      {tour.departure_time || "08:00"}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      PRIVATE CHARTER
                    </dt>
                    <dd className="font-medium text-primary">
                      Available on Request
                    </dd>
                  </div>
                </dl>

                <div className="space-y-3">
                  <Link
                    href={`/book/${tour.id}`}
                    className="btn-primary w-full py-4 text-center"
                  >
                    <span>Proceed to Reservation</span>
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-outline w-full py-3.5 text-center"
                  >
                    Request Private Charter
                  </Link>
                </div>

                <div className="pt-4 border-t border-border text-xs text-text-secondary space-y-1">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-foreground font-semibold">
                    DIRECT GALATA DESK
                  </span>
                  <p className="tabular-nums">{siteConfig.contact.phone}</p>
                  <p>{siteConfig.contact.email}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
