
import TourCard from "@/components/TourCard";
import { Button } from "@/components/ui/button";
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
          <div className="text-center py-12 animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">No tours match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters to see more options</p>
            <Button 
              variant="outline" 
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div key={tour.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
