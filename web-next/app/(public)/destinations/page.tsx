import type { Metadata } from "next";
import DestinationsClient from "./DestinationsClient";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Six Distinct Regions of Anatolia — Regional Gazetteer",
  description:
    "Explore our geographic archive and regional monographs across İstanbul, Cappadocia, Ephesus, the Lycian Coast, Pamukkale, and Southeastern Anatolia.",
};

export default async function DestinationsPage() {
  const [initialDestinations, initialTours] = await Promise.all([
    getServerDestinations(),
    getServerTours(),
  ]);

  return (
    <DestinationsClient
      initialDestinations={initialDestinations}
      initialTours={initialTours}
    />
  );
}
