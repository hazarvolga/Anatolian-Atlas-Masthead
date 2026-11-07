"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Destination {
  id: string;
  name: string;
}

interface TourFiltersProps {
  groupSizeFilter: string;
  setGroupSizeFilter: (value: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (value: string) => void;
  destinationFilter: string;
  setDestinationFilter: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  destinations: Destination[];
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export default function TourFilters({
  groupSizeFilter,
  setGroupSizeFilter,
  difficultyFilter,
  setDifficultyFilter,
  destinationFilter,
  setDestinationFilter,
  priceRange,
  setPriceRange,
  maxPrice,
  destinations,
  filteredCount,
  totalCount,
  onResetFilters,
}: TourFiltersProps) {
  return (
    <section className="py-8 border-b border-border bg-card">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Destination Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Region / Destination
            </label>
            <Select
              value={destinationFilter}
              onValueChange={setDestinationFilter}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id}>
                    {destination.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Size Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Group Capacity
            </label>
            <Select value={groupSizeFilter} onValueChange={setGroupSizeFilter}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Any group size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any group size</SelectItem>
                <SelectItem value="8">Up to 8+ travelers</SelectItem>
                <SelectItem value="10">Up to 10+ travelers</SelectItem>
                <SelectItem value="12">Up to 12+ travelers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Walking Pace
            </label>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Any pace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any pace</SelectItem>
                <SelectItem value="easy">Easy — Urban & Cultural</SelectItem>
                <SelectItem value="moderate">
                  Moderate — Valley & Coastal
                </SelectItem>
                <SelectItem value="challenging">
                  Challenging — Ridge Trails
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 tabular-nums">
              Price Range: €{priceRange[0]} – €{priceRange[1]}
            </label>
            <Slider
              min={0}
              max={maxPrice}
              step={25}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/60 text-sm">
          <p className="text-text-secondary tabular-nums">
            Showing <strong className="text-foreground">{filteredCount}</strong>{" "}
            of <strong className="text-foreground">{totalCount}</strong>{" "}
            journeys
          </p>
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </section>
  );
}
