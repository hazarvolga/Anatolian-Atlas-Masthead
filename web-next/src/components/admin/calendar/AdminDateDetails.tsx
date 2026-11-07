"use client";


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface CalendarDate {
  date: Date;
  availability: any[];
  bookings: any[];
  isAvailable: boolean;
  totalSpots: number;
  availableSpots: number;
  hasSpecialPricing: boolean;
}

interface AdminDateDetailsProps {
  date: Date;
  dateData: CalendarDate | undefined;
}

export default function AdminDateDetails({ date, dateData }: AdminDateDetailsProps) {
  if (!dateData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
          <Badge variant={dateData.isAvailable ? 'default' : 'destructive'}>
            {dateData.isAvailable ? 'Available' : 'Full'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Availability Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{dateData.totalSpots}</div>
            <div className="text-sm text-gray-500">Total Spots</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{dateData.availableSpots}</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{dateData.bookings.length}</div>
            <div className="text-sm text-gray-500">Bookings</div>
          </div>
        </div>

        {/* Tour Availability */}
        {dateData.availability.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Tour Availability</h4>
            <div className="space-y-2">
              {dateData.availability.map((availability, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{availability.tours?.name}</div>
                    <div className="text-sm text-gray-500">
                      {availability.available_spots} spots available
                    </div>
                  </div>
                  {availability.price_override && (
                    <Badge variant="outline">
                      Special Price: ₺{availability.price_override}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings */}
        {dateData.bookings.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Bookings</h4>
            <div className="space-y-2">
              {dateData.bookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{booking.guest_name}</div>
                    <div className="text-sm text-gray-500">
                      {booking.tours?.name} • {booking.adults + booking.children} people
                    </div>
                  </div>
                  <Badge variant={
                    booking.status === 'confirmed' ? 'default' :
                    booking.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
