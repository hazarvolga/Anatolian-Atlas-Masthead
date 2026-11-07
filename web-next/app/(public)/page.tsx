import type { Metadata } from "next";
import SectionRenderer from "@/components/sections/SectionRenderer";
import homePageManifest from "@/config/pages/home.manifest";
import { siteConfig } from "@/config/site.config";
import {
  buildPageSeoMetadata,
  getServerLocale,
} from "@/lib/i18n/server-locale";
import { buildTravelAgencyJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageSeoMetadata({
    pathname: "/",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.brand.description,
  });
}

export default async function HomePage() {
  const locale = await getServerLocale();
  return (
    <>
      <JsonLd data={buildTravelAgencyJsonLd(locale)} />
      <SectionRenderer manifest={homePageManifest} />
    </>
  );
}
