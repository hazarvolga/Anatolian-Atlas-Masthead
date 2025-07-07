
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface TourKeyInfoProps {
  tour: {
    duration: number;
    max_group_size: number;
    difficulty?: string;
  };
}

export default function TourKeyInfo({ tour }: TourKeyInfoProps) {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t.tourDetail.highlights}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.tourDetail.duration}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {tour.duration} {t.tours.days}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.tourDetail.groupSize}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {tour.max_group_size} {t.tourDetail.people}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {tour.difficulty || 'Easy'}
            </Badge>
            <h3 className="font-semibold mt-3">{t.tourDetail.difficulty}</h3>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
