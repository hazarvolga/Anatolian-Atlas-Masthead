import type { Metadata } from "next";
import TourDetailClient from "./TourDetailClient";
import { getServerTourById } from "@/lib/data/server-catalog";
import {
  buildPageSeoMetadata,
  getServerLocale,
} from "@/lib/i18n/server-locale";
import {
  buildBreadcrumbJsonLd,
  buildTourFaqJsonLd,
  buildTouristTripJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tour = await getServerTourById(id);

  if (!tour) {
    return buildPageSeoMetadata({
      pathname: `/tours/${id}`,
      title: "Expedition Dossier",
      description: "Small-group field itinerary across Türkiye.",
    });
  }

  return buildPageSeoMetadata({
    pathname: `/tours/${id}`,
    title: tour.title || tour.name || "Expedition Dossier",
    description: tour.description
      ? tour.description.slice(0, 160)
      : "Small-group field itinerary across Türkiye.",
    images: tour.image_url ? [tour.image_url] : undefined,
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getServerLocale();
  const initialTour = await getServerTourById(id);

  const schemas = initialTour
    ? [
        buildTouristTripJsonLd(initialTour, locale),
        buildTourFaqJsonLd(initialTour),
        buildBreadcrumbJsonLd(
          [
            { name: "Atlas", path: "/" },
            { name: "Journeys", path: "/tours" },
            {
              name: initialTour.title || initialTour.name || "Expedition",
              path: `/tours/${id}`,
            },
          ],
          locale
        ),
      ]
    : [];

  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      <TourDetailClient id={id} initialTour={initialTour} />
    </>
  );
}
