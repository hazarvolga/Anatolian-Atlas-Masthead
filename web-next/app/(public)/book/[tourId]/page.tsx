import type { Metadata } from "next";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Book Your Tour",
  description: "Complete your tour reservation with NextStopTurkey.",
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  return <BookingClient tourId={tourId} />;
}
