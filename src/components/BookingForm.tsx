
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import ModernBookingForm from "@/components/booking/ModernBookingForm";
import MultiStepBookingForm from "@/components/booking/MultiStepBookingForm";

interface BookingFormProps {
  preselectedTourId?: string;
}

export default function BookingForm({ preselectedTourId }: BookingFormProps) {
  const { t } = useLanguage();
  const [useMultiStep, setUseMultiStep] = useState(true);
  
  return (
    <div className="max-w-6xl mx-auto">
      {!useMultiStep && (
        <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold">{t.booking.title}</h2>
          <div className="flex gap-2">
            <Badge 
              variant={useMultiStep ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setUseMultiStep(true)}
            >
              Step-by-Step
            </Badge>
            <Badge 
              variant={!useMultiStep ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setUseMultiStep(false)}
            >
              All-in-One
            </Badge>
          </div>
        </div>
      )}

      {useMultiStep ? (
        <MultiStepBookingForm preselectedTourId={preselectedTourId} />
      ) : (
        <ModernBookingForm preselectedTourId={preselectedTourId} />
      )}
    </div>
  );
}
