import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTours } from "@/hooks/useTours";
import { useDestinations } from "@/hooks/useDestinations";
import { TourProps } from "@/types/tour";
import ToursHeader from "@/components/tours/ToursHeader";
import ToursGrid from "@/components/tours/ToursGrid";
import TourFilters from "@/components/tours/TourFilters";

// Not: Yalnızca zorunlu olanlar filtre türleri; extra bir hook olmadan yönetilecek.
// Tüm destinasyonlar DB'den alınacak.

export default function Tours() {
  const { data: tours = [], isLoading } = useTours();

  // --- DİKKAT: Tüm aktif destinasyonları alın: ---
  const { data: allDestinations = [] } = useDestinations();

  // Build hataları için uygun typeları kullan:
  const [groupSizeFilter, setGroupSizeFilter] = useState<string>("all");
  // Adjust the type: allow string, but cast in setter for type compatibility with child components
  const [difficultyFilter, setDifficultyFilterRaw] = useState<"all" | "easy" | "moderate" | "challenging">("all");
  // Wrap setter so it can be called as (value: string) => void
  const setDifficultyFilter = (value: string) => {
    setDifficultyFilterRaw(value as "all" | "easy" | "moderate" | "challenging");
  };
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Maksimum fiyatı otomatize et
  useEffect(() => {
    if (tours.length > 0) {
      const prices = tours.map((t: any) => typeof t.price === "number" ? t.price : 0);
      const maxTourPrice = Math.ceil(Math.max(...prices) / 100) * 100;
      setMaxPrice(maxTourPrice);
      setPriceRange([0, maxTourPrice]);
    }
  }, [tours]);

  // Filtrelenmiş turlar: Map results into correct TourProps, especially the 'difficulty' field
  const filteredTours = useMemo(() => {
    return tours
      .map((tour: any) => ({
        ...tour,
        // with a safe enum cast
        difficulty: ["easy", "moderate", "challenging"].includes(tour.difficulty)
          ? (tour.difficulty as "easy" | "moderate" | "challenging")
          : "easy", // fallback if DB has unexpected value
      }))
      .filter((tour: any) => {
        if (groupSizeFilter !== "all" && tour.max_group_size < Number(groupSizeFilter)) return false;
        if (difficultyFilter !== "all" && tour.difficulty !== difficultyFilter) return false;
        if (destinationFilter !== "all" && tour.destinations?.id !== destinationFilter) return false;
        if (typeof tour.price !== "number" || tour.price < priceRange[0] || tour.price > priceRange[1]) return false;
        return true;
      });
  }, [tours, groupSizeFilter, difficultyFilter, destinationFilter, priceRange]);

  // Filtreleri sıfırla
  const handleResetFilters = () => {
    setGroupSizeFilter("all");
    setDifficultyFilter("all");
    setDestinationFilter("all");
    setPriceRange([0, maxPrice]);
  };

  // --- Destinasyon filtre menüsünde tam destinasyon: ---
  // {id, name} tipine dönüştürüyoruz (empty-check dahil)
  const destinations = useMemo(
    () =>
      (Array.isArray(allDestinations)
        ? allDestinations.map((d: any) => ({
            id: d.id,
            name: d.name,
          }))
        : []),
    [allDestinations]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        <ToursHeader />
        <TourFilters
          groupSizeFilter={groupSizeFilter}
          setGroupSizeFilter={setGroupSizeFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          destinationFilter={destinationFilter}
          setDestinationFilter={setDestinationFilter}
          priceRange={priceRange}
          setPriceRange={(value) => setPriceRange([value[0], value[1]])}
          maxPrice={maxPrice}
          destinations={destinations}
          filteredCount={filteredTours.length}
          totalCount={tours.length}
          onResetFilters={handleResetFilters}
        />
        <ToursGrid tours={filteredTours} onResetFilters={handleResetFilters} />
      </main>
      <Footer />
    </div>
  );
}
