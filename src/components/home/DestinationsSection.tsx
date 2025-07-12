import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Globe } from "lucide-react";
import { useDestinations } from "@/hooks/useDestinations";

interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  image_url?: string;
  description?: string;
}

export default function DestinationsSection() {
  const { data: destinations, isLoading, error } = useDestinations();
  
  console.log('DestinationsSection - destinations data:', destinations, 'loading:', isLoading, 'error:', error);
  
  // Ensure destinations is always an array and limit to 6 for homepage
  const safeDestinations = Array.isArray(destinations) ? destinations.slice(0, 6) : [];
  console.log('Safe destinations in DestinationsSection:', safeDestinations.length);

  return (
    <section className="section bg-gradient-to-br from-primary/5 via-surface-elevated to-accent-vibrant/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent-vibrant/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-accent-vibrant/20 to-primary/20 rounded-full blur-3xl opacity-60" />
      
      <div className="container relative z-10">
        <div className="bg-gradient-to-b from-background to-surface-elevated rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-16">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Our Destinations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">
              Discover Amazing Destinations
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Explore breathtaking locations and plan your perfect adventure in Turkey
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading destinations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Error loading destinations</h3>
              <p className="text-text-secondary mb-6">
                There was a problem loading the destinations. Please try refreshing the page.
              </p>
            </div>
          ) : safeDestinations && safeDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeDestinations.map((destination, index) => (
                <Card 
                  key={destination.id} 
                  className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 animate-fade-in hover:-translate-y-2 transform card-elevated" 
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={destination.image_url || `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop`}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                        <MapPin className="h-3 w-3 mr-1" />
                        {destination.city}, {destination.country}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                    </div>
                    <p className="text-text-secondary mb-4 line-clamp-3">
                      {destination.description || "Discover the beauty and culture of this amazing destination."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {destination.city}
                      </div>
                      <Button asChild variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Link to={`/destinations/${destination.id}`}>
                          Explore
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No destinations available yet</h3>
              <p className="text-text-secondary mb-6">
                Check back soon for exciting destinations to explore!
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild variant="default" size="lg" className="group">
              <Link to="/destinations">
                View All Destinations 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
