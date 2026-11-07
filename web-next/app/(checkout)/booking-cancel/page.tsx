import type { Metadata } from "next";
import BookingCancelClient from "./BookingCancelClient";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment process was cancelled.",
  robots: { index: false, follow: false },
};

export default function BookingCancelPage() {
  return <BookingCancelClient />;
}
