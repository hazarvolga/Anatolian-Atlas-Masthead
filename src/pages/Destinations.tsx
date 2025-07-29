import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDestinations } from "@/hooks/useDestinations";
import { useTours } from "@/hooks/useTours";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/destinations/HeroSection";
import OverviewSection from "@/components/destinations/OverviewSection";
import DestinationsListSection from "@/components/destinations/DestinationsListSection";
import FeaturedToursCarousel from "@/components/destinations/FeaturedToursCarousel";
import ContactSection from "@/components/destinations/ContactSection";

export default function Destinations() {
  const { t } = useLanguage();
  const { data: destinations = [], isLoading: destinationsLoading } = useDestinations();
  const { data: tours = [], isLoading: toursLoading } = useTours();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (destinationsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-16">
          <div className="container">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading destinations...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        <HeroSection />
        <OverviewSection />
        {/* <FeaturedExperiencesSection /> kaldırıldı */}
        {/* <EphesusSection /> kaldırıldı */}
        <DestinationsListSection destinations={destinations} />
        <FeaturedToursCarousel tours={tours} isLoading={toursLoading} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
