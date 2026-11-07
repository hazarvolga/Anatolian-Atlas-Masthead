"use client";


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { useAdminCalendar } from '@/hooks/useAdminCalendar';
import AdminCalendarSidebar from './calendar/AdminCalendarSidebar';
import AdminCalendarGrid from './calendar/AdminCalendarGrid';
import AdminBulkActions from './calendar/AdminBulkActions';

export default function AdminCalendar() {
  const {
    currentDate,
    selectedTour,
    viewMode,
    selectedDates,
    tours,
    calendarData,
    isLoading,
    setSelectedTour,
    setViewMode,
    toggleDateSelection,
    clearSelection,
    bulkUpdateAvailability,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useAdminCalendar();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Calendar Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AdminCalendarSidebar
            tours={tours}
            selectedTour={selectedTour}
            viewMode={viewMode}
            onTourChange={setSelectedTour}
            onViewModeChange={setViewMode}
          />
          
          {selectedDates.length > 0 && (
            <div className="mt-4">
              <AdminBulkActions
                selectedDates={selectedDates}
                selectedTour={selectedTour}
                onClearSelection={clearSelection}
                onBulkUpdate={bulkUpdateAvailability}
              />
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    ←
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Today
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    →
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AdminCalendarGrid
                  calendarData={calendarData}
                  selectedDates={selectedDates}
                  onDateClick={toggleDateSelection}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
