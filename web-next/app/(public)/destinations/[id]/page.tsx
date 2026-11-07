import type { Metadata } from "next";
import DestinationDetailClient from "./DestinationDetailClient";
import { fetchServerJson } from "@/lib/api/server";

interface DestinationMetadata {
  name?: string;
  description?: string;
  short_description?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchServerJson<DestinationMetadata>(`/api/destinations/${id}`);

  if (!result.ok) {
    return { title: "Destination" };
  }

  const description = result.data.description || result.data.short_description;

  return {
    title: result.data.name || "Destination",
    description: description ? description.slice(0, 160) : undefined,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DestinationDetailClient id={id} />;
}
