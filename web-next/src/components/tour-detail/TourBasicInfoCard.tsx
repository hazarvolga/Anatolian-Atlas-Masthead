
import { Badge } from "@/components/ui/badge";

interface TourBasicInfoCardProps {
  tour: {
    name: string;
    duration?: number;
    price?: number;
    location?: string;
    departure_location?: string;
    departure_time?: string;
    return_time?: string;
    tour_type?: string;
    difficulty?: string;
    // Ekstra Alanlar
  };
}

function getTourTypeLabel(type?: string) {
  if (!type) return "-";
  if (type === "one_day") return "One Day";
  if (type === "multiple_day") return "Multiple Day";
  if (type === "date_range") return "Date Range";
  return type;
}

function getDifficultyLabel(level?: string) {
  if (!level) return "-";
  if (level === "easy") return "Easy";
  if (level === "moderate") return "Moderate";
  if (level === "challenging") return "Challenging";
  return level;
}

export default function TourBasicInfoCard({ tour }: TourBasicInfoCardProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-muted/40 shadow p-6 mb-8 border border-accent/30 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-5">Tour Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Tour Name</span>
          <span className="font-semibold">{tour.name || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Duration</span>
          <span className="font-semibold">{typeof tour.duration === "number" ? `${tour.duration} hours` : "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Base Price</span>
          <span className="font-semibold">{typeof tour.price === "number" ? `$${tour.price}` : "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Location</span>
          <span className="font-semibold">{tour.location || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Departure Location</span>
          <span className="font-semibold">{tour.departure_location || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Departure Time</span>
          <span className="font-semibold">{tour.departure_time || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Return Time</span>
          <span className="font-semibold">{tour.return_time || "-"}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Tour Type</span>
          <Badge variant="secondary">{getTourTypeLabel(tour.tour_type)}</Badge>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-sm">Difficulty</span>
          <Badge variant="outline">{getDifficultyLabel(tour.difficulty)}</Badge>
        </div>
      </div>
    </div>
  );
}
