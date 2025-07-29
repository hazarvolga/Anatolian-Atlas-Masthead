
import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import AdminDateDetails from './AdminDateDetails';

interface CalendarDate {
  date: Date;
  availability: any[];
  bookings: any[];
  isAvailable: boolean;
  totalSpots: number;
  availableSpots: number;
  hasSpecialPricing: boolean;
}

interface AdminCalendarGridProps {
  calendarData: CalendarDate[];
  selectedDates: Date[];
  onDateClick: (date: Date) => void;
}

export default function AdminCalendarGrid({
  calendarData,
  selectedDates,
  onDateClick
}: AdminCalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDateStatus = (dateData: CalendarDate) => {
    if (dateData.totalSpots === 0) return 'no-data';
    if (dateData.availableSpots === 0) return 'full';
    if (dateData.availableSpots <= dateData.totalSpots * 0.3) return 'limited';
    return 'available';
  };

  const getStatusColor = (status: string, hasSpecialPricing: boolean) => {
    if (hasSpecialPricing) return 'bg-blue-500';
    
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'limited': return 'bg-yellow-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selected => 
      format(selected, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((dateData, index) => {
          const status = getDateStatus(dateData);
          const statusColor = getStatusColor(status, dateData.hasSpecialPricing);
          const isSelected = isDateSelected(dateData.date);
          
          return (
            <div
              key={index}
              className={cn(
                "relative p-2 border rounded cursor-pointer transition-all hover:border-blue-500",
                isSelected && "ring-2 ring-blue-500",
                isToday(dateData.date) && "border-blue-600 font-bold"
              )}
              onClick={() => onDateClick(dateData.date)}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between">
                <span className="text-sm">{format(dateData.date, 'd')}</span>
                <div className={cn("w-3 h-3 rounded-full", statusColor)}></div>
              </div>

              {/* Availability Info */}
              {dateData.totalSpots > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  <div>{dateData.availableSpots}/{dateData.totalSpots}</div>
                  {dateData.bookings.length > 0 && (
                    <div className="text-blue-600">{dateData.bookings.length} bookings</div>
                  )}
                </div>
              )}

              {/* Special Indicators */}
              {dateData.hasSpecialPricing && (
                <div className="absolute top-1 left-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDates.length === 1 && (
        <div className="mt-6">
          <AdminDateDetails 
            date={selectedDates[0]}
            dateData={calendarData.find(d => 
              format(d.date, 'yyyy-MM-dd') === format(selectedDates[0], 'yyyy-MM-dd')
            )}
          />
        </div>
      )}
    </div>
  );
}
