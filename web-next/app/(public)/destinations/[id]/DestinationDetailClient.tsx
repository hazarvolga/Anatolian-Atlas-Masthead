"use client";

import Link from "next/link";
import { useDestinations } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import { Button } from "@/components/ui/button";
import TourCard from "@/components/TourCard";
import { MapPin, ArrowLeft, Calendar, Compass } from "lucide-react";

export default function DestinationDetailClient({ id }: { id: string }) {
  const { data: destinations = [], isLoading: destinationsLoading } =
    useDestinations();
  const { data: tours = [], isLoading: toursLoading } = useTours();

  if (destinationsLoading || toursLoading) {
    return (
      <div className="pt-36 pb-24">
        <div className="container">
          <div className="h-96 rounded-lg bg-muted/60 animate-pulse border border-border" />
        </div>
      </div>
    );
  }

  const destination = destinations.find((dest: any) => dest.id === id);

  if (!destination) {
    return (
      <div className="pt-36 pb-24">
        <div className="container text-center py-16 space-y-4">
          <h1 className="font-serif text-3xl text-foreground">
            Region Not Found
          </h1>
          <Button asChild variant="outline">
            <Link href="/destinations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Regional Index
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const destKeyword = (destination.name || "")
    .split(/[&\s]/)[0]
    .toLowerCase()
    .replace("i̇", "i");

  const destinationTours = tours.filter((tour: any) => {
    if (tour.destination_id === destination.id) return true;
    const tourLoc = `${tour.location || ""} ${tour.name || ""} ${tour.destination_name || ""}`
      .toLowerCase()
      .replace("i̇", "i");
    return destKeyword.length >= 3 && tourLoc.includes(destKeyword);
  });

  const galleryImages = Array.isArray(destination.gallery_images)
    ? destination.gallery_images
    : [];

  const extraInfo =
    typeof destination.extra_info === "string" ? destination.extra_info : "";

  return (
    <div className="pt-28 pb-24 bg-background">
      <section className="container mb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-text-secondary text-xs uppercase tracking-wider"
        >
          <Link href="/" className="hover:text-foreground">
            Atlas
          </Link>
          <span>/</span>
          <Link href="/destinations" className="hover:text-foreground">
            Regions
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">
            {destination.name}
          </span>
        </nav>

        {/* Editorial Region Monograph */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted border border-border">
              <img
                src={
                  destination.image_url ||
                  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85"
                }
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            </div>
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((url: string, i: number) => (
                  <img
                    key={url + i}
                    src={url}
                    alt={`${destination.name} archive ${i + 1}`}
                    className="w-full h-24 object-cover rounded border border-border bg-muted"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1.5 font-semibold text-primary uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" />
                {destination.city || destination.name},{" "}
                {destination.country || "Türkiye"}
              </span>
              {destination.coords && (
                <span className="font-mono text-xs tabular-nums">
                  {destination.coords}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl text-foreground">
              {destination.name}
            </h1>

            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              {destination.description ||
                "Explore the historical strata, architecture, and landscapes of this region in Türkiye."}
            </p>

            <dl className="space-y-3 pt-3 border-t border-border text-sm">
              {destination.best_time && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-semibold text-foreground inline">
                      Recommended Season:{" "}
                    </dt>
                    <dd className="text-text-secondary inline">
                      {destination.best_time}
                    </dd>
                  </div>
                </div>
              )}
              {destination.activities && (
                <div className="flex items-start gap-2.5">
                  <Compass className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-semibold text-foreground inline">
                      Field Focus:{" "}
                    </dt>
                    <dd className="text-text-secondary inline">
                      {destination.activities}
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            {extraInfo && (
              <div className="p-4 rounded-md bg-muted/60 border-l-2 border-primary text-xs text-text-secondary leading-relaxed">
                <strong className="text-foreground block mb-1 uppercase tracking-wider">
                  Field Note
                </strong>
                {extraInfo}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline" className="btn-outline">
                <Link href="/destinations">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  All Regions
                </Link>
              </Button>
              <Button asChild className="btn-primary">
                <a href="#tours-section">View Regional Journeys</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="tours-section" className="container">
        <div className="mb-8 space-y-2">
          <span className="editorial-kicker block">REGIONAL ITINERARIES</span>
          <h2 className="font-serif text-3xl text-foreground">
            Journeys in {destination.name}
          </h2>
        </div>

        {destinationTours.length === 0 ? (
          <div className="p-10 rounded-lg bg-card border border-border text-center space-y-4">
            <p className="text-text-secondary">
              No scheduled departures are listed for this region yet.
            </p>
            <Button asChild variant="outline">
              <Link href="/tours">Browse All Journeys</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationTours.map((tour: any) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
