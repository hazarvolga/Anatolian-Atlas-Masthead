import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDestinations } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/TourCard";
import { MapPin, ArrowLeft } from "lucide-react";

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const { data: tours = [], isLoading: toursLoading } = useTours();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (destinationsLoading || toursLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-40 pb-24">
          <div className="container">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const destination = destinations.find((dest) => dest.id === id);

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-40 pb-24">
          <div className="container text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Destination not found</h2>
            <Button asChild>
              <Link to="/destinations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Destinations
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const destinationTours = tours.filter(
    (tour) => tour.destination_id === destination.id
  );

  // Ek görselleri hazırla
  const galleryImages = Array.isArray(destination.gallery_images)
    ? destination.gallery_images
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-40 pb-24 bg-background">
        <section className="container max-w-5xl mx-auto mb-16">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/destinations" className="hover:underline">Destinations</Link>
            <span>/</span>
            <span className="text-black dark:text-white font-semibold">{destination.name}</span>
          </div>
          {/* Header & Hero */}
          <div className="bg-white/70 dark:bg-neutral-800/80 shadow-lg rounded-xl flex flex-col md:flex-row gap-8 p-6 md:p-10">
            <div className="md:w-1/2 aspect-[4/3] overflow-hidden rounded-lg">
              <img 
                src={destination.image_url || `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop`}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              {/* Ekstra görseller galerisi */}
              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {galleryImages.map((url, i) => (
                    <img
                      key={url + i}
                      src={url}
                      alt={`${destination.name} görseli ${i + 1}`}
                      className="w-full h-20 object-cover rounded"
                      style={{ background: "#f4f4f5" }}
                      onError={e => (e.currentTarget.style.display = "none")}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <MapPin className="h-4 w-4 mr-1" />
                  {destination.city}, {destination.country}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{destination.name}</h1>
              <p className="text-lg text-muted-foreground">
                {destination.description || "Discover the beauty and culture of this amazing destination."}
              </p>
              {destination.best_time && (
                <div>
                  <span className="text-sm font-semibold text-primary">Best time to visit:</span> <span>{destination.best_time}</span>
                </div>
              )}
              {destination.activities && (
                <div>
                  <span className="text-sm font-semibold text-primary">Activities:</span>{" "}
                  <span>{destination.activities}</span>
                </div>
              )}
              {destination.google_maps_url && (
                <div>
                  <a
                    href={destination.google_maps_url}
                    className="inline-block text-primary underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Maps’te Göster
                  </a>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <Button asChild variant="outline">
                  <Link to="/destinations">All Destinations</Link>
                </Button>
                <Button asChild onClick={() => window.scrollTo({top: 900, behavior: 'smooth'})}>
                  <a href="#tours-section">See Tours</a>
                </Button>
              </div>
            </div>
          </div>
          {/* Ekstra bilgi kutusu */}
          {destination.extra_info && (
            <div className="mt-8 bg-primary/10 border-l-4 border-primary px-6 py-4 rounded-md">
              <h3 className="font-bold text-primary mb-2">Ekstra Bilgi</h3>
              <div className="text-muted-foreground whitespace-pre-line">{destination.extra_info}</div>
            </div>
          )}
        </section>
        
        <section id="tours-section" className="container max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">Tours in {destination.name}</h2>
          {destinationTours.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">There are no tours available for this destination yet.</p>
              <Button asChild variant="outline">
                <Link to="/tours">Browse All Tours</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
