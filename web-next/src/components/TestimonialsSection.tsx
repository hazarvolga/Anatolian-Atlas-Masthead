"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const FIELD_DISPATCHES = [
  {
    ref: "DISPATCH 01 / AEGEAN",
    quote:
      "Entering the Terrace Houses at Ephesus at 08:15 with an architectural historian transformed what is usually a crowded monument into an intimate seminar on Roman domestic life.",
    author: "Dr. Clara Lindqvist & Henrik Lindqvist",
    origin: "Stockholm — Ephesus & Aegean Table Route",
    season: "October Departure",
  },
  {
    ref: "DISPATCH 02 / PLATEAU",
    quote:
      "The pacing in Cappadocia avoided every tourist bottleneck. Walking Red Valley at late afternoon while the tuff cliffs turned copper before dinner in Mustafapaşa was unforgettable.",
    author: "Julian & Eleanor Vance",
    origin: "London — Cappadocia Tuff Valleys & Monasteries",
    season: "May Departure",
  },
  {
    ref: "DISPATCH 03 / LYCIA",
    quote:
      "From the cedar uplands above Kaş to the sunken ruins at Kekova, the balance between coastal footpaths, wooden gulet crossings, and quiet stone inns felt effortlessly curated.",
    author: "Marc-Antoine Moreau",
    origin: "Lyon — Lycian Coast & Sunken Cities",
    season: "September Departure",
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const standards = [
    {
      number: "01",
      title: t.home.expertGuides,
      description: t.home.expertGuidesDesc,
    },
    {
      number: "02",
      title: t.home.personalizedService,
      description: t.home.personalizedServiceDesc,
    },
    {
      number: "03",
      title: t.home.luxuryAccommodation,
      description: t.home.luxuryAccommodationDesc,
    },
    {
      number: "04",
      title: t.home.safeTravels,
      description: t.home.safeTravelsDesc,
    },
  ];

  return (
    <section className="section bg-background border-b border-border">
      <div className="container">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-border items-end">
          <div className="lg:col-span-7 space-y-3">
            <span className="editorial-kicker block">
              04 — FIELD NOTES & STEWARDSHIP STANDARDS
            </span>
            <h2 className="font-serif text-foreground">
              {t.home.whyChooseUs}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-text-secondary text-sm md:text-base lg:text-right">
              {t.home.whyChooseUsSubtitle}
            </p>
          </div>
        </div>

        {/* Top Row: Traveler Field Notes (Editorial Dispatches — No Fake Stars) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-x border-b border-border divide-y lg:divide-y-0 lg:divide-x divide-border bg-card">
          {FIELD_DISPATCHES.map((note) => (
            <article
              key={note.ref}
              className="p-8 sm:p-10 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-primary font-semibold tabular-nums">
                  <span>{note.ref}</span>
                  <span className="text-text-secondary font-normal">
                    {note.season}
                  </span>
                </div>
                <p className="font-serif text-xl text-foreground leading-relaxed">
                  &ldquo;{note.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border text-xs">
                <span className="font-semibold text-foreground block">
                  {note.author}
                </span>
                <span className="text-text-secondary">{note.origin}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Row: 4-Column Architectural Stewardship Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-x border-b border-border divide-y md:divide-y-0 md:divide-x divide-border bg-background">
          {standards.map((item) => (
            <div
              key={item.number}
              className="p-6 sm:p-8 flex flex-col justify-between space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary tabular-nums">
                  STANDARD {item.number}
                </span>
                <span className="w-1.5 h-1.5 bg-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
