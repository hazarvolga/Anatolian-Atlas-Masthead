"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function GuestDetailsCard({ adults, children }: any) {
  const totalGuests = adults + children;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Guests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Adults:</span>
          <span>{adults}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Children:</span>
          <span>{children}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total Guests:</span>
          <span>{totalGuests}</span>
        </div>
      </CardContent>
    </Card>
  );
}
