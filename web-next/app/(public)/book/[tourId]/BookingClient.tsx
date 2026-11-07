"use client";

import BookingForm from "@/components/BookingForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingClient({ tourId }: { tourId: string }) {
  const { t } = useLanguage();

  return (
    <div className="pt-32 pb-16">
      <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
        <div className="px-4 md:px-6 lg:px-8 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t.booking.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {t.booking.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="px-4 md:px-6 lg:px-8 mx-auto">
          <div className="max-w-2xl mx-auto">
            <BookingForm preselectedTourId={tourId} />
          </div>
        </div>
      </section>
    </div>
  );
}
