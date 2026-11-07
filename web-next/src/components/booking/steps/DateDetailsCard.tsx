"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DateDetailsCard({ isMultiDayTour, checkInDate, checkOutDate }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Travel Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">{isMultiDayTour ? "Check-in:" : "Tour Date:"}</span>
          <span>{checkInDate ? format(checkInDate, "PPP") : "Not selected"}</span>
        </div>
        {isMultiDayTour && checkOutDate && (
          <div className="flex justify-between">
            <span className="font-medium">Check-out:</span>
            <span>{format(checkOutDate, "PPP")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
