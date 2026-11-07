import type { Metadata } from "next";
import BookingCancelClient from "./BookingCancelClient";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment process was cancelled.",
};

export default function BookingCancelPage() {
  return <BookingCancelClient />;
}
