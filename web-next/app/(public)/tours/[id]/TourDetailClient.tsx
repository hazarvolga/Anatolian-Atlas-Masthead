"use client";

import Link from "next/link";
import { useTour } from "@/hooks/useTours";
import { Button } from "@/components/ui/button";
import TourHeroSection from "@/components/tour-detail/TourHeroSection";
import TourOverview from "@/components/tour-detail/TourOverview";
import TourKeyInfo from "@/components/tour-detail/TourKeyInfo";
import TourBenefits from "@/components/tour-detail/TourBenefits";
import TourHighlights from "@/components/tour-detail/TourHighlights";
import TourItinerary from "@/components/tour-detail/TourItinerary";
import TourReviews from "@/components/tour-detail/TourReviews";
import TourPricingSidebar from "@/components/tour-detail/TourPricingSidebar";
import TourBasicInfoCard from "@/components/tour-detail/TourBasicInfoCard";
import TourIncludedExcluded from "@/components/tour-detail/TourIncludedExcluded";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Type definition for itinerary items
interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

/**
 * The API returns the tour in its database shape (title, price_adult,
 * duration_hours, max_participants, includes, images). The legacy detail page
 * read UI field names directly, so title/price rendered blank against the
 * current backend. Normalise the payload here the same way useTours does.
 */
function normaliseTour(raw: any) {
  if (!raw) return null;

  const destination = raw.destination;
  const location = destination
    ? [destination.name, destination.city, destination.country]
        .filter(Boolean)
        .join(", ")
    : raw.location || "Unknown Location";

  return {
    ...raw,
    name: raw.title ?? raw.name,
    price:
      typeof raw.price_adult === "number"
        ? raw.price_adult
        : Number(raw.price) || 0,
    duration: raw.duration_hours ?? raw.duration,
    max_group_size: raw.max_participants ?? raw.max_group_size,
    image_url: Array.isArray(raw.images) ? raw.images[0] : raw.image_url,
    highlights: Array.isArray(raw.includes)
      ? raw.includes
      : Array.isArray(raw.highlights)
        ? raw.highlights
        : [],
    location,
  };
}

export default function TourDetailClient({ id }: { id: string }) {
  const { data: rawTour, isLoading, error } = useTour(id);
  const tour = normaliseTour(rawTour);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error("Tour detail error:", error);
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error loading tour
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || "An unexpected error occurred"}
          </p>
          <Button asChild variant="outline">
            <Link href="/tours">Back to Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tour Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The tour you&apos;re looking for doesn&apos;t exist or has been deactivated.
          </p>
          <Button asChild variant="outline">
            <Link href="/tours">Back to Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  const location = tour.location;

  // Safe type checking for benefits and itinerary
  const tourBenefits = Array.isArray(tour.benefits) ? (tour.benefits as string[]) : [];
  const tourItinerary = Array.isArray(tour.itinerary)
    ? (tour.itinerary as unknown as ItineraryItem[]).filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "day" in item &&
          "title" in item &&
          "description" in item
      )
    : [];

  return (
    <div className="pt-20">
      <TourHeroSection tour={tour} location={location} />

      <div className="container mx-auto px-4 py-12">
        {/* Yeni Ek Basic Info Kartı */}
        <TourBasicInfoCard
          tour={{
            name: tour.name,
            duration: tour.duration,
            price: tour.price,
            location: location,
            departure_location: tour.departure_location,
            departure_time: tour.departure_time,
            return_time: tour.return_time,
            tour_type: tour.tour_type,
            difficulty: tour.difficulty,
          }}
        />

        {/* Tabs Area for detail sections */}
        <div className="mb-10">
          <Tabs defaultValue="highlights" className="w-full">
            <TabsList className="flex w-full flex-wrap gap-2 mb-6 justify-start">
              <TabsTrigger value="highlights">Tour Highlights</TabsTrigger>
              <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
              <TabsTrigger value="excluded">What&apos;s Excluded</TabsTrigger>
              <TabsTrigger value="benefits">Tour Benefits</TabsTrigger>
              <TabsTrigger value="itinerary">Tour Itinerary</TabsTrigger>
            </TabsList>
            <TabsContent value="highlights">
              <TourHighlights highlights={tour.highlights} />
            </TabsContent>
            <TabsContent value="included">
              <TourIncludedExcluded included={Array.isArray(tour.included) ? tour.included : []} />
            </TabsContent>
            <TabsContent value="excluded">
              <TourIncludedExcluded excluded={Array.isArray(tour.excluded) ? tour.excluded : []} />
            </TabsContent>
            <TabsContent value="benefits">
              <TourBenefits benefits={tourBenefits} />
            </TabsContent>
            <TabsContent value="itinerary">
              <TourItinerary itinerary={tourItinerary} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TourOverview description={tour.description} />
            <TourKeyInfo tour={tour} />
            <TourReviews tourId={tour.id} />
          </div>

          {/* Sidebar */}
          <TourPricingSidebar tour={tour} />
        </div>
      </div>
    </div>
  );
}
