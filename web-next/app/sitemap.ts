import type { MetadataRoute } from "next";
import {
  getServerDestinations,
  getServerTours,
} from "@/lib/data/server-catalog";
import { JOURNAL_ARTICLES } from "@/lib/data/journal-content";
import {
  buildAbsoluteLocalizedUrl,
  isFullyTranslatedRoute,
} from "@/lib/i18n/locale-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, destinations] = await Promise.all([
    getServerTours().catch(() => []),
    getServerDestinations().catch(() => []),
  ]);

  const staticPaths = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/destinations", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/tours", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/journal", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.65, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  const pushEntry = (
    path: string,
    priority: number,
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    lastModified: Date = now
  ) => {
    const translated = isFullyTranslatedRoute(path);
    entries.push({
      url: buildAbsoluteLocalizedUrl(path, "en"),
      lastModified,
      changeFrequency,
      priority,
      ...(translated
        ? {
            alternates: {
              languages: {
                en: buildAbsoluteLocalizedUrl(path, "en"),
                tr: buildAbsoluteLocalizedUrl(path, "tr"),
                es: buildAbsoluteLocalizedUrl(path, "es"),
                it: buildAbsoluteLocalizedUrl(path, "it"),
              },
            },
          }
        : {}),
    });
  };

  for (const item of staticPaths) {
    pushEntry(item.path, item.priority, item.changeFrequency);
  }

  for (const dest of destinations) {
    pushEntry(`/destinations/${dest.id}`, 0.85, "weekly");
  }

  for (const tour of tours) {
    pushEntry(`/tours/${tour.id}`, 0.9, "weekly");
  }

  for (const article of JOURNAL_ARTICLES) {
    pushEntry(
      `/journal/${article.slug}`,
      0.8,
      "monthly",
      new Date(article.publishedAt)
    );
  }

  return entries;
}
