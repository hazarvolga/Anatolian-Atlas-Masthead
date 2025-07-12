import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import ToursSection from "@/components/home/ToursSection";
import CTASection from "@/components/home/CTASection";

export default function Index() {
  console.log('Index page rendering...');
  
  useEffect(() => {
    console.log('Index page mounted');
    window.scrollTo(0, 0);
  }, []);
  
  try {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <HeroSection />
          <WelcomeSection />
          <ToursSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Index page render error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Error</h1>
          <p>Something went wrong loading this page.</p>
          <p className="text-sm text-gray-600 mt-2">Error: {error?.message}</p>
        </div>
      </div>
    );
  }
}
