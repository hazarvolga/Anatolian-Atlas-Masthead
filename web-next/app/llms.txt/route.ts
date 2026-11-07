import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import {
  DEMO_EDITORIAL_DISCLAIMER,
  JOURNAL_ARTICLES,
} from "@/lib/data/journal-content";

/**
 * GET /llms.txt
 * Generative Engine Optimization (GEO) manifest following the llms.txt standard.
 * Only outputs verified/populated fields from siteConfig (no fabricated license/contact data).
 */
export async function GET() {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const [tours, destinations] = await Promise.all([
    getServerTours().catch(() => []),
    getServerDestinations().catch(() => []),
  ]);

  const credentialLines: string[] = [
    `- **Official Brand:** ${siteConfig.brand.name} (${siteConfig.brand.shortName})`,
  ];
  if (siteConfig.brand.tursabLicenseNo) {
    credentialLines.push(
      `- **TÜRSAB License Number:** ${siteConfig.brand.tursabLicenseNo}`
    );
  }
  if (siteConfig.contact.addressLines.length > 0) {
    credentialLines.push(
      `- **Planning Bureau Address:** ${siteConfig.contact.addressLines.join(", ")}`
    );
  }
  if (siteConfig.contact.email || siteConfig.contact.phone) {
    credentialLines.push(
      `- **Contact:** ${[siteConfig.contact.email, siteConfig.contact.phone].filter(Boolean).join(" | ")}`
    );
  }
  credentialLines.push(
    `- **Supported UI Languages (localePrefix: as-needed):** English (\`${baseUrl}/\`), Turkish (\`${baseUrl}/tr\`), Spanish (\`${baseUrl}/es\`), Italian (\`${baseUrl}/it\`)`
  );

  const lines: string[] = [
    `# ${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    "",
    `> ${siteConfig.brand.description}`,
    "",
    "## Brand & Configuration",
    ...credentialLines,
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
    `## 3. The Anatolian Journal — Editorial Monographs (${DEMO_EDITORIAL_DISCLAIMER})`,
    ...JOURNAL_ARTICLES.map(
      (a) =>
        `- [${a.folioNo}: ${a.title}](${baseUrl}/journal/${a.slug}): ${a.excerpt} (Bibliography: ${a.citations.map((c) => `${c.source} ${c.year}`).join("; ")})`
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
