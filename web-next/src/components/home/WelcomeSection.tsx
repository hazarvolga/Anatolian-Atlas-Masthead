"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeSection() {
  const { t } = useLanguage();

  return (
    <section
      id="welcome"
      className="section bg-background border-b border-border"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 5 Columns: Editorial Photograph with Location Caption */}
          <div className="lg:col-span-5">
            <figure className="bg-card p-3 rounded-lg border border-border shadow-sm">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85"
                  alt="Second-century Roman facade of the Library of Celsus at Ephesus, Selçuk, Türkiye"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="pt-3 px-1 flex items-center justify-between text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Library of Celsus, Ephesus (Selçuk)
                </span>
                <span className="font-mono text-[11px] tabular-nums">
                  37.9395° N, 27.3417° E
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Right 7 Columns: Editorial Interval & Concrete Field Facts */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="editorial-kicker block">
              03 — {t.home.welcome.subtitle}
            </span>

            <h2 className="font-serif text-foreground">
              {t.home.welcome.title}
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed">
              {t.home.welcome.description1}
            </p>

            <p className="text-text-secondary text-base leading-relaxed">
              {t.home.welcome.description2}
            </p>

            {/* Concrete Verifiable Program Parameters */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-primary">
                  Group Architecture
                </dt>
                <dd className="mt-1 font-serif text-lg text-foreground">
                  8 to 12 travelers maximum per departure
                </dd>
                <p className="text-xs text-text-secondary mt-1">
                  Sized for monastic chapels, Terrace Houses conservation walkways,
                  and neighborhood guild tables.
                </p>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-primary">
                  Academic & Field Access
                </dt>
                <dd className="mt-1 font-serif text-lg text-foreground">
                  Licensed historians & timed site entry
                </dd>
                <p className="text-xs text-text-secondary mt-1">
                  Morning entries scheduled at 08:00–08:30 ahead of cruise and
                  highway coach arrivals.
                </p>
              </div>
            </dl>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild className="btn-primary">
                <Link href="/tours" className="inline-flex items-center">
                  <span>{t.home.welcome.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-outline">
                <Link href="/destinations">{t.home.welcome.learnMore}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
