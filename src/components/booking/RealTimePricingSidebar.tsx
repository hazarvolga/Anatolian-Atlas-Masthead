
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface PricingBreakdown {
  basePrice: number;
  roomPrice: number;
  addOnsPrice: number;
  discounts: number;
  taxes: number;
  total: number;
  breakdown: {
    item: string;
    price: number;
    type: 'base' | 'room' | 'addon' | 'discount' | 'tax';
  }[];
}

interface RealTimePricingSidebarProps {
  pricing: PricingBreakdown;
  checkInDate?: Date;
  checkOutDate?: Date;
  totalGuests: number;
  totalNights: number;
  isLoading: boolean;
  selectedTour?: any;
}

export default function RealTimePricingSidebar({
  pricing,
  checkInDate,
  checkOutDate,
  totalGuests,
  totalNights,
  isLoading,
  selectedTour
}: RealTimePricingSidebarProps) {
  console.log('RealTimePricingSidebar - Received props:', {
    selectedTour: selectedTour?.name,
    pricingTotal: pricing.total,
    isLoading,
    totalGuests
  });

  // Enhanced duration display logic
  const getDurationDisplay = () => {
    if (!selectedTour?.duration) return 'Unknown duration';
    
    const duration = parseInt(selectedTour.duration);
    if (duration === 1) {
      return '1 day';
    } else if (duration < 24) {
      return `${duration} hours`;
    } else {
      const days = Math.floor(duration / 24);
      const hours = duration % 24;
      if (hours === 0) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      } else {
        return `${days} ${days === 1 ? 'day' : 'days'} ${hours}h`;
      }
    }
  };

  // Enhanced tour type display
  const getTourTypeDisplay = () => {
    if (!selectedTour) return '';
    
    const duration = selectedTour.duration;
    const tourType = selectedTour.tour_type;
    const requiresAccommodation = selectedTour.requires_accommodation;
    
    if (duration > 1 || tourType === 'multiple_day' || tourType === 'date_range' || requiresAccommodation) {
      return 'Multi-day Tour';
    } else {
      return 'Day Tour';
    }
  };

  return (
    <div className="space-y-4 sticky top-4">
      {/* Tour Info Card */}
      {selectedTour && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-1 text-primary" />
              <div className="flex-1">
                <CardTitle className="text-lg leading-tight">{selectedTour.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedTour.location}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <Badge variant="outline">{getDurationDisplay()}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="secondary">{getTourTypeDisplay()}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary Card */}
      {checkInDate && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span className="font-medium">{format(checkInDate, "MMM dd, yyyy")}</span>
              </div>
              {checkOutDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">{format(checkOutDate, "MMM dd, yyyy")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Guests:
                </span>
                <span className="font-medium">{totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}</span>
              </div>
              {totalNights > 1 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights:</span>
                  <span className="font-medium">{totalNights} {totalNights === 1 ? 'night' : 'nights'}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Breakdown Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          ) : pricing.total > 0 ? (
            <div className="space-y-3">
              {pricing.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className={item.type === 'discount' ? 'text-green-600' : 'text-muted-foreground'}>
                    {item.item}
                  </span>
                  <span className={`font-medium ${item.type === 'discount' ? 'text-green-600' : ''}`}>
                    {item.price < 0 ? '-' : ''}${Math.abs(item.price).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Select your travel details to see pricing
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
