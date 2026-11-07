import type { Metadata } from "next";
import SectionRenderer from "@/components/sections/SectionRenderer";
import homePageManifest from "@/config/pages/home.manifest";
import { siteConfig } from "@/config/site.config";
import { buildPageSeoMetadata } from "@/lib/i18n/server-locale";
import { DEFAULT_LOCALE } from "@/lib/i18n/locale-utils";
import { getServerSiteSettings } from "@/lib/data/server-theme";
import { buildTravelAgencyJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const serverSettings = await getServerSiteSettings();
  return buildPageSeoMetadata({
    pathname: "/",
    locale: DEFAULT_LOCALE,
    title: serverSettings.site_title
      ? `${serverSettings.site_title} — ${serverSettings.site_tagline || siteConfig.brand.tagline}`
      : siteConfig.seo.defaultTitle,
    description:
      serverSettings.default_meta_description || siteConfig.brand.description,
    canonicalUrl: serverSettings.canonical_url,
    ogImage: serverSettings.og_image || serverSettings.og_image_url,
  });
}

export default async function HomePage() {
  return (
    <>
      <JsonLd data={buildTravelAgencyJsonLd(DEFAULT_LOCALE)} />
      <SectionRenderer manifest={homePageManifest} />
    </>
  );
}
