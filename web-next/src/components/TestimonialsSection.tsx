"use client";

import { Compass, ShieldCheck, BookOpen, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const standards = [
    {
      number: "01",
      icon: BookOpen,
      title: t.home.expertGuides,
      description: t.home.expertGuidesDesc,
    },
    {
      number: "02",
      icon: Compass,
      title: t.home.personalizedService,
      description: t.home.personalizedServiceDesc,
    },
    {
      number: "03",
      icon: Clock,
      title: t.home.luxuryAccommodation,
      description: t.home.luxuryAccommodationDesc,
    },
    {
      number: "04",
      icon: ShieldCheck,
      title: t.home.safeTravels,
      description: t.home.safeTravelsDesc,
    },
  ];

  return (
    <section className="section bg-muted/35 border-b border-border">
      <div className="container">
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="editorial-kicker block">
            04 — FIELD STANDARDS & STEWARDSHIP
          </span>
          <h2 className="font-serif text-foreground">
            {t.home.whyChooseUs}
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            {t.home.whyChooseUsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="bg-card p-6 rounded-lg border border-border flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.number}
                  </span>
                  <Icon className="h-5 w-5 text-foreground/80" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
