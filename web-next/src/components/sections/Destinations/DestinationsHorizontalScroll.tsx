"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { useHorizontalPin } from "@/lib/motion/hooks";
import { isDemoMode } from "@/config/site";
import type { Destination } from "@/hooks/useDestinations";
import { DEMO_DESTINATIONS } from "@/lib/data/demo-content";
import { DEFAULT_DEMO_HERO_IMAGE } from "@/lib/data/demo-images";

export default function DestinationsHorizontalScroll({
  initialDestinations,
}: {
  initialDestinations?: Destination[];
}) {
  const { t } = useLanguage();
  const { concept } = useDesignSystem();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const regions =
    Array.isArray(initialDestinations) && initialDestinations.length > 0
      ? initialDestinations.slice(0, 6)
      : isDemoMode()
        ? DEMO_DESTINATIONS.slice(0, 6)
        : [];

  // Desktop-only horizontal pin (`>= 1024px` fine pointer); native stacked cards on mobile
  useHorizontalPin(sectionRef, trackRef, regions.length > 0);

  return (
    <section
      ref={sectionRef}
      data-destinations-variant="horizontal-scroll"
      className="section bg-background border-b border-border/50 overflow-hidden"
    >
      <div className="container mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs tracking-[0.12em] uppercase text-primary font-medium block">
              {concept.voice.eyebrowPrefix} · SIX COASTAL &amp; INLAND HORIZONS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-foreground leading-tight">
              {((t.home as Record<string, unknown>)?.featuredDestinations as string) ||
                "Six Distinct Regions of Anatolia"}
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-end lg:items-end gap-3">
            <p className="text-text-secondary text-sm md:text-base max-w-md lg:text-right leading-relaxed">
              Sun-bleached limestone peninsulas, Ionian marble harbors, and high plateau valleys explored at an unhurried coastal pace.
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-medium text-primary hover:text-foreground transition-colors"
            >
              <span>All Regional Horizons</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Asymmetric Offset Horizontal Track on Desktop, Airy Stack on Mobile */}
      <div
        ref={trackRef}
        className="container lg:max-w-none lg:w-max grid grid-cols-1 md:grid-cols-2 lg:flex gap-8 lg:gap-10 lg:px-10 items-start"
      >
        {regions.map((dest, idx) => {
          const isOffsetDown = idx % 2 === 1;
          return (
            <article
              key={dest.id}
              className={`lg:w-[460px] shrink-0 group ${
                isOffsetDown ? "lg:mt-12" : ""
              }`}
            >
              <Link
                href={`/destinations/${dest.id}`}
                className="block rounded-2xl overflow-hidden bg-card shadow-sm border border-border/50 hover:border-primary/50 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={dest.image_url || DEFAULT_DEMO_HERO_IMAGE}
                    alt={`${dest.name} — ${dest.city || "Türkiye"}`}
                    width={920}
                    height={575}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 460px"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full bg-background/90 backdrop-blur-md text-foreground text-[11px] tracking-[0.08em]">
                    {dest.city || "Anatolia"} · {dest.best_time || "Apr – Nov"}
                  </div>
                </div>

                <div className="p-7 space-y-3">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>{dest.coords || "36.20° N, 29.63° E"}</span>
                    <span className="text-primary font-medium">
                      {dest._count?.tours || 2} Journeys
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="pt-3 inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase font-medium text-primary">
                    <span>{concept.voice.ctaPrimaryVerb}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
