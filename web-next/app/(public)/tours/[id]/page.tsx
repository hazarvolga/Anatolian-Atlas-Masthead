import type { Metadata } from "next";
import TourDetailClient from "./TourDetailClient";
import { fetchServerJson } from "@/lib/api/server";

interface TourMetadata {
  title?: string;
  seo_title?: string;
  short_description?: string;
  seo_description?: string;
  description?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchServerJson<TourMetadata>(`/api/tours/${id}`);

  if (!result.ok) {
    return { title: "Tour" };
  }

  const description =
    result.data.seo_description || result.data.short_description || result.data.description;

  return {
    title: result.data.seo_title || result.data.title || "Tour",
    description: description ? description.slice(0, 160) : undefined,
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TourDetailClient id={id} />;
}
