import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import ToursSection from "@/components/home/ToursSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <DestinationsSection />
      <ToursSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
