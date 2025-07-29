
import { CheckCircle } from "lucide-react";

interface TourBenefitsProps {
  benefits: string[];
}

export default function TourBenefits({ benefits }: TourBenefitsProps) {
  if (benefits.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Tour Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
