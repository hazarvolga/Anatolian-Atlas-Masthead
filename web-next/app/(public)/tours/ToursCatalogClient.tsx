"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTours } from "@/hooks/useTours";
import { useDestinations, type Destination } from "@/hooks/useDestinations";
import ToursHeader from "@/components/tours/ToursHeader";
import ToursGrid from "@/components/tours/ToursGrid";
import TourFilters from "@/components/tours/TourFilters";
import type { DemoTour } from "@/lib/data/demo-content";

function ToursCatalogContent({
  initialTours,
  initialDestinations,
}: {
  initialTours: DemoTour[];
  initialDestinations: Destination[];
}) {
  const searchParams = useSearchParams();
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

  const initialDestinationParam = searchParams.get("destination") || "all";
  const initialDifficultyRaw = searchParams.get("difficulty") || "all";
  const initialDifficulty = (
    ["all", "easy", "moderate", "challenging"].includes(initialDifficultyRaw)
      ? initialDifficultyRaw
      : "all"
  ) as "all" | "easy" | "moderate" | "challenging";

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
  >(initialDifficulty);
  const setDifficultyFilter = (value: string) => {
    setDifficultyFilterRaw(value as "all" | "easy" | "moderate" | "challenging");
  };
  const [destinationFilter, setDestinationFilter] = useState<string>(
    initialDestinationParam
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    computedMaxPrice,
  ]);

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

  return (
    <div className="pt-28 pb-20">
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

export default function ToursCatalogClient({
  initialTours,
  initialDestinations,
}: {
  initialTours: DemoTour[];
  initialDestinations: Destination[];
}) {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 container text-center text-text-secondary">
          Loading journeys...
        </div>
      }
    >
      <ToursCatalogContent
        initialTours={initialTours}
        initialDestinations={initialDestinations}
      />
    </Suspense>
  );
}
