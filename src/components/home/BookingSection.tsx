
import BookingForm from "@/components/BookingForm";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingSection() {
  const { t } = useLanguage();

  // Default benefits array in case translation is not available
  const defaultBenefits = [
    'Instant confirmation',
    'Best price guarantee', 
    '24/7 support',
    'Free cancellation'
  ];

  // Safely get benefits with fallback
  const benefits = t?.home?.booking?.benefits || defaultBenefits;
  
  // Ensure benefits is always an array
  const safeBenefits = Array.isArray(benefits) ? benefits : defaultBenefits;

  return (
    <section className="relative py-24 bg-gradient-to-br from-accent-vibrant/5 via-surface-elevated to-accent-coral/5 overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-accent-vibrant/20 to-accent-coral/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-accent-emerald/20 to-accent-vibrant/20 rounded-full blur-3xl opacity-60" />
      {/* Kutuya alınmış içerik */}
      <div className="container relative z-10">
        <div className="bg-gradient-to-b from-background to-surface-elevated rounded-2xl shadow-lg px-6 py-10 md:px-10 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-3 py-1 bg-accent-coral/10 text-accent-coral rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                {t?.home?.booking?.subtitle || 'Easy Booking'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-text-primary to-accent-coral bg-clip-text text-transparent">
                {t?.home?.booking?.title || 'Book Your Stay'}
              </h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                {t?.home?.booking?.description || 'Simple and secure booking process for your perfect vacation.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {safeBenefits.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-background/50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center mr-3 flex-shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-fade-in [animation-delay:200ms]">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
