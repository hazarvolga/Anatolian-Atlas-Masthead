import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar, Users, Bed, CreditCard, MapPin } from "lucide-react";
import TourDetailsCard from "./TourDetailsCard";
import DateDetailsCard from "./DateDetailsCard";
import GuestDetailsCard from "./GuestDetailsCard";
import RoomDetailsCard from "./RoomDetailsCard";
import PriceSummaryCard from "./PriceSummaryCard";

interface ReviewStepProps {
  selectedTour: any;
  checkInDate?: Date;
  checkOutDate?: Date;
  adults: number;
  children: number;
  rooms: any[];
  pricing: any;
  pricingLoading: boolean;
}

export default function ReviewStep({
  selectedTour,
  checkInDate,
  checkOutDate,
  adults,
  children,
  rooms,
  pricing,
  pricingLoading
}: ReviewStepProps) {
  // Enhanced tour type determination logic
  const getTourTypeDisplay = () => {
    if (!selectedTour) return 'Unknown';
    
    const tourType = selectedTour.tour_type;
    const requiresAccommodation = selectedTour.requires_accommodation;
    
    switch (tourType) {
      case 'multiple_day':
        return 'Multiple Day Tour';
      case 'one_day':
        return 'One Day Tour';
      case 'date_range':
        return 'Date Range Tour';
      default:
        return requiresAccommodation ? 'Multiple Day Tour' : 'One Day Tour';
    }
  };

  // Enhanced duration display - only for one day tours
  const getDurationDisplay = () => {
    if (!selectedTour?.duration || selectedTour.tour_type !== 'one_day') return '';
    
    const duration = parseInt(selectedTour.duration);
    if (duration < 24) {
      return duration === 1 ? '1 hour' : `${duration} hours`;
    }
    return '';
  };

  const isMultiDayTour = selectedTour?.tour_type === 'multiple_day' || selectedTour?.tour_type === 'date_range';
  
  // Multi-day turlar için oda seçiminden toplam yolcu sayısı hesaplanmalı
  let guestCounts = { adults, children };
  if (isMultiDayTour && rooms.length > 0) {
    guestCounts = rooms.reduce(
      (total, room) => ({
        adults: total.adults + (room.adults || 0),
        children: total.children + (room.children || 0),
      }), 
      { adults: 0, children: 0 }
    );
  }
  const totalGuests = guestCounts.adults + guestCounts.children;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Review Your Booking</h3>
        <p className="text-muted-foreground">
          Please review all details before proceeding to payment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TourDetailsCard
          selectedTour={selectedTour}
          getTourTypeDisplay={getTourTypeDisplay}
          getDurationDisplay={getDurationDisplay}
        />

        <DateDetailsCard
          isMultiDayTour={isMultiDayTour}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
        />

        {/* Tek günlük turlar için misafir detaylarını göster */}
        {!isMultiDayTour && (
          <GuestDetailsCard
            adults={adults}
            children={children}
            totalGuests={adults + children}
          />
        )}

        {/* Çok günlük turlar için sadece oda detaylarını göster */}
        {isMultiDayTour && rooms.length > 0 && (
          <RoomDetailsCard rooms={rooms} />
        )}

        <PriceSummaryCard
          pricing={pricing}
          pricingLoading={pricingLoading}
        />
      </div>
    </div>
  );
}
