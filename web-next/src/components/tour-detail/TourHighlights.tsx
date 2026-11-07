
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface TourHighlightsProps {
  highlights: string[];
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  const { t } = useLanguage();

  if (!highlights || highlights.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t.tourDetail.includes}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            <span>{highlight}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
