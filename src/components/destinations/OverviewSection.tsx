
import { Button } from "@/components/ui/button";

export default function OverviewSection() {
  return (
    <section className="section bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* SOL SÜTUN: GÖRSEL */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop"
              alt="Ancient ruins of Ephesus"
              className="w-full h-full object-cover"
            />
          </div>

          {/* SAĞ SÜTUN: METİNLER */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Unveiling Turkey's Top Destinations</h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Embark on a cruise along the famous Bosphorus Strait, keeping an eye out for the rich history that lines its shores. Visit the iconic Topkapi Palace, overlooking the strait, and uncover its royal past and stunning panoramic views.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Journey south to the coastal beauty of Bodrum, renowned for its ancient ruins, crystal-clear waters, and vibrant nightlife. Explore the awe-inspiring Castle of St. Peter, stroll through the ancient Mausoleum of Halicarnassus, and relax at the serene beaches. Savor a traditional Turkish dinner featuring local specialties like fresh seafood and meze.
              </p>
              <h3 className="text-2xl font-bold mt-6 mb-2">Travel through the timelessly beautiful Ephesus</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Continue to Selçuk, nestled near the ancient city of Ephesus, one of Turkey's most iconic archaeological sites. Explore the town and enjoy optional activities such as hiking to the House of the Virgin Mary, cycling through lush countryside, or visiting the nearby Şirince village, famous for its wines and charming streets.
              </p>
              <Button className="btn-primary mt-2" size="lg">Start Your Trip Here</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
