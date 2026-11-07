
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TourCard from "@/components/TourCard";

// Daha kapsamlı Tour tipi, minimum alanlar hatasını engelle
interface Tour {
  id: string;
  name: string;
  price: number;
  duration: number;
  max_group_size: number;
  description?: string;
  image_url?: string;
  location?: string;
  highlights?: string[];
  rating?: number;
  difficulty?: string;
  tour_type?: "one_day" | "multiple_day" | "date_range";
  destinations?: any;
  [key: string]: any; // Diğer alanlar serbest
}

interface FeaturedToursCarouselProps {
  tours: Tour[];
  isLoading: boolean;
}

export default function FeaturedToursCarousel({ tours, isLoading }: FeaturedToursCarouselProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Tours</h2>
          <p className="text-xl text-muted-foreground">
            Browse our most popular tours and experiences
          </p>
        </div>
        {!isLoading && tours.length > 0 && (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {tours.slice(0, 6).map((tour) => (
                  <CarouselItem key={tour.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <TourCard tour={tour} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
        {tours.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tours available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
