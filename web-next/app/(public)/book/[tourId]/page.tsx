import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Book Your Tour",
  description: `Complete your tour reservation with ${siteConfig.brand.name}.`,
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  return <BookingClient tourId={tourId} />;
}
