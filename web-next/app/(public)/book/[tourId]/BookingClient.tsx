"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingClient({ tourId }: { tourId: string }) {
  const { t } = useLanguage();

  return (
    <main className="pt-20 pb-24 bg-background min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-border bg-card">
        <div className="container py-3 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-text-secondary tabular-nums">
          <Link
            href={`/tours/${tourId}`}
            className="inline-flex items-center gap-2 text-foreground hover:text-primary font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO EXPEDITION DOSSIER</span>
          </Link>
          <span>RESERVATION LEDGER · GALATA DISPATCH</span>
        </div>
      </div>

      {/* Editorial Header */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-kicker block">
              EXPEDITION RESERVATION & GUEST MANIFEST
            </span>
            <h1 className="font-serif text-foreground">
              {t.booking.title}
            </h1>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              {t.booking.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <BookingForm preselectedTourId={tourId} />
        </div>
      </section>
    </main>
  );
}
