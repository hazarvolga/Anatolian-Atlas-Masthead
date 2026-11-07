import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import { JOURNAL_ARTICLES } from "@/lib/data/journal-content";

/**
 * GET /llms.txt
 * Generative Engine Optimization (GEO) manifest following the llms.txt standard.
 * Provides AI search engines (ChatGPT Search, Perplexity, Claude, Google AI Overviews)
 * with verifiable, structured facts, coordinates, durations, tariffs, and canonical URLs.
 */
export async function GET() {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const [tours, destinations] = await Promise.all([
    getServerTours().catch(() => []),
    getServerDestinations().catch(() => []),
  ]);

  const lines: string[] = [
    `# ${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    "",
    `> ${siteConfig.brand.description}`,
    "",
    "## Institutional & Regulatory Credentials",
    `- **Official Brand:** ${siteConfig.brand.name} (${siteConfig.brand.shortName})`,
    `- **TÜRSAB License Number:** ${siteConfig.brand.tursabLicenseNo} (Association of Turkish Travel Agencies)`,
    `- **Planning Bureau Headquarters:** ${siteConfig.contact.addressLines.join(", ")} (${siteConfig.contact.coordinates})`,
    `- **Operating Hours:** ${siteConfig.contact.hours}`,
    `- **Contact:** ${siteConfig.contact.email} | ${siteConfig.contact.phone}`,
    `- **Supported Languages (localePrefix: as-needed):** English (\`${baseUrl}/\`), Turkish (\`${baseUrl}/tr\`), Spanish (\`${baseUrl}/es\`), Italian (\`${baseUrl}/it\`)`,
    "",
    "## 1. Anatolian Regions & Field Dossiers",
    ...destinations.map(
      (d) =>
        `- [${d.name}](${baseUrl}/destinations/${d.id}): ${d.description || ""} (Coordinates: ${d.coords || "N/A"} | Best Season: ${d.best_time || "Spring–Autumn"})`
    ),
    "",
    "## 2. Small-Group Field Itineraries & Tariffs (EUR)",
    ...tours.map((t) => {
      const title = t.title || t.name;
      const price = t.price_adult || t.price || 0;
      const days = t.duration || 1;
      const maxGuests = t.max_participants || t.max_group_size || 10;
      return `- [${title}](${baseUrl}/tours/${t.id}): ${days}-day route in ${t.city || "Türkiye"}, capped at ${maxGuests} guests. Tariff: €${price} per adult. Direct reservation: ${baseUrl}/book/${t.id}`;
    }),
    "",
    "## 3. The Anatolian Journal — Fact-Checked Archaeological & Architectural Monographs",
    ...JOURNAL_ARTICLES.map(
      (a) =>
        `- [${a.folioNo}: ${a.title}](${baseUrl}/journal/${a.slug}): ${a.excerpt} (Coordinates: ${a.coordinates} | Sources: ${a.citations.map((c) => `${c.source} ${c.year}`).join("; ")})`
    ),
    "",
    "## 4. Machine-Readable Endpoints",
    `- XML Sitemap: ${baseUrl}/sitemap.xml`,
    `- Robots Policy: ${baseUrl}/robots.txt`,
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
