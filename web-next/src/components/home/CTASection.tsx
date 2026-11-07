"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteConfig } from "@/config/site";
import { SplitTextHeading, MagneticCTA } from "@/components/motion";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="bg-foreground text-background border-b border-background/15">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-background/15">
          {/* Left 8 Columns: High-Contrast Editorial Commission Statement */}
          <div className="lg:col-span-8 p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-background/15 space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-subtle block tabular-nums">
              05 — DISPATCH & BESPOKE ROUTE COMMISSIONING
            </span>
            <SplitTextHeading
              as="h2"
              text={t?.home?.cta?.title || "Begin with a region that calls to you"}
              className="font-serif text-background text-3xl sm:text-5xl lg:text-6xl leading-[1.02]"
            />
            <p className="text-base sm:text-lg text-background/75 leading-relaxed max-w-2xl">
              {t?.home?.cta?.description ||
                "Join a scheduled small-group departure or commission a private itinerary tailored by our route historians in Galata, İstanbul."}
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <MagneticCTA>
                <Link href="/tours" className="btn-primary">
                  <span>{t?.home?.cta?.bookNow || "Browse All Itineraries"}</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </MagneticCTA>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-background/35 text-background px-7 py-4 text-xs uppercase tracking-[0.14em] font-medium hover:bg-background hover:text-foreground transition-colors"
              >
                <span>Consult Galata Desk</span>
              </Link>
            </div>
          </div>

          {/* Right 4 Columns: Planning Desk Specifications */}
          <div className="lg:col-span-4 p-8 sm:p-12 flex flex-col justify-between bg-background/[0.03] space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary-subtle font-semibold block">
                GALATA PLANNING DESK
              </span>
              <p className="font-serif text-2xl text-background leading-snug">
                Direct route consultation & private departure dates.
              </p>
              <p className="text-xs text-background/70 leading-relaxed">
                {siteConfig.contact.hours}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-background/15 text-xs tabular-nums">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-background/80">
                  DISPATCH CHANNEL
                </span>
                <span className="text-background font-medium">
                  {siteConfig.contact.phone || "Direct Written Inquiry via Planning Desk"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.15em] text-background/80">
                  RESPONSE WINDOW
                </span>
                <span className="text-background font-medium">
                  {siteConfig.contact.email || siteConfig.contact.hours}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
