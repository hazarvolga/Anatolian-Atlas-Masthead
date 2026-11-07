"use client";

import { Slider } from "@/components/ui/slider";

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
    <section className="border-b border-border bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 border-x border-b border-border divide-y md:divide-y-0 md:divide-x divide-border bg-card">
          {/* 01 / Region */}
          <div className="p-5">
            <label
              htmlFor="catalog-region-filter"
              className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-2"
            >
              01 / Geographic Region
            </label>
            <select
              id="catalog-region-filter"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Regions of Türkiye</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}
                </option>
              ))}
            </select>
          </div>

          {/* 02 / Group Capacity */}
          <div className="p-5">
            <label
              htmlFor="catalog-group-filter"
              className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-2"
            >
              02 / Group Ceiling
            </label>
            <select
              id="catalog-group-filter"
              value={groupSizeFilter}
              onChange={(e) => setGroupSizeFilter(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">Any Group Size</option>
              <option value="8">8+ Guests Capacity</option>
              <option value="10">10+ Guests Capacity</option>
              <option value="12">12+ Guests Capacity</option>
            </select>
          </div>

          {/* 03 / Walking Pace */}
          <div className="p-5">
            <label
              htmlFor="catalog-pace-filter"
              className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-2"
            >
              03 / Terrain & Pace
            </label>
            <select
              id="catalog-pace-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Walking Paces</option>
              <option value="easy">Easy — Urban & Cultural</option>
              <option value="moderate">Moderate — Valley & Coastal</option>
              <option value="challenging">Challenging — High Ridges</option>
            </select>
          </div>

          {/* 04 / Tariff Range */}
          <div className="p-5">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary mb-2 tabular-nums">
              04 / Tariff Ceiling: €{priceRange[0]} – €{priceRange[1]}
            </label>
            <Slider
              min={0}
              max={maxPrice}
              step={25}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-3"
            />
          </div>
        </div>

        {/* Status & Reset Ledger Bar */}
        <div className="px-5 py-3 border-x border-border bg-background flex flex-wrap justify-between items-center gap-4 text-xs uppercase tracking-[0.14em] tabular-nums">
          <p
            className="text-text-secondary"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            DISPLAYING <strong className="text-foreground">{filteredCount}</strong>{" "}
            OF <strong className="text-foreground">{totalCount}</strong>{" "}
            FIELD ITINERARIES
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-primary hover:text-foreground font-semibold transition-colors"
          >
            RESET FILTER PARAMETERS
          </button>
        </div>
      </div>
    </section>
  );
}
