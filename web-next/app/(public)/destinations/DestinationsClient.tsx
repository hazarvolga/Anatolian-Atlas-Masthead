"use client";

import { useDestinations } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import HeroSection from "@/components/destinations/HeroSection";
import OverviewSection from "@/components/destinations/OverviewSection";
import DestinationsListSection from "@/components/destinations/DestinationsListSection";
import FeaturedToursCarousel from "@/components/destinations/FeaturedToursCarousel";
import ContactSection from "@/components/destinations/ContactSection";

export default function DestinationsClient() {
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const { data: tours = [], isLoading: toursLoading } = useTours();

  if (destinationsLoading) {
    return (
      <div className="pt-32 pb-16">
        <div className="container">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading destinations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <HeroSection />
      <OverviewSection />
      {/* <FeaturedExperiencesSection /> kaldırıldı */}
      {/* <EphesusSection /> kaldırıldı */}
      <DestinationsListSection destinations={destinations} />
      <FeaturedToursCarousel tours={tours} isLoading={toursLoading} />
      <ContactSection />
    </div>
  );
}
