"use client";


import { useState } from "react";
import { format, isSameDay } from "date-fns";

interface UseCalendarLogicProps {
  availability: any[];
  isMultiDay: boolean;
  onDateSelect: (date: Date) => void;
  onCheckInSelect?: (date: Date) => void;
  onCheckOutSelect?: (date: Date) => void;
}

export const useCalendarLogic = ({
  availability,
  isMultiDay,
  onDateSelect,
  onCheckInSelect,
  onCheckOutSelect,
}: UseCalendarLogicProps) => {
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const getDateAvailability = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    console.log('Looking for availability for date:', dateStr, 'in:', availability);
    return availability.find(avail => avail.available_date === dateStr);
  };

  const isDateAvailable = (date: Date) => {
    const avail = getDateAvailability(date);
    // Allow selection even if no availability data (for demo purposes)
    if (!avail) return true;
    return avail.available_spots > 0;
  };

  const getDateStatus = (date: Date) => {
    const avail = getDateAvailability(date);
    if (!avail) return 'unavailable';
    if (avail.available_spots === 0) return 'full';
    if (avail.available_spots < 5) return 'limited';
    return 'available';
  };

  const handleDateClick = (date: Date, checkInDate?: Date) => {
    console.log('Date clicked:', date, 'Available:', isDateAvailable(date));
    
    if (isMultiDay) {
      if (!checkInDate || selectingCheckOut) {
        onCheckInSelect?.(date);
        setSelectingCheckOut(true);
      } else {
        onCheckOutSelect?.(date);
        setSelectingCheckOut(false);
      }
    } else {
      onDateSelect(date);
    }
  };

  const renderDayContent = (date: Date, selectedDate?: Date, checkInDate?: Date, checkOutDate?: Date) => {
    const status = getDateStatus(date);
    const avail = getDateAvailability(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCheckIn = checkInDate && isSameDay(date, checkInDate);
    const isCheckOut = checkOutDate && isSameDay(date, checkOutDate);

    return (
      <div className="relative w-full h-full">
        <span className={`
          ${isSelected || isCheckIn || isCheckOut ? 'font-bold' : ''}
        `}>
          {date.getDate()}
        </span>
        
        {/* Availability indicator - show for all future dates */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          {status === 'available' && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
          {status === 'limited' && (
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          )}
          {status === 'full' && (
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          )}
          {status === 'unavailable' && date >= new Date() && (
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* Price indicator (if available) */}
        {avail && avail.price_override && (
          <div className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded px-1">
            ${avail.price_override}
          </div>
        )}
      </div>
    );
  };

  return {
    selectingCheckOut,
    getDateAvailability,
    isDateAvailable,
    getDateStatus,
    handleDateClick,
    renderDayContent,
  };
};
