"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTours } from "@/hooks/useTours";
import { useDestinations, type Destination } from "@/hooks/useDestinations";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import ToursHeader from "@/components/tours/ToursHeader";
import ToursGrid from "@/components/tours/ToursGrid";
import TourFilters from "@/components/tours/TourFilters";
import TourCard from "@/components/TourCard";
import { formatPrice } from "@/config/site";
import type { DemoTour } from "@/lib/data/demo-content";
import { DEFAULT_DEMO_TOUR_IMAGE } from "@/lib/data/demo-images";

export default function ToursCatalogClient({
  initialTours,
  initialDestinations,
}: {
  initialTours: DemoTour[];
  initialDestinations: Destination[];
}) {
  const { concept } = useDesignSystem();
  const { data: fetchedTours } = useTours();
  const { data: fetchedDestinations } = useDestinations();

  const tours = useMemo(
    () =>
      Array.isArray(fetchedTours) && fetchedTours.length > 0
        ? fetchedTours
        : initialTours,
    [fetchedTours, initialTours]
  );

  const allDestinations = useMemo(
    () =>
      Array.isArray(fetchedDestinations) && fetchedDestinations.length > 0
        ? fetchedDestinations
        : initialDestinations,
    [fetchedDestinations, initialDestinations]
  );

  const computedMaxPrice = useMemo(() => {
    if (tours.length === 0) return 3000;
    const prices = tours.map((t: { price?: number }) =>
      typeof t.price === "number" ? t.price : 0
    );
    return Math.max(500, Math.ceil(Math.max(...prices) / 100) * 100);
  }, [tours]);

  const [groupSizeFilter, setGroupSizeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilterRaw] = useState<
    "all" | "easy" | "moderate" | "challenging"
  >("all");
  const setDifficultyFilter = (value: string) => {
    setDifficultyFilterRaw(value as "all" | "easy" | "moderate" | "challenging");
  };
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    computedMaxPrice,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get("destination");
    const diffParam = params.get("difficulty");
    if (destParam) setDestinationFilter(destParam);
    if (
      diffParam &&
      ["all", "easy", "moderate", "challenging"].includes(diffParam)
    ) {
      setDifficultyFilterRaw(
        diffParam as "all" | "easy" | "moderate" | "challenging"
      );
    }
  }, []);

  const filteredTours = useMemo(() => {
    return tours
      .map((tour: any) => ({
        ...tour,
        difficulty: ["easy", "moderate", "challenging"].includes(tour.difficulty)
          ? (tour.difficulty as "easy" | "moderate" | "challenging")
          : "easy",
      }))
      .filter((tour: any) => {
        if (
          groupSizeFilter !== "all" &&
          tour.max_group_size < Number(groupSizeFilter)
        )
          return false;
        if (difficultyFilter !== "all" && tour.difficulty !== difficultyFilter)
          return false;
        if (
          destinationFilter !== "all" &&
          tour.destinations?.id !== destinationFilter &&
          tour.destination_id !== destinationFilter
        )
          return false;
        if (
          typeof tour.price !== "number" ||
          tour.price < priceRange[0] ||
          tour.price > priceRange[1]
        )
          return false;
        return true;
      });
  }, [
    tours,
    groupSizeFilter,
    difficultyFilter,
    destinationFilter,
    priceRange,
  ]);

  const handleResetFilters = () => {
    setGroupSizeFilter("all");
    setDifficultyFilter("all");
    setDestinationFilter("all");
    setPriceRange([0, computedMaxPrice]);
  };

  const destinations = useMemo(
    () =>
      Array.isArray(allDestinations)
        ? allDestinations.map((d: any) => ({
            id: d.id,
            name: d.name,
          }))
        : [],
    [allDestinations]
  );

  const toursManifest = concept.pageManifests.tours;
  const leadTour = filteredTours[0] || tours[0] || null;

  // Concept 2 (`aegean-linen`): Asymmetric Offset Rows + Sunlit Feature Banner before floating filter
  if (toursManifest.gridStructure === "asymmetric-offset-rows") {
    return (
      <div
        data-tours-concept="aegean-linen"
        className="pt-28 pb-24 bg-background space-y-16"
      >
        {/* Asymmetric Coastal Header + Overflowing Sunlit Feature */}
        <section className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs tracking-[0.12em] uppercase text-primary font-medium block">
                {concept.voice.eyebrowPrefix}
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-foreground leading-[1.02]">
                Coastal &amp; Inland Journeys
              </h1>
              <p className="text-base text-text-secondary leading-relaxed">
                {concept.voice.microcopySample} Filter by region, walking pace, or group capacity below.
              </p>
            </div>

            {leadTour && (
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm grid grid-cols-1 sm:grid-cols-12">
                  <div className="hidden sm:block sm:col-span-7 relative aspect-[16/10] sm:aspect-auto min-h-[240px]">
                    <Image
                      src={leadTour.image_url || DEFAULT_DEMO_TOUR_IMAGE}
                      alt={leadTour.name}
                      width={960}
                      height={600}
                      priority
                      quality={70}
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 50vw, 40vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-primary font-medium block">
                        Featured Journey
                      </span>
                      <h2 className="font-serif text-2xl text-foreground leading-snug">
                        {leadTour.name}
                      </h2>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {leadTour.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="font-serif text-2xl text-foreground tabular-nums">
                        {formatPrice(leadTour.price)}
                      </span>
                      <Link
                        href={`/tours/${leadTour.id}`}
                        className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1"
                      >
                        <span>Explore</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Floating Filter Bar */}
        <TourFilters
          groupSizeFilter={groupSizeFilter}
          setGroupSizeFilter={setGroupSizeFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          destinationFilter={destinationFilter}
          setDestinationFilter={setDestinationFilter}
          priceRange={priceRange}
          setPriceRange={(value) => setPriceRange([value[0], value[1]])}
          maxPrice={computedMaxPrice}
          destinations={destinations}
          filteredCount={filteredTours.length}
          totalCount={tours.length}
          onResetFilters={handleResetFilters}
        />

        {/* Single-Column Asymmetric Offset Landscape Rows */}
        <section className="container">
          {filteredTours.length === 0 ? (
            <ToursGrid tours={filteredTours} onResetFilters={handleResetFilters} />
          ) : (
            <div className="flex flex-col gap-10">
              {filteredTours.map((tour: any, index: number) => (
                <div
                  key={tour.id}
                  className={index % 2 === 1 ? "lg:pl-16" : "lg:pr-16"}
                >
                  <TourCard
                    tour={tour}
                    indexNumber={index + 1}
                    variant="landscape-row"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Concept 3 (`ottoman-noir`): Centered Symmetrical Salon Showcase + Full-Bleed Minimal Cards
  if (toursManifest.gridStructure === "symmetrical-salon-showcase") {
    return (
      <div
        data-tours-concept="ottoman-noir"
        className="pt-28 pb-24 bg-background space-y-14"
      >
        {/* Symmetrical Centered Gold-Framed Header */}
        <section className="container">
          <div className="border border-primary/50 p-2 bg-card">
            <div className="border border-border py-14 px-6 sm:px-12 text-center space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary block">
                ✦ {concept.voice.eyebrowPrefix} ✦
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl text-foreground uppercase tracking-[0.02em]">
                Imperial &amp; Regional Chronicles
              </h1>
              <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
                {concept.voice.microcopySample} Select a regional parameter below to inspect private and small-group commissions.
              </p>
            </div>
          </div>
        </section>

        <TourFilters
          groupSizeFilter={groupSizeFilter}
          setGroupSizeFilter={setGroupSizeFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          destinationFilter={destinationFilter}
          setDestinationFilter={setDestinationFilter}
          priceRange={priceRange}
          setPriceRange={(value) => setPriceRange([value[0], value[1]])}
          maxPrice={computedMaxPrice}
          destinations={destinations}
          filteredCount={filteredTours.length}
          totalCount={tours.length}
          onResetFilters={handleResetFilters}
        />

        {/* Symmetrical 2-Column Full-Bleed Minimal Showcase */}
        <section className="container">
          {filteredTours.length === 0 ? (
            <ToursGrid tours={filteredTours} onResetFilters={handleResetFilters} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {filteredTours.map((tour: any, index: number) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  indexNumber={index + 1}
                  variant="full-bleed-minimal"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Concept 1 (`atlas-editorial` default): Swiss Tabular Ledger Header + 4-Col Filter + 2-Col 4:5 Portrait Grid
  return (
    <div data-tours-concept="atlas-editorial" className="pt-28 pb-20">
      <ToursHeader />
      <TourFilters
        groupSizeFilter={groupSizeFilter}
        setGroupSizeFilter={setGroupSizeFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        destinationFilter={destinationFilter}
        setDestinationFilter={setDestinationFilter}
        priceRange={priceRange}
        setPriceRange={(value) => setPriceRange([value[0], value[1]])}
        maxPrice={computedMaxPrice}
        destinations={destinations}
        filteredCount={filteredTours.length}
        totalCount={tours.length}
        onResetFilters={handleResetFilters}
      />
      <ToursGrid tours={filteredTours} onResetFilters={handleResetFilters} />
    </div>
  );
}
