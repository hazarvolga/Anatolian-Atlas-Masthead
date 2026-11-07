"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-atlas-ink text-atlas-paper">
      <div className="container">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary block">
            05 — DISPATCH & RESERVATIONS
          </span>
          <h2 className="font-serif text-atlas-paper text-3xl md:text-5xl leading-tight">
            {t?.home?.cta?.title || "Begin with a region that calls to you"}
          </h2>
          <p className="text-lg text-atlas-paper/80 leading-relaxed max-w-2xl">
            {t?.home?.cta?.description ||
              "Browse our scheduled small-group departures or speak with our planning desk in Galata, İstanbul."}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-7"
            >
              <Link href="/tours" className="inline-flex items-center">
                <span>{t?.home?.cta?.bookNow || "Explore Journeys"}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-atlas-paper/30 text-atlas-paper bg-transparent hover:bg-atlas-paper/10 h-12 px-7"
            >
              <Link href="/contact" className="inline-flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact Galata Desk</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
