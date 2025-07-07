
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactSection() {
  return (
    <section className="section bg-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Book Your Tour</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Browse our example trips and get in contact to start planning your very own adventure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Choose your trip</h3>
              <Button asChild className="w-full btn-primary">
                <Link to="/tours">Browse All Tours</Link>
              </Button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Call us</h3>
              <div className="flex items-center justify-center text-primary font-semibold text-lg mb-4">
                <Phone className="h-5 w-5 mr-2" />
                +90 (531) 026 69 96
              </div>
              <p className="text-sm text-muted-foreground">We always aim to reply within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
