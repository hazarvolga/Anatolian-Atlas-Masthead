import { useLanguage } from "@/contexts/LanguageContext";

interface FormHeaderProps {
  tourName?: string;
}

export default function FormHeader({ tourName }: FormHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold mb-2">
        {tourName ? `${t.booking.bookTour} ${tourName}` : t.booking.bookYourTour}
      </h2>
      <p className="text-muted-foreground">
        {t.booking.completeBookingSteps}
      </p>
    </div>
  );
}
