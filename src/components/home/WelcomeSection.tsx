
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeSection() {
  const { t } = useLanguage();

  return (
    <section id="welcome" className="section">
      <div className="container">
        <div className="bg-gradient-to-b from-background to-surface-elevated rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in [animation-delay:100ms]">
              <div className="inline-flex items-center px-3 py-1 bg-accent-vibrant/10 text-accent-vibrant rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4 mr-2" />
                {t?.home?.welcome?.subtitle || 'Premium Experience'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-text-primary to-accent-vibrant bg-clip-text text-transparent">
                {t?.home?.welcome?.title || 'Welcome to Our Resort'}
              </h2>
              <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                {t?.home?.welcome?.description1 || 'Experience luxury and comfort in our beautiful seaside resort.'}
              </p>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                {t?.home?.welcome?.description2 || 'Create unforgettable memories with your loved ones.'}
              </p>
              <Button asChild variant="vibrant" size="lg" className="group">
                <Link to="/about">
                  {t?.home?.welcome?.learnMore || 'Learn More'} 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="relative animate-fade-in [animation-delay:300ms]">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hover:shadow-accent-vibrant/20 transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop"
                  alt="Seaside view" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 rounded-2xl overflow-hidden shadow-xl border-4 border-background">
                <img 
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
                  alt="Luxury apartment interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-background">
                <img 
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop"
                  alt="Pool view" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Shield className="h-6 w-6 text-accent-emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
