"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeSection() {
  const { t } = useLanguage();

  return (
    <section
      id="welcome"
      className="section bg-card border-b border-border"
    >
      <div className="container">
        {/* Top Editorial Essay Kicker */}
        <div className="pb-10 border-b border-border flex flex-wrap items-baseline justify-between gap-4">
          <span className="editorial-kicker">
            03 — EDITORIAL ESSAY & ROUTE PHILOSOPHY
          </span>
          <span className="editorial-meta">
            FIELD METHODOLOGY · SMALL-GROUP & PRIVATE STEWARDSHIP
          </span>
        </div>

        {/* 12-Column Asymmetric Magazine Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-b border-border bg-background">
          {/* Left 5 Columns: Pull-Quote & Tabular Field Parameters */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-semibold block">
                {t.home.welcome.subtitle}
              </span>
              <h2 className="font-serif text-foreground leading-[1.03]">
                {t.home.welcome.title}
              </h2>
              <blockquote className="border-l-2 border-primary pl-5 py-1 font-serif italic text-xl sm:text-2xl text-foreground/90 leading-snug">
                &ldquo;To cross Anatolia properly is to read its stratigraphy at walking pace—limestone porticos at dawn, volcanic valleys at dusk, and long tables where recipes outlast empires.&rdquo;
              </blockquote>
            </div>

            {/* Tabular Program Specifications */}
            <dl className="divide-y divide-border border-t border-b border-border text-xs tabular-nums">
              <div className="py-4 grid grid-cols-12 gap-4">
                <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                  01 / Group Ceiling
                </dt>
                <dd className="col-span-7 text-foreground font-medium">
                  8 to 12 guests maximum per scheduled departure
                </dd>
              </div>
              <div className="py-4 grid grid-cols-12 gap-4">
                <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                  02 / Site Timing
                </dt>
                <dd className="col-span-7 text-foreground font-medium">
                  08:00 dawn entries ahead of highway coach arrivals
                </dd>
              </div>
              <div className="py-4 grid grid-cols-12 gap-4">
                <dt className="col-span-5 uppercase tracking-[0.14em] text-primary font-semibold">
                  03 / Leadership
                </dt>
                <dd className="col-span-7 text-foreground font-medium">
                  Licensed archaeologists, architectural historians & regional specialists
                </dd>
              </div>
            </dl>
          </div>

          {/* Right 7 Columns: Asymmetric Diptych Plates & Editorial Prose */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-10">
            {/* Diptych Photographic Composition */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
              <figure className="sm:col-span-7 border border-border bg-card">
                <div className="aspect-[4/5] overflow-hidden bg-foreground">
                  <img
                    src="https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1200&q=85"
                    alt="Second-century Roman facade of the Library of Celsus at Ephesus, Selçuk, Türkiye"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="p-3.5 border-t border-border flex items-center justify-between text-[11px] uppercase tracking-[0.13em] text-text-secondary tabular-nums">
                  <span>PLATE II — EPHESUS, SELÇUK</span>
                  <span>08:15 MORNING ENTRY</span>
                </figcaption>
              </figure>

              <figure className="sm:col-span-5 border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-foreground">
                  <img
                    src="https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=900&q=80"
                    alt="Limestone rooftops of Mardin overlooking the Mesopotamian plain"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="p-3.5 border-t border-border text-[11px] uppercase tracking-[0.13em] text-text-secondary tabular-nums">
                  <span>PLATE III — OLD MARDİN RIDGE</span>
                </figcaption>
              </figure>
            </div>

            {/* Two-Column Editorial Prose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {t.home.welcome.description1}
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {t.home.welcome.description2}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <span className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">
                ARCHIVE DISPATCH · GALATA PLANNING DESK
              </span>
              <div className="flex flex-wrap gap-3">
                <Link href="/destinations" className="btn-outline py-3 px-5">
                  {t.home.welcome.learnMore}
                </Link>
                <Link href="/tours" className="btn-primary py-3 px-5">
                  <span>{t.home.welcome.cta}</span>
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
