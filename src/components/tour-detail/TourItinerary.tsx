
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

interface TourItineraryProps {
  itinerary: ItineraryItem[];
}

export default function TourItinerary({ itinerary }: TourItineraryProps) {
  if (itinerary.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
      <div className="space-y-4">
        {itinerary.sort((a, b) => a.day - b.day).map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Badge variant="outline" className="mt-1">
                  Day {item.day}
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
