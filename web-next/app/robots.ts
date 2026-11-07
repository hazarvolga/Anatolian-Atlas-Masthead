import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

const DISALLOWED_PATHS = [
  "/admin",
  "/admin/",
  "/api",
  "/api/",
  "/auth",
  "/profile",
  "/my-reservations",
  "/booking-success",
  "/booking-cancel",
  "/design-system",
  "/email-confirmation",
  "/unsubscribe",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: ["/", "/tours", "/destinations", "/journal", "/llms.txt"],
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
