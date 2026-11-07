"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Minus } from "lucide-react";
import { useTour } from "@/hooks/useTours";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { formatPrice, siteConfig } from "@/config/site";
import { SplitTextHeading, MagneticCTA } from "@/components/motion";
import { useScrollActiveStep } from "@/lib/motion/hooks";
import { DEFAULT_DEMO_TOUR_IMAGE } from "@/lib/data/demo-images";

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

const DEFAULT_TOUR_IMAGE = DEFAULT_DEMO_TOUR_IMAGE;

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
  const { config, concept } = useDesignSystem();
  const { data: fetchedTour, isLoading: queryLoading, error } = useTour(id);
  const rawTour = fetchedTour || initialTour;
  const isLoading = !rawTour && queryLoading;
  const tour = normaliseTour(rawTour);
  const itineraryContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeNoirTab, setActiveNoirTab] = useState<
    "overview" | "chronicle" | "provisions"
  >("overview");

  // Vertical scroll-active itinerary tracker (NO horizontal pin on tour detail)
  useScrollActiveStep(
    itineraryContainerRef,
    "[data-itinerary-step]",
    setActiveDayIndex,
    tour?.id
  );

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

  const detailVariant = config.layout.tourDetail || "dossier";

  // Variant B (`aegean-linen` default): `story-scroll` — Asymmetric sun-drenched narrative scroll
  if (detailVariant === "story-scroll") {
    return (
      <main
        data-tour-detail-variant="story-scroll"
        className="pt-24 pb-24 bg-background min-h-screen space-y-20"
      >
        <div className="container">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-text-secondary hover:text-primary mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Coastal &amp; Inland Journeys</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs tracking-[0.12em] uppercase text-primary font-medium block">
                {concept.voice.eyebrowPrefix} · {tour.location}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.03]">
                {tour.name}
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {tour.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 rounded-full bg-card border border-border/60 text-xs text-foreground">
                  {durationLabel}
                </span>
                <span className="px-4 py-2 rounded-full bg-card border border-border/60 text-xs text-foreground">
                  Max {tour.max_group_size} Guests
                </span>
                <span className="px-4 py-2 rounded-full bg-card border border-border/60 text-xs text-foreground">
                  Pace: {paceLabel}
                </span>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-5">
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.1em] text-text-secondary">
                    Journey Tariff
                  </span>
                  <span className="font-serif text-3xl text-foreground tabular-nums">
                    {formatPrice(tour.price)}
                  </span>
                </div>
                <Link
                  href={`/book/${tour.id}`}
                  className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-medium tracking-[0.08em] uppercase inline-flex items-center gap-2 transition-colors"
                >
                  <span>Reserve This Journey</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-md">
                <Image
                  src={tour.image_url}
                  alt={tour.name}
                  width={1280}
                  height={800}
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flowing Narrative Story Chapters */}
        <section className="container max-w-5xl space-y-12">
          <div className="space-y-3">
            <span className="text-xs tracking-[0.12em] uppercase text-primary font-medium block">
              Daily Narrative Sequence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              The Rhythm of the Route
            </h2>
          </div>

          <div className="space-y-8">
            {tour.itinerary.map((item: ItineraryItem, idx: number) => (
              <article
                key={idx}
                className={`p-8 sm:p-10 rounded-2xl bg-card border border-border/50 grid grid-cols-1 md:grid-cols-12 gap-6 items-start ${
                  idx % 2 === 1 ? "md:ml-12" : "md:mr-12"
                }`}
              >
                <div className="md:col-span-3">
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary-subtle text-primary text-xs font-medium tracking-[0.08em]">
                    Chapter 0{item.day || idx + 1}
                  </span>
                </div>
                <div className="md:col-span-9 space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Airy Inclusions & Private Charter Invitation */}
        <section className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border/50 space-y-4">
              <h3 className="font-serif text-2xl text-foreground">
                Included in Your Journey
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                {tour.included.map((inc: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-card/50 border border-border/50 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs tracking-[0.1em] uppercase text-primary font-medium block">
                  Private &amp; Small-Group Dates
                </span>
                <h3 className="font-serif text-2xl text-foreground">
                  Ready to step onto the route?
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Reserve your place online in four calm steps or consult our Galata planning desk for bespoke dates.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/book/${tour.id}`}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-[0.08em] inline-flex items-center gap-1.5"
                >
                  <span>Proceed to Reservation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full border border-border text-foreground text-xs font-medium uppercase tracking-[0.08em]"
                >
                  Inquire Privately
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Variant C (`ottoman-noir` default): `tabs` — Centered Symmetrical Salon Monument + Interactive Tab Switcher
  if (detailVariant === "tabs") {
    return (
      <main
        data-tour-detail-variant="tabs"
        className="pt-24 pb-24 bg-background min-h-screen space-y-14"
      >
        {/* Symmetrical Gold-Framed Hero Stage */}
        <section className="container">
          <div className="border border-primary/50 p-2 bg-card">
            <div className="relative min-h-[520px] border border-border overflow-hidden flex flex-col justify-between bg-black text-white p-8 sm:p-14 text-center">
              <Image
                src={tour.image_url}
                alt={tour.name}
                width={1400}
                height={900}
                priority
                sizes="(max-width: 640px) 320px, 100vw"
                className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-55"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-white/80">
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 text-white hover:text-[#DEC089]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>ALL CHRONICLES</span>
                </Link>
                <span className="text-[#DEC089]">
                  ✦ {concept.voice.eyebrowPrefix} ✦
                </span>
                <span>{tour.location.toUpperCase()}</span>
              </div>

              <div className="relative z-10 max-w-3xl mx-auto my-auto py-10 space-y-5">
                <span className="inline-block px-4 py-1 border border-[#C8A464]/60 bg-black/70 text-[10px] font-mono uppercase tracking-[0.22em] text-[#DEC089]">
                  {durationLabel} · MAX {tour.max_group_size} GUESTS · PACE:{" "}
                  {paceLabel.toUpperCase()}
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl text-white leading-[0.98]">
                  {tour.name}
                </h1>
                <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed">
                  {tour.description}
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/75">
                    ALL-INCLUSIVE SALON TARIFF
                  </span>
                  <span className="font-serif text-3xl text-[#DEC089] tabular-nums">
                    {formatPrice(tour.price)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/book/${tour.id}`}
                    className="px-7 py-3.5 bg-[#C8A464] text-[#121316] hover:bg-[#DEC089] text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Reserve Private Commission</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Centered Symmetrical Tab Switcher */}
        <section className="container max-w-4xl space-y-10">
          <div
            role="tablist"
            aria-label="Chronicle Sections"
            className="grid grid-cols-1 sm:grid-cols-3 border border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border"
          >
            {[
              { id: "overview", label: "I. Curatorial Premise & Stops" },
              { id: "chronicle", label: "II. Daily Chronicle" },
              { id: "provisions", label: "III. Salon Provisions & Tariff" },
            ].map((tab) => {
              const selected = activeNoirTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveNoirTab(tab.id as any)}
                  className={`py-4 px-5 text-xs font-mono uppercase tracking-[0.18em] transition-colors text-center ${
                    selected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeNoirTab === "overview" && (
            <div className="border border-border bg-card p-8 sm:p-12 space-y-8 text-center">
              <div className="space-y-3 max-w-2xl mx-auto">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary block">
                  ✦ ARCHITECTURAL &amp; ARCHAEOLOGICAL HIGHLIGHTS ✦
                </span>
                <h2 className="font-serif text-3xl text-foreground">
                  Key Monuments &amp; Private Entries
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {tour.highlights.map((hl: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 border border-border bg-background flex items-baseline gap-3.5"
                  >
                    <span className="font-mono text-xs text-primary font-semibold">
                      0{idx + 1}
                    </span>
                    <span className="text-sm text-foreground">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNoirTab === "chronicle" && (
            <div className="border border-border bg-card divide-y divide-border">
              {tour.itinerary.map((item: ItineraryItem, idx: number) => (
                <div
                  key={idx}
                  className="p-8 sm:p-10 text-center space-y-3 max-w-2xl mx-auto"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary block">
                    ✦ CHAPTER 0{item.day || idx + 1} ✦
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeNoirTab === "provisions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 border border-border bg-card divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-8 space-y-4">
                <h3 className="font-serif text-2xl text-foreground">
                  Included Provisions
                </h3>
                <ul className="space-y-3 text-sm text-foreground">
                  {tour.included.map((inc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-serif text-2xl text-foreground">
                  Exclusions
                </h3>
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
          )}
        </section>
      </main>
    );
  }

  // Variant A (`atlas-editorial` default): `dossier` — 12-Col Swiss Specification Ledger + Vertical Route Timeline
  return (
    <main
      data-tour-detail-variant="dossier"
      className="pt-20 bg-background min-h-screen"
    >
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
          <span>EXPEDITION DOSSIER · {tour.location.toUpperCase()}</span>
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
                <SplitTextHeading
                  as="h1"
                  text={tour.name}
                  className="font-serif text-foreground text-4xl sm:text-5xl lg:text-6xl leading-[0.98]"
                />
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
                <Image
                  src={tour.image_url}
                  alt={tour.name}
                  width={1120}
                  height={1400}
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 border-t border-background/15 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="block text-[10px] uppercase tracking-[0.15em] text-background/60">
                    ASSEMBLY &amp; DISPATCH
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
              {/* 01 / Chronological Route Sequence (Vertical Scroll-Active Timeline) */}
              <div ref={itineraryContainerRef} className="space-y-6">
                <div className="border-b border-border pb-4 flex items-baseline justify-between">
                  <span className="editorial-kicker">
                    01 — CHRONOLOGICAL ROUTE SEQUENCE (VERTICAL LEDGER)
                  </span>
                  <span className="editorial-meta">
                    STAGE 0{activeDayIndex + 1} OF 0{tour.itinerary.length} ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Sticky Vertical Stage Navigator */}
                  <div className="md:col-span-3 md:sticky md:top-28 border border-border bg-card divide-y divide-border rounded-card overflow-hidden">
                    <div className="px-4 py-2.5 bg-surface-container text-[10px] font-mono uppercase tracking-[0.15em] text-text-secondary">
                      STAGE INDEX
                    </div>
                    {tour.itinerary.map((item: ItineraryItem, idx: number) => {
                      const isCurrent = idx === activeDayIndex;
                      const label =
                        tour.tour_type === "one_day"
                          ? `STAGE 0${item.day || idx + 1}`
                          : `DAY 0${item.day || idx + 1}`;
                      return (
                        <button
                          key={`nav-${idx}`}
                          type="button"
                          onClick={() => {
                            setActiveDayIndex(idx);
                            const el =
                              itineraryContainerRef.current?.querySelectorAll(
                                "[data-itinerary-step]"
                              )[idx];
                            el?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between text-xs font-mono ${
                            isCurrent
                              ? "bg-foreground text-background font-semibold"
                              : "bg-card text-text-secondary hover:text-foreground"
                          }`}
                        >
                          <span>{label}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCurrent ? "bg-primary" : "bg-border"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Vertical Scroll-Active Stage Cards */}
                  <div className="md:col-span-9 border border-border divide-y divide-border bg-card rounded-card overflow-hidden">
                    {tour.itinerary.map((item: ItineraryItem, idx: number) => {
                      const isCurrent = idx === activeDayIndex;
                      return (
                        <div
                          key={idx}
                          data-itinerary-step
                          className={`p-6 sm:p-8 transition-colors border-l-4 ${
                            isCurrent
                              ? "border-l-primary bg-surface-container/40"
                              : "border-l-transparent bg-card"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <span
                              className={`inline-block px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] font-semibold tabular-nums rounded-badge ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-foreground text-background"
                              }`}
                            >
                              {tour.tour_type === "one_day"
                                ? `STAGE 0${item.day || idx + 1}`
                                : `DAY 0${item.day || idx + 1}`}
                            </span>
                            {isCurrent && (
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                                ACTIVE FIELD STAGE
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-2xl text-foreground mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 02 / Key Archaeological & Cultural Stops */}
              {tour.highlights.length > 0 && (
                <div className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <span className="editorial-kicker">
                      02 — KEY ARCHAEOLOGICAL &amp; CULTURAL STOPS
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
                    03 — EXPEDITION PROVISIONS &amp; LOGISTICS
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
                  <MagneticCTA className="w-full block">
                    <Link
                      href={`/book/${tour.id}`}
                      className="btn-primary w-full py-4 text-center"
                    >
                      <span>Proceed to Reservation</span>
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                  </MagneticCTA>
                  <Link
                    href="/contact"
                    className="btn-outline w-full py-3.5 text-center"
                  >
                    Request Private Charter
                  </Link>
                </div>

                {(siteConfig.contact.phone || siteConfig.contact.email) && (
                  <div className="pt-4 border-t border-border text-xs text-text-secondary space-y-1">
                    <span className="block text-[10px] uppercase tracking-[0.15em] text-foreground font-semibold">
                      DIRECT GALATA DESK
                    </span>
                    {siteConfig.contact.phone && (
                      <p className="tabular-nums">{siteConfig.contact.phone}</p>
                    )}
                    {siteConfig.contact.email && (
                      <p>{siteConfig.contact.email}</p>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
