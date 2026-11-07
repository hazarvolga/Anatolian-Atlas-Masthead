
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";

interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  image_url?: string;
  description?: string;
}

interface DestinationsListSectionProps {
  destinations: Destination[];
}

export default function DestinationsListSection({ destinations }: DestinationsListSectionProps) {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Amazing Destinations</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover breathtaking locations and plan your perfect adventure
          </p>
        </div>
        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No destinations available yet</h3>
            <p className="text-muted-foreground">
              Check back soon for exciting destinations to explore!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card 
                key={destination.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={destination.image_url || `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop`}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {destination.name}
                    </h3>
                    <Badge variant="secondary" className="ml-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {destination.city}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {destination.description || "Discover the beauty and culture of this amazing destination."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {destination.city}, {destination.country}
                    </div>
                    <Button asChild variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link href={`/destinations/${destination.id}`}>
                        View Destination
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
