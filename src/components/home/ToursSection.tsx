
import TourCard from "@/components/TourCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useTours } from "@/hooks/useTours";

export default function ToursSection() {
  const { data: tours, isLoading, error } = useTours();
  
  console.log('ToursSection - tours data:', tours, 'loading:', isLoading, 'error:', error);
  
  // Ensure tours is always an array - triple safety check
  const safeTours = Array.isArray(tours) ? tours : [];
  console.log('Safe tours in ToursSection:', safeTours.length);

  return (
    <section className="section bg-gradient-to-br from-accent-emerald/5 via-surface-elevated to-accent-coral/5 relative overflow-hidden">
      {/* İsteğe bağlı soft arka plan efektleri eklenebilir */}
      <div className="container relative z-10">
        <div className="bg-gradient-to-b from-background to-surface-elevated rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 bg-accent-emerald/10 text-accent-emerald rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4 mr-2" />
              Our Tours
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-text-primary to-accent-emerald bg-clip-text text-transparent">
              Discover All Our Tours
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Explore our complete collection of tours and create unforgettable memories
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading tours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error loading tours</h3>
              <p className="text-text-secondary mb-6">
                There was a problem loading the tours. Please try refreshing the page.
              </p>
            </div>
          ) : safeTours && safeTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeTours.map((tour, index) => (
                <div key={tour.id} className="animate-fade-in hover-lift" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No tours available yet</h3>
              <p className="text-text-secondary mb-6">
                Check back soon for exciting tours to explore!
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild variant="emerald" size="lg" className="group">
              <Link to="/tours">
                View All Tours 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

