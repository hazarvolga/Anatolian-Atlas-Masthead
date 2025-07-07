
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      if (!id) throw new Error('Tour ID required');
      
      console.log('Fetching tour with ID:', id);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tours/${id}`);
        return response.data;
      } catch (err: any) {
        console.error('Error fetching tour:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch tour');
      }
      
      console.log('Tour data received:', data);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.error('Tour detail error:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error loading tour
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            <Button asChild variant="outline">
              <Link to="/tours">Back to Tours</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tour Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The tour you're looking for doesn't exist or has been deactivated.
            </p>
            <Button asChild variant="outline">
              <Link to="/tours">Back to Tours</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const location = tour.destinations ? 
    `${tour.destinations.city}, ${tour.destinations.country}` : 
    tour.location || 'Unknown Location';

  // Safe type checking for benefits and itinerary
  const tourBenefits = Array.isArray(tour.benefits) ? tour.benefits as string[] : [];
  const tourItinerary = Array.isArray(tour.itinerary) ? 
    (tour.itinerary as unknown as ItineraryItem[]).filter(item => 
      item && typeof item === 'object' && 'day' in item && 'title' in item && 'description' in item
    ) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <TourHeroSection tour={tour} location={location} />

        <div className="container mx-auto px-4 py-12">
          {/* Yeni Ek Basic Info Kartı */}
          <TourBasicInfoCard tour={{
            name: tour.name,
            duration: tour.duration,
            price: tour.price,
            location: location,
            departure_location: tour.departure_location,
            departure_time: tour.departure_time,
            return_time: tour.return_time,
            tour_type: tour.tour_type,
            difficulty: tour.difficulty,
          }} />

          {/* Tabs Area for detail sections */}
          <div className="mb-10">
            <Tabs defaultValue="highlights" className="w-full">
              <TabsList className="flex w-full flex-wrap gap-2 mb-6 justify-start">
                <TabsTrigger value="highlights">Tour Highlights</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
                <TabsTrigger value="excluded">What's Excluded</TabsTrigger>
                <TabsTrigger value="benefits">Tour Benefits</TabsTrigger>
                <TabsTrigger value="itinerary">Tour Itinerary</TabsTrigger>
              </TabsList>
              <TabsContent value="highlights">
                <TourHighlights highlights={Array.isArray(tour.highlights) ? tour.highlights : []} />
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
              {/* Bu alan boş bırakıldı, içerik yukarıdaki tabsta */}
              {/* Alternatif ek açıklamalar veya özel bölümler eklenebilir */}
              <TourOverview description={tour.description} />
              <TourKeyInfo tour={tour} />
              <TourReviews tourId={tour.id} />
            </div>

            {/* Sidebar */}
            <TourPricingSidebar tour={tour} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
