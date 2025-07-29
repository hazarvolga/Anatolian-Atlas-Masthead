
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Destination {
  id: string;
  name: string;
}

interface TourFiltersProps {
  groupSizeFilter: string;
  setGroupSizeFilter: (value: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (value: string) => void;
  destinationFilter: string;
  setDestinationFilter: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  maxPrice: number;
  destinations: Destination[];
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export default function TourFilters({
  groupSizeFilter,
  setGroupSizeFilter,
  difficultyFilter,
  setDifficultyFilter,
  destinationFilter,
  setDestinationFilter,
  priceRange,
  setPriceRange,
  maxPrice,
  destinations,
  filteredCount,
  totalCount,
  onResetFilters
}: TourFiltersProps) {
  return (
    <section className="py-8 border-b">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          {/* Destination Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Destinasyon
            </label>
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tüm destinasyonlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm destinasyonlar</SelectItem>
                {destinations.map((destination) => (
                  <SelectItem key={destination.id} value={destination.id}>
                    {destination.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Size Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Group Size
            </label>
            <Select value={groupSizeFilter} onValueChange={setGroupSizeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any size</SelectItem>
                <SelectItem value="8">Small (8+)</SelectItem>
                <SelectItem value="12">Medium (12+)</SelectItem>
                <SelectItem value="15">Large (15+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty
            </label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range: €{priceRange[0]} - €{priceRange[1]}
            </label>
            <Slider
              min={0}
              max={maxPrice}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 animate-fade-in [animation-delay:200ms]">
          <p className="text-muted-foreground">
            Showing {filteredCount} of {totalCount} tours
          </p>
          <Button 
            variant="outline" 
            onClick={onResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </section>
  );
}
