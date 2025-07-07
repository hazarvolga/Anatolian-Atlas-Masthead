
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-32 bg-gradient-to-br from-accent-vibrant via-accent-coral to-accent-emerald overflow-hidden">
      <div className="px-4 md:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t?.home?.cta?.title || 'Experience the Best'}
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            {t?.home?.cta?.description || 'Discover our luxurious resort and create unforgettable memories.'}
          </p>
          <Button asChild size="xl" variant="default" className="bg-white text-accent-vibrant hover:bg-white/90 shadow-2xl">
            <Link to="/booking" className="group">
              {t?.home?.cta?.bookNow || 'Book Now'} 
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float [animation-delay:-2s]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full animate-pulse-slow" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-24 fill-background"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,37.1L40,34.5C80,32,160,27,240,29.6C320,32,400,42,480,42.9C560,44,640,35,720,32.1C800,30,880,34,960,40.8C1040,47,1120,56,1200,56.6C1280,57,1360,48,1400,43.3L1440,39.1L1440,74L1400,74C1360,74,1280,74,1200,74C1120,74,1040,74,960,74C880,74,800,74,720,74C640,74,560,74,480,74C400,74,320,74,240,74C160,74,80,74,40,74L0,74Z"
            className="animate-wave opacity-50"
          />
          <path 
            d="M0,37.1L40,34.5C80,32,160,27,240,29.6C320,32,400,42,480,42.9C560,44,640,35,720,32.1C800,30,880,34,960,40.8C1040,47,1120,56,1200,56.6C1280,57,1360,48,1400,43.3L1440,39.1L1440,74L1400,74C1360,74,1280,74,1200,74C1120,74,1040,74,960,74C880,74,800,74,720,74C640,74,560,74,480,74C400,74,320,74,240,74C160,74,80,74,40,74L0,74Z"
            className="animate-wave opacity-100 [animation-delay:-4s]"
          />
        </svg>
      </div>
    </section>
  );
}
