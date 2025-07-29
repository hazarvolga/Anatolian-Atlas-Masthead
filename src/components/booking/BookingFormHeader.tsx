
import { useLanguage } from "@/contexts/LanguageContext";

export default function BookingFormHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold mb-2">{t.booking.title}</h2>
      <p className="text-muted-foreground">Complete booking system with room selection and add-ons</p>
    </div>
  );
}
