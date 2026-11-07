"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDestinations } from "@/hooks/useDestinations";

export default function DestinationsSection() {
  const { data: destinations, isLoading, error } = useDestinations();

  const safeDestinations = Array.isArray(destinations)
    ? destinations.slice(0, 6)
    : [];

  return (
    <section className="section bg-background border-b border-border">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="editorial-kicker block">
              01 — REGIONAL INDEX
            </span>
            <h2 className="font-serif text-foreground">
              Six geographies of Anatolia & the Straits
            </h2>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              From the imperial harbor of the Golden Horn to the volcanic tuff
              valleys of Cappadocia and the limestone escarpments of Mardin.
            </p>
          </div>
          <Button asChild variant="outline" className="btn-outline shrink-0">
            <Link href="/destinations" className="inline-flex items-center">
              <span>View Full Regional Index</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-lg bg-muted/60 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-lg border border-border bg-card text-center">
            <p className="text-text-secondary">
              Unable to load destinations right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeDestinations.map((destination, index) => {
              const indexNumber = String(index + 1).padStart(2, "0");
              return (
                <article
                  key={destination.id}
                  className="group flex flex-col bg-card rounded-lg border border-border overflow-hidden transition-shadow duration-200 hover:shadow-md hover:border-foreground/25"
                >
                  <Link
                    href={`/destinations/${destination.id}`}
                    className="relative aspect-[4/3] overflow-hidden bg-muted block"
                  >
                    <img
                      src={
                        destination.image_url ||
                        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-background/95 text-foreground font-mono text-xs font-semibold tracking-wider border border-border/80 tabular-nums">
                      {indexNumber}
                    </span>
                  </Link>

                  <div className="flex flex-col flex-1 justify-between p-6 space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <MapPin className="h-3.5 w-3.5" />
                          {destination.city || "Anatolia"},{" "}
                          {destination.country || "Türkiye"}
                        </span>
                        {destination.coords && (
                          <span className="font-mono text-[11px] tabular-nums">
                            {destination.coords}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl font-medium text-foreground">
                        <Link
                          href={`/destinations/${destination.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {destination.name}
                        </Link>
                      </h3>

                      <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                        {destination.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        {destination.best_time
                          ? `Season: ${destination.best_time}`
                          : "Spring & Autumn"}
                      </span>
                      <Link
                        href={`/destinations/${destination.id}`}
                        className="inline-flex items-center font-semibold text-foreground group-hover:text-primary transition-colors"
                      >
                        <span>Explore Region</span>
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
