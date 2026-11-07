import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import ToursSection from "@/components/home/ToursSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinationsSection />
      <ToursSection />
      <WelcomeSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
