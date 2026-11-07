"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

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
  const [selectedTour, setSelectedTour] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const queryClient = useQueryClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data: calendarDataRaw, isLoading: isLoadingCalendarData } = useQuery({
    queryKey: ["calendar-data", monthStart, monthEnd, selectedTour],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/calendar-data", {
        params: {
          startDate: format(monthStart, "yyyy-MM-dd"),
          endDate: format(monthEnd, "yyyy-MM-dd"),
          tourId: selectedTour,
        },
      });
      return data;
    },
  });

  const tours = calendarDataRaw?.tours || [];
  const availabilityData = calendarDataRaw?.availability || [];
  const bookingsData = calendarDataRaw?.bookings || [];

  const isLoadingAvailability = isLoadingCalendarData;
  const isLoadingBookings = isLoadingCalendarData;

  const calendarData = useMemo(() => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map((date): CalendarDate => {
      const dateStr = format(date, "yyyy-MM-dd");

      const dayAvailability = availabilityData.filter(
        (av: any) => av.available_date === dateStr
      );

      const dayBookings = bookingsData.filter(
        (booking: any) => booking.booking_date === dateStr
      );

      const totalSpots = dayAvailability.reduce(
        (sum: number, av: any) => sum + av.available_spots,
        0
      );
      const bookedSpots = dayBookings.reduce(
        (sum: number, booking: any) => sum + booking.adults + booking.children,
        0
      );
      const availableSpots = totalSpots - bookedSpots;

      return {
        date,
        availability: dayAvailability,
        bookings: dayBookings,
        isAvailable: availableSpots > 0,
        totalSpots,
        availableSpots: Math.max(0, availableSpots),
        hasSpecialPricing: dayAvailability.some(
          (av: any) => av.price_override !== null
        ),
      };
    });
  }, [monthStart, monthEnd, availabilityData, bookingsData]);

  const bulkUpdateAvailability = useMutation({
    mutationFn: async ({
      dates,
      updates,
    }: {
      dates: Date[];
      updates: any;
    }) => {
      if (selectedTour === "all") {
        throw new Error("Please select a specific tour for bulk operations");
      }

      const payload = dates.map((date) => ({
        tour_id: selectedTour,
        available_date: format(date, "yyyy-MM-dd"),
        ...updates,
      }));

      const { data } = await api.post(
        "/api/admin/availability/bulk-update",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-availability"] });
      setSelectedDates([]);
      toast.success("Availability updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    },
  });

  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const goToToday = () => setCurrentDate(new Date());

  const toggleDateSelection = (date: Date) => {
    setSelectedDates((prev) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const isSelected = prev.some((d) => format(d, "yyyy-MM-dd") === dateStr);

      if (isSelected) {
        return prev.filter((d) => format(d, "yyyy-MM-dd") !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const clearSelection = () => setSelectedDates([]);

  return {
    currentDate,
    selectedTour,
    viewMode,
    selectedDates,
    tours,
    calendarData,
    isLoading: isLoadingAvailability || isLoadingBookings,
    setSelectedTour,
    setViewMode,
    toggleDateSelection,
    clearSelection,
    bulkUpdateAvailability,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  };
};
