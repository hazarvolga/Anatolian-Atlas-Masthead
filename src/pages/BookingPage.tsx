import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingPage() {
  const { t } = useLanguage();
  const { tourId } = useParams<{ tourId: string }>();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16">
        {/* Header Section */}
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
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-10">
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute top-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        
        {/* Booking Form Section */}
        <section className="section">
          <div className="px-4 md:px-6 lg:px-8 mx-auto">
            <div className="max-w-2xl mx-auto">
              <BookingForm preselectedTourId={tourId} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
