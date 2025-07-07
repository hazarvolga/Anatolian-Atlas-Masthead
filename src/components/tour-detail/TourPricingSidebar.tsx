
import { Link } from "react-router-dom";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface TourPricingSidebarProps {
  tour: {
    id: string;
    price: number;
    rating?: number;
    duration: number;
  };
}

export default function TourPricingSidebar({ tour }: TourPricingSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary mb-2">
              €{tour.price}
            </div>
            <p className="text-gray-600 dark:text-gray-300">per person</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t.tourDetail.rating}:</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{tour.rating || 4.5}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t.tourDetail.duration}:</span>
              <span className="font-medium">{tour.duration} {t.tours.days}</span>
            </div>
          </div>
          
          <Button asChild className="w-full" size="lg">
            <Link to={`/book/${tour.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              {t.tourDetail.bookTour}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
