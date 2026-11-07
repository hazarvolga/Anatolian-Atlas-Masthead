"use client";


import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface CalendarDate {
  date: Date;
  availability: any[];
  bookings: any[];
  isAvailable: boolean;
  totalSpots: number;
  availableSpots: number;
  hasSpecialPricing: boolean;
}

export const useAdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTour, setSelectedTour] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data: calendarDataRaw, isLoading: isLoadingCalendarData } = useQuery({
    queryKey: ['calendar-data', monthStart, monthEnd, selectedTour],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/calendar-data`, {
        params: {
          startDate: format(monthStart, 'yyyy-MM-dd'),
          endDate: format(monthEnd, 'yyyy-MM-dd'),
          tourId: selectedTour,
        },
        headers: getAuthHeaders(),
      });
      return data;
    },
  });

  const tours = calendarDataRaw?.tours || [];
  const availabilityData = calendarDataRaw?.availability || [];
  const bookingsData = calendarDataRaw?.bookings || [];

  const isLoadingAvailability = isLoadingCalendarData;
  const isLoadingBookings = isLoadingCalendarData;

  // Create calendar data structure
  const calendarData = useMemo(() => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.map((date): CalendarDate => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayAvailability = availabilityData.filter(
        av => av.available_date === dateStr
      );
      
      const dayBookings = bookingsData.filter(
        booking => booking.booking_date === dateStr
      );

      const totalSpots = dayAvailability.reduce((sum, av) => sum + av.available_spots, 0);
      const bookedSpots = dayBookings.reduce((sum, booking) => sum + booking.adults + booking.children, 0);
      const availableSpots = totalSpots - bookedSpots;

      return {
        date,
        availability: dayAvailability,
        bookings: dayBookings,
        isAvailable: availableSpots > 0,
        totalSpots,
        availableSpots: Math.max(0, availableSpots),
        hasSpecialPricing: dayAvailability.some(av => av.price_override !== null),
      };
    });
  }, [monthStart, monthEnd, availabilityData, bookingsData]);

  // Bulk update availability
  const bulkUpdateAvailability = useMutation({
    mutationFn: async ({ dates, updates }: { dates: Date[], updates: any }) => {
      if (selectedTour === 'all') {
        throw new Error('Please select a specific tour for bulk operations');
      }

      const payload = dates.map(date => ({
        tour_id: selectedTour,
        available_date: format(date, 'yyyy-MM-dd'),
        ...updates
      }));

      const { data } = await axios.post(`${API_BASE_URL}/api/admin/availability/bulk-update`, payload, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-availability'] });
      setSelectedDates([]);
      toast.success('Availability updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    },
  });

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Selection functions
  const toggleDateSelection = (date: Date) => {
    setSelectedDates(prev => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const isSelected = prev.some(d => format(d, 'yyyy-MM-dd') === dateStr);
      
      if (isSelected) {
        return prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const clearSelection = () => setSelectedDates([]);

  return {
    // State
    currentDate,
    selectedTour,
    viewMode,
    selectedDates,
    
    // Data
    tours,
    calendarData,
    isLoading: isLoadingAvailability || isLoadingBookings,
    
    // Actions
    setSelectedTour,
    setViewMode,
    toggleDateSelection,
    clearSelection,
    bulkUpdateAvailability,
    
    // Navigation
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  };
};
