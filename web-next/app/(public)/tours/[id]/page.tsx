import type { Metadata } from "next";
import TourDetailClient from "./TourDetailClient";
import { getServerTourById } from "@/lib/data/server-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tour = await getServerTourById(id);

  if (!tour) {
    return { title: "Expedition Dossier" };
  }

  return {
    title: tour.title || tour.name || "Expedition Dossier",
    description: tour.description ? tour.description.slice(0, 160) : undefined,
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialTour = await getServerTourById(id);

  return <TourDetailClient id={id} initialTour={initialTour} />;
}
