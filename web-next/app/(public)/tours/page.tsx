"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTours } from "@/hooks/useTours";
import { useDestinations } from "@/hooks/useDestinations";
import ToursHeader from "@/components/tours/ToursHeader";
import ToursGrid from "@/components/tours/ToursGrid";
import TourFilters from "@/components/tours/TourFilters";

function ToursCatalogContent() {
  const searchParams = useSearchParams();
  const { data: tours = [] } = useTours();
  const { data: allDestinations = [] } = useDestinations();

  const initialDestination = searchParams.get("destination") || "all";
  const initialDifficultyRaw = searchParams.get("difficulty") || "all";
  const initialDifficulty = (
    ["all", "easy", "moderate", "challenging"].includes(initialDifficultyRaw)
      ? initialDifficultyRaw
      : "all"
  ) as "all" | "easy" | "moderate" | "challenging";

  const [groupSizeFilter, setGroupSizeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilterRaw] = useState<
    "all" | "easy" | "moderate" | "challenging"
  >(initialDifficulty);
  const setDifficultyFilter = (value: string) => {
    setDifficultyFilterRaw(value as "all" | "easy" | "moderate" | "challenging");
  };
  const [destinationFilter, setDestinationFilter] =
    useState<string>(initialDestination);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  useEffect(() => {
    const destParam = searchParams.get("destination");
    const diffParam = searchParams.get("difficulty");
    if (destParam) setDestinationFilter(destParam);
    if (
      diffParam &&
      ["all", "easy", "moderate", "challenging"].includes(diffParam)
    ) {
      setDifficultyFilterRaw(
        diffParam as "all" | "easy" | "moderate" | "challenging"
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (tours.length > 0) {
      const prices = tours.map((t: any) =>
        typeof t.price === "number" ? t.price : 0
      );
      const maxTourPrice = Math.max(
        500,
        Math.ceil(Math.max(...prices) / 100) * 100
      );
      setMaxPrice(maxTourPrice);
      setPriceRange([0, maxTourPrice]);
    }
  }, [tours]);

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
    setPriceRange([0, maxPrice]);
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
        maxPrice={maxPrice}
        destinations={destinations}
        filteredCount={filteredTours.length}
        totalCount={tours.length}
        onResetFilters={handleResetFilters}
      />
      <ToursGrid tours={filteredTours} onResetFilters={handleResetFilters} />
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 container text-center text-text-secondary">
          Loading journeys...
        </div>
      }
    >
      <ToursCatalogContent />
    </Suspense>
  );
}
