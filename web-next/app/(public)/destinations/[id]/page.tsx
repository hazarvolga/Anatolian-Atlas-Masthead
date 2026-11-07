import type { Metadata } from "next";
import DestinationDetailClient from "./DestinationDetailClient";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import {
  buildPageSeoMetadata,
  getServerLocale,
} from "@/lib/i18n/server-locale";
import {
  buildBreadcrumbJsonLd,
  buildTouristDestinationJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const destinations = await getServerDestinations();
  const dest = destinations.find((d) => d.id === id);

  if (!dest) {
    return buildPageSeoMetadata({
      pathname: `/destinations/${id}`,
      title: "Regional Dossier",
      description: "Anatolian Atlas regional field monograph.",
    });
  }

  return buildPageSeoMetadata({
    pathname: `/destinations/${id}`,
    title: `${dest.name} — Regional Dossier`,
    description: dest.description
      ? dest.description.slice(0, 160)
      : `Field dossier for ${dest.name}, Türkiye.`,
    images: dest.image_url ? [dest.image_url] : undefined,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getServerLocale();
  const [destinations, tours] = await Promise.all([
    getServerDestinations(),
    getServerTours(),
  ]);
  const dest = destinations.find((d) => d.id === id);
  const relatedTours = dest
    ? tours.filter(
        (t) =>
          t.destination_id === dest.id ||
          (dest.city && t.city?.toLowerCase() === dest.city.toLowerCase())
      )
    : [];

  const schemas = dest
    ? [
        buildTouristDestinationJsonLd(dest, relatedTours, locale),
        buildBreadcrumbJsonLd(
          [
            { name: "Atlas", path: "/" },
            { name: "Regions", path: "/destinations" },
            { name: dest.name, path: `/destinations/${id}` },
          ],
          locale
        ),
      ]
    : [];

  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      <DestinationDetailClient id={id} />
    </>
  );
}
