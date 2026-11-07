"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { SplitTextHeading, MagneticCTA } from "@/components/motion";
import { formatPrice, isDemoMode } from "@/config/site";
import type { Destination } from "@/hooks/useDestinations";
import type { DemoTour } from "@/lib/data/demo-content";
import { DEMO_DESTINATIONS, DEMO_TOURS } from "@/lib/data/demo-content";
import { DEFAULT_DEMO_HERO_IMAGE } from "@/lib/data/demo-images";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export default function HeroFullscreenReel({
  initialDestinations,
  initialTours,
}: {
  initialDestinations?: Destination[];
  initialTours?: DemoTour[];
}) {
  const { t } = useLanguage();
  const { concept } = useDesignSystem();

  const regions =
    Array.isArray(initialDestinations) && initialDestinations.length > 0
      ? initialDestinations.slice(0, 6)
      : isDemoMode()
        ? DEMO_DESTINATIONS.slice(0, 6)
        : [];

  const tours =
    Array.isArray(initialTours) && initialTours.length > 0
      ? initialTours
      : isDemoMode()
        ? DEMO_TOURS
        : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeRegion = regions[activeIndex] || regions[0];
  const leadTour =
    tours.find(
      (tr) =>
        tr.destination_id === activeRegion?.id ||
        tr.city?.toLowerCase() === activeRegion?.city?.toLowerCase()
    ) || tours[0];

  return (
    <section
      data-hero-variant="fullscreen-reel"
      className="relative pt-20 md:pt-24 bg-background border-b border-border"
    >
      <div className="container py-6 sm:py-10">
        {/* Double-Gold Framed Symmetrical Salon Stage */}
        <div className="relative min-h-[680px] lg:min-h-[760px] border border-primary/50 p-2 sm:p-3 bg-card overflow-hidden">
          <div className="relative min-h-[660px] lg:min-h-[736px] border border-border overflow-hidden flex flex-col justify-between bg-black text-white">
            {/* Full-Viewport Nocturnal Plate on Desktop; Framed Salon Plate on Mobile */}
            <Image
              src={activeRegion?.image_url || DEFAULT_DEMO_HERO_IMAGE}
              alt={`${activeRegion?.name || "İstanbul"} — Nocturnal Salon Plate`}
              width={1280}
              height={800}
              priority
              quality={68}
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 768px, 1200px"
              className="hidden sm:block absolute inset-0 w-full h-full object-cover opacity-65 scale-[1.03] transition-transform duration-1000"
            />

            {/* Symmetrical Radial Vignette Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90"
              aria-hidden="true"
            />

            {/* Corner Gold Ornament SVGs */}
            <svg
              aria-hidden="true"
              className="absolute top-4 left-4 w-7 h-7 text-[#DEC089] pointer-events-none"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M1 27V1H27M6 22V6H22"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <svg
              aria-hidden="true"
              className="absolute top-4 right-4 w-7 h-7 text-[#DEC089] pointer-events-none"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M27 27V1H1M22 22V6H6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <svg
              aria-hidden="true"
              className="absolute bottom-4 left-4 w-7 h-7 text-[#DEC089] pointer-events-none"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M1 1V27H27M6 6V22H22"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <svg
              aria-hidden="true"
              className="absolute bottom-4 right-4 w-7 h-7 text-[#DEC089] pointer-events-none"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M27 1V27H1M22 6V22H6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            {/* Top Symmetrical Telemetry Header */}
            <div className="relative z-10 px-8 pt-8 pb-5 border-b border-white/15 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em] text-white/85">
              <span>CHRONICLE {ROMAN_NUMERALS[activeIndex] || "I"} OF VI</span>
              <span className="text-[#DEC089]">
                ✦ {concept.voice.eyebrowPrefix} ✦
              </span>
              <span>{activeRegion?.coords || "41.0082° N, 28.9784° E"}</span>
            </div>

            {/* Centered Symmetrical Monumental Display Axis */}
            <div className="relative z-10 px-6 sm:px-14 py-12 max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#C8A464]/60 bg-black/70 text-[11px] font-mono uppercase tracking-[0.22em] text-[#DEC089]">
                <span>{activeRegion?.city || "İSTANBUL"}</span>
                <span>·</span>
                <span>{activeRegion?.best_time || "AUTUMN / SPRING SALON"}</span>
              </div>

              <SplitTextHeading
                as="h1"
                text={activeRegion?.name || t.hero.title}
                className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-[0.96] tracking-[-0.02em] text-center"
              />

              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                {activeRegion?.description || t.hero.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <MagneticCTA>
                  <Link
                    href={`/tours/${leadTour?.id || "tour-istanbul-stratum"}`}
                    className="px-8 py-4 bg-[#C8A464] text-[#121316] hover:bg-[#DEC089] text-xs uppercase tracking-[0.18em] font-semibold inline-flex items-center gap-2 transition-colors"
                  >
                    <span>{concept.voice.ctaPrimaryVerb}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </MagneticCTA>
                <Link
                  href="/contact"
                  className="px-8 py-4 border border-white/40 bg-black/50 text-white hover:bg-white hover:text-black text-xs uppercase tracking-[0.18em] font-medium transition-colors"
                >
                  <span>{concept.voice.ctaSecondaryVerb}</span>
                </Link>
              </div>
            </div>

            {/* Bottom Symmetrical Chapter Switcher & Lead Commission Bar */}
            <div className="relative z-10 px-6 sm:px-10 py-6 border-t border-white/15 bg-black/75 backdrop-blur-md space-y-5">
              <div
                role="tablist"
                aria-label="Select Regional Chronicle"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
              >
                {regions.map((reg, idx) => {
                  const selected = idx === activeIndex;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveIndex(idx)}
                      className={`px-3 py-2.5 border text-center transition-colors ${
                        selected
                          ? "border-[#C8A464] bg-[#C8A464] text-[#121316] font-semibold"
                          : "border-white/20 bg-black/60 text-white/85 hover:border-white/50"
                      }`}
                    >
                      <span className="block font-mono text-[10px] tracking-[0.2em]">
                        CHAPTER {ROMAN_NUMERALS[idx] || idx + 1}
                      </span>
                      <span className="block font-serif text-sm truncate mt-0.5">
                        {reg.city || reg.name.split("&")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {leadTour && (
                <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#DEC089]">
                      FEATURED PRIVATE COMMISSION:
                    </span>
                    <span className="font-serif text-lg text-white">
                      {leadTour.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-xl text-[#DEC089] tabular-nums">
                      {formatPrice(leadTour.price)}
                    </span>
                    <Link
                      href={`/book/${leadTour.id}`}
                      className="underline underline-offset-4 uppercase tracking-[0.16em] text-[11px] text-white hover:text-[#DEC089]"
                    >
                      Reserve Private Date →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
