import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OverviewSection() {
  return (
    <section className="section bg-background border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-card p-2 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1000&q=85"
                alt="Ancient marble ruins of Ephesus in Selçuk, Türkiye"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="editorial-kicker block">
              REGIONAL GEOGRAPHY
            </span>
            <h2 className="font-serif text-foreground">
              Tracing Türkiye&apos;s maritime straits, plateaus, and ancient cities
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              Cross the Bosphorus Strait between European and Asian neighborhoods,
              walk the marble avenues of Ephesus and Hierapolis, and follow
              monastic footpaths through the volcanic valleys of Cappadocia.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Further south and east, the limestone coves of the Lycian Way and
              the honey-stone courtyards of Mardin open onto millennia of
              Mediterranean and Mesopotamian history.
            </p>
            <div className="pt-2">
              <Button asChild className="btn-primary" size="lg">
                <Link href="/tours" className="inline-flex items-center">
                  <span>Browse Regional Journeys</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
