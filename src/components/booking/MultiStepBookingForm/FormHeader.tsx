import { useTranslations } from "@/hooks/useTranslations";

interface FormHeaderProps {
  tourName?: string;
}

export default function FormHeader({ tourName }: FormHeaderProps) {
  const { data: translations } = useTranslations();

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations?.reduce((obj: any, item: any) => {
      return { ...obj, [item.key]: item.value };
    }, {});
    
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold mb-2">
        {tourName ? `${t('booking.bookTour')} ${tourName}` : t('booking.bookYourTour')}
      </h2>
      <p className="text-muted-foreground">
        {t('booking.completeBookingSteps')}
      </p>
    </div>
  );
}
