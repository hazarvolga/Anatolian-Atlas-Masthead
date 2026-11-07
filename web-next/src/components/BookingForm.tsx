"use client";

import MultiStepBookingForm from "@/components/booking/MultiStepBookingForm";

interface BookingFormProps {
  preselectedTourId?: string;
}

export default function BookingForm({ preselectedTourId }: BookingFormProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <MultiStepBookingForm preselectedTourId={preselectedTourId} />
    </div>
  );
}
