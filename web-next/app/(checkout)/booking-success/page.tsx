import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import BookingSuccessClient from "./BookingSuccessClient";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: `Your reservation details on ${siteConfig.brand.name}.`,
  robots: { index: false, follow: false },
};

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <BookingSuccessClient />
    </Suspense>
  );
}
