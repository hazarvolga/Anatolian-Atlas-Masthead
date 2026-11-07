"use client";


import { useEffect, useState } from "react";
import { TourProps } from "@/types/tour";

interface UseTourFiltersProps {
  tours: TourProps[];
  rawTours: any[];
}

export const useTourFilters = ({ tours, rawTours }: UseTourFiltersProps) => {
  const [filteredTours, setFilteredTours] = useState<TourProps[]>([]);
  const [groupSizeFilter, setGroupSizeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Calculate the maximum price from all tours to set dynamic price range
  useEffect(() => {
    if (tours.length > 0) {
      const prices = tours.map(tour => tour.price);
      const maxTourPrice = Math.max(...prices);
      const dynamicMaxPrice = Math.ceil(maxTourPrice / 100) * 100; // Round up to nearest 100
      setMaxPrice(dynamicMaxPrice);
      setPriceRange([0, dynamicMaxPrice]); // Set initial range to show all tours
      console.log('Tours price range set to:', 0, '-', dynamicMaxPrice, 'Max tour price:', maxTourPrice);
    }
  }, [tours]);

  // Apply filters
  useEffect(() => {
    if (!tours.length) return;
    
    console.log('Applying filters to tours, initial count:', tours.length);
    let result = tours;
    
    // Filter by group size
    if (groupSizeFilter !== "all") {
      const size = parseInt(groupSizeFilter);
      result = result.filter(tour => tour.max_group_size >= size);
      console.log('After group size filter:', result.length);
    }
    
    // Filter by difficulty
    if (difficultyFilter !== "all") {
      result = result.filter(tour => tour.difficulty === difficultyFilter);
      console.log('After difficulty filter:', result.length);
    }

    // Filter by destination - Fixed the comparison logic
    if (destinationFilter !== "all") {
      result = result.filter(tour => {
        const originalTour = rawTours.find(t => t.id === tour.id);
        return originalTour && originalTour.destinations?.id === destinationFilter;
      });
      console.log('After destination filter:', result.length);
    }
    
    // Filter by price range
    result = result.filter(tour => tour.price >= priceRange[0] && tour.price <= priceRange[1]);
    console.log('After price filter:', result.length, 'Price range:', priceRange);
    
    setFilteredTours(result);
  }, [tours, groupSizeFilter, difficultyFilter, destinationFilter, priceRange, rawTours]);

  const resetFilters = () => {
    setGroupSizeFilter("all");
    setDifficultyFilter("all");
    setDestinationFilter("all");
    setPriceRange([0, maxPrice]);
  };

  return {
    filteredTours,
    groupSizeFilter,
    setGroupSizeFilter,
    difficultyFilter,
    setDifficultyFilter,
    destinationFilter,
    setDestinationFilter,
    priceRange,
    setPriceRange,
    maxPrice,
    resetFilters
  };
};
