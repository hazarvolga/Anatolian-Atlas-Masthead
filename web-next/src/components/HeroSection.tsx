"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDestinations } from "@/hooks/useDestinations";

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: destinations = [] } = useDestinations();

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPace, setSelectedPace] = useState<string>("all");

  const safeDestinations = Array.isArray(destinations) ? destinations : [];

  const handleDiscoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedRegion !== "all") {
      params.set("destination", selectedRegion);
    }
    if (selectedPace !== "all") {
      params.set("difficulty", selectedPace);
    }
    const queryString = params.toString();
    router.push(queryString ? `/tours?${queryString}` : "/tours");
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-background border-b border-border">
      <div className="container">
        {/* 12-Column Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (7 cols ~58%): Paper Field & Typography */}
          <div className="lg:col-span-7 space-y-8 pt-2 lg:pt-6">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="editorial-kicker">{t.hero.subtitle}</span>
            </div>

            <h1 className="font-serif text-foreground tracking-tight leading-[1.05]">
              {t.hero.title}
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-[58ch] leading-relaxed">
              {t.hero.description}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button asChild size="lg" className="btn-primary h-12 px-7">
                <Link href="/tours" className="inline-flex items-center gap-2.5">
                  <span>{t.hero.bookStay}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="btn-outline h-12 px-7">
                <Link
                  href="/destinations"
                  className="inline-flex items-center gap-2"
                >
                  <Compass className="h-4 w-4 text-primary" />
                  <span>{t.hero.exploreApartments}</span>
                </Link>
              </Button>
            </div>

            {/* Compact Working Route Discovery Bar */}
            <form
              onSubmit={handleDiscoverySubmit}
              className="mt-8 p-4 sm:p-5 bg-card rounded-lg border border-border shadow-sm"
              aria-label="Filter journeys by region and walking pace"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="hero-region-select"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                  >
                    Region / Destination
                  </label>
                  <select
                    id="hero-region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Regions in Türkiye</option>
                    {safeDestinations.map((dest: any) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="hero-pace-select"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                  >
                    Walking Pace
                  </label>
                  <select
                    id="hero-pace-select"
                    value={selectedPace}
                    onChange={(e) => setSelectedPace(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Paces</option>
                    <option value="easy">Easy — Urban & Cultural</option>
                    <option value="moderate">Moderate — Valley & Coastal Trails</option>
                    <option value="challenging">Challenging — Mountain Ridges</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Button
                    type="submit"
                    className="w-full h-10 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Routes
                  </Button>
                </div>
              </div>
            </form>

            {/* Geographic Index Strip */}
            <div className="pt-2 border-t border-border/70 grid grid-cols-3 gap-6 text-xs text-text-secondary">
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-primary">
                  01 / Straits
                </span>
                <span className="font-medium text-foreground">
                  İstanbul & Bosphorus
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-primary">
                  02 / Plateau
                </span>
                <span className="font-medium text-foreground">
                  Cappadocia & Göreme
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-primary">
                  03 / Coast & East
                </span>
                <span className="font-medium text-foreground">
                  Ephesus, Lycia & Mardin
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols ~42%): Dominant Authentic Türkiye Photograph */}
          <div className="lg:col-span-5">
            <figure className="relative bg-card p-3 rounded-lg border border-border shadow-md">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85"
                  alt="Morning ferry crossing the Bosphorus Strait toward Ortaköy in İstanbul, Türkiye"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="pt-3 px-1 flex items-center justify-between text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Ortaköy & The Bosphorus Strait, İstanbul
                </span>
                <span className="font-mono text-[11px] tabular-nums">
                  41.0475° N, 29.0277° E
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
