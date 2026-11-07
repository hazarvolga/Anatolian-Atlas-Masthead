"use client";

import { useEffect, useMemo, useState } from "react";
import { useTours } from "@/hooks/useTours";
import { useDestinations } from "@/hooks/useDestinations";
import ToursHeader from "@/components/tours/ToursHeader";
import ToursGrid from "@/components/tours/ToursGrid";
import TourFilters from "@/components/tours/TourFilters";

export default function ToursPage() {
  const { data: tours = [], isLoading } = useTours();
  const { data: allDestinations = [] } = useDestinations();

  const [groupSizeFilter, setGroupSizeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilterRaw] = useState<
    "all" | "easy" | "moderate" | "challenging"
  >("all");
  const setDifficultyFilter = (value: string) => {
    setDifficultyFilterRaw(value as "all" | "easy" | "moderate" | "challenging");
  };
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  useEffect(() => {
    if (tours.length > 0) {
      const prices = tours.map((t: any) =>
        typeof t.price === "number" ? t.price : 0
      );
      const maxTourPrice = Math.ceil(Math.max(...prices) / 100) * 100;
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
        if (groupSizeFilter !== "all" && tour.max_group_size < Number(groupSizeFilter))
          return false;
        if (difficultyFilter !== "all" && tour.difficulty !== difficultyFilter)
          return false;
        if (destinationFilter !== "all" && tour.destinations?.id !== destinationFilter)
          return false;
        if (
          typeof tour.price !== "number" ||
          tour.price < priceRange[0] ||
          tour.price > priceRange[1]
        )
          return false;
        return true;
      });
  }, [tours, groupSizeFilter, difficultyFilter, destinationFilter, priceRange]);

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
    <div className="pt-32 pb-16">
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
