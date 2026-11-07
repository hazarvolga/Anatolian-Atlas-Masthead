import type { Metadata } from "next";
import ToursCatalogClient from "./ToursCatalogClient";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Curated Field Itineraries & Small-Group Routes",
  description:
    "Explore historian-led archaeological, culinary, and coastal journeys across İstanbul, Cappadocia, Ephesus, Lycia, Pamukkale, and Southeastern Anatolia.",
};

export default async function ToursPage() {
  const [initialTours, initialDestinations] = await Promise.all([
    getServerTours(),
    getServerDestinations(),
  ]);

  return (
    <ToursCatalogClient
      initialTours={initialTours}
      initialDestinations={initialDestinations}
    />
  );
}
