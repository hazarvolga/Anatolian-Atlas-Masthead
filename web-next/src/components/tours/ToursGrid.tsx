"use client";

import TourCard from "@/components/TourCard";
import { TourProps } from "@/types/tour";

interface ToursGridProps {
  tours: TourProps[];
  onResetFilters: () => void;
}

export default function ToursGrid({ tours, onResetFilters }: ToursGridProps) {
  if (tours.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="border border-border bg-card p-12 text-center space-y-4">
            <span className="editorial-kicker block">NO MATCHING ROUTES</span>
            <h3 className="font-serif text-2xl text-foreground">
              No field itineraries match the selected parameters
            </h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Reset the regional or pace filters above to inspect our complete seasonal archive.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="btn-outline mt-2"
            >
              Reset Filter Parameters
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tours.map((tour, index) => (
            <TourCard key={tour.id} tour={tour} indexNumber={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
