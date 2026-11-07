import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import {
  buildPageSeoMetadata,
  getServerLocale,
} from "@/lib/i18n/server-locale";
import {
  buildBreadcrumbJsonLd,
  buildTravelAgencyJsonLd,
} from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageSeoMetadata({
    pathname: "/contact",
    title: "Galata Planning Bureau & Private Route Inquiries",
    description:
      "Consult our Galata planning desk in İstanbul for bespoke archaeological, architectural, and coastal journeys across Türkiye.",
  });
}

export default async function ContactPage() {
  const locale = await getServerLocale();
  return (
    <>
      <JsonLd
        data={[
          buildTravelAgencyJsonLd(locale),
          buildBreadcrumbJsonLd(
            [
              { name: "Atlas", path: "/" },
              { name: "Galata Planning Desk", path: "/contact" },
            ],
            locale
          ),
        ]}
      />
      <ContactClient />
    </>
  );
}
