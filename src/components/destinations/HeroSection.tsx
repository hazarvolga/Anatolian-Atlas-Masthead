
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 bg-gradient-to-r from-primary/10 to-sea-light/20">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Turkey's Magic
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Experience Turkey's stunning landscapes, rich heritage, and vibrant culture from Istanbul to the Aegean coast.
          </p>
        </div>
      </div>
    </section>
  );
}
