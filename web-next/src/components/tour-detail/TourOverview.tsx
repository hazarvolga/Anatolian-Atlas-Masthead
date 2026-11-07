
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface TourOverviewProps {
  description: string;
}

export default function TourOverview({ description }: TourOverviewProps) {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{t.tourDetail.overview}</h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description || "Experience an amazing tour with breathtaking views and unforgettable memories."}
      </p>
    </section>
  );
}
