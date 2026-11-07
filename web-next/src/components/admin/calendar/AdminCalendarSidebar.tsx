"use client";


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminCalendarSidebarProps {
  tours: any[];
  selectedTour: string;
  viewMode: 'month' | 'week';
  onTourChange: (tourId: string) => void;
  onViewModeChange: (mode: 'month' | 'week') => void;
}

export default function AdminCalendarSidebar({
  tours,
  selectedTour,
  viewMode,
  onTourChange,
  onViewModeChange
}: AdminCalendarSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Tour Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tour Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTour} onValueChange={onTourChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tours</SelectItem>
              {tours.map(tour => (
                <SelectItem key={tour.id} value={tour.id}>
                  {tour.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* View Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">View Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('week')}
            >
              Week
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs">Limited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs">Full/Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs">Special Pricing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-xs">No Data</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
