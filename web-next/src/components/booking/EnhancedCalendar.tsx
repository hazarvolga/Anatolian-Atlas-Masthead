"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, TrendingDown } from "lucide-react";
import { format, isSameDay, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useTourAvailability } from "@/hooks/useTours";

interface DatePricing {
  date: string;
  basePrice: number;
  availability: number;
  season: 'high' | 'shoulder' | 'low';
  discounts?: string[];
  minimumStay?: number;
}

interface EnhancedCalendarProps {
  tourId: string;
  checkInDate?: Date;
  onCheckInSelect: (date: Date) => void;
  isMultiDay?: boolean;
}

export default function EnhancedCalendar({
  tourId,
  checkInDate,
  onCheckInSelect,
  isMultiDay = false
}: EnhancedCalendarProps) {
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const { data: availability = [] } = useTourAvailability(tourId);

  const mockPricingData: DatePricing[] = [
    // This would normally come from your pricing API
    { date: '2024-06-15', basePrice: 299, availability: 8, season: 'high', discounts: ['early_bird'] },
    { date: '2024-06-16', basePrice: 259, availability: 12, season: 'shoulder' },
    { date: '2024-06-17', basePrice: 199, availability: 15, season: 'low', minimumStay: 3 },
  ];

  const getPricingForDate = (date: Date): DatePricing | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockPricingData.find(p => p.date === dateStr) || null;
  };

  const getSeasonColor = (season: 'high' | 'shoulder' | 'low') => {
    switch (season) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'shoulder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDateClick = (date: Date) => {
    onCheckInSelect(date);
  };

  const renderDayContent = (date: Date) => {
    const pricing = getPricingForDate(date);
    const isCheckIn = checkInDate && isSameDay(date, checkInDate);
    const isCheckOut = false;
    const isInRange = false;

    return (
      <div 
        className={cn(
          "relative w-full h-full flex flex-col items-center justify-center p-1 rounded-md cursor-pointer transition-all",
          isCheckIn && "bg-primary text-primary-foreground",
          isCheckOut && "bg-primary text-primary-foreground",
          isInRange && "bg-primary/20",
          pricing && !isCheckIn && !isCheckOut && "hover:bg-gray-50"
        )}
        onClick={() => handleDateClick(date)}
      >
        <span className="text-sm font-medium">{date.getDate()}</span>
        {pricing && (
          <div className="flex flex-col items-center mt-1">
            <span className="text-xs font-semibold">
              ${pricing.basePrice}
            </span>
            <div className="flex gap-1 mt-1">
              {pricing.season === 'high' && <TrendingUp className="h-2 w-2 text-red-500" />}
              {pricing.season === 'low' && <TrendingDown className="h-2 w-2 text-green-500" />}
              {pricing.discounts?.includes('early_bird') && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
            {pricing.availability <= 3 && (
              <span className="text-xs text-orange-600 font-medium">
                {pricing.availability} left
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const selectedDays = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Select Your Dates
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            High Season
          </Badge>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Shoulder Season
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <TrendingDown className="h-3 w-3 mr-1" />
            Low Season
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            Early Bird
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={checkInDate}
          onSelect={onCheckInSelect}
          disabled={(date) => date < new Date()}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => renderDayContent(date)
          }}
        />
      </CardContent>
    </Card>
  );
}
