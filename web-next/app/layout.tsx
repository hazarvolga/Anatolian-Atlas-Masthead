import type { Metadata } from "next";
import {
  Newsreader,
  Source_Sans_3,
  Fraunces,
  Instrument_Sans,
  Bodoni_Moda,
  Albert_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import { siteConfig } from "@/config/site.config";
import { getServerThemeConfig } from "@/lib/data/server-theme";
import { getConceptPack } from "@/design/concepts";
import { normalizePresetId } from "@/design/tokens";
import {
  buildAlternatesMetadata,
  DEFAULT_LOCALE,
} from "@/lib/i18n/locale-utils";
import { Providers } from "./providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-atlas",
  display: "swap",
  preload: true,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-atlas",
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-aegean",
  display: "swap",
  preload: true,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-aegean",
  display: "swap",
  preload: true,
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-noir",
  display: "swap",
  preload: true,
});

const albertSans = Albert_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-noir",
  display: "swap",
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteConfig.seo.siteUrl),
    title: {
      default: siteConfig.seo.defaultTitle,
      template: siteConfig.seo.titleTemplate,
    },
    description: siteConfig.brand.description,
    alternates: buildAlternatesMetadata("/", DEFAULT_LOCALE),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Resolved strictly from `site-settings` tagged ISR fetch — NEVER calls `cookies()` or `headers()`
  const activeTheme = await getServerThemeConfig();
  const canonicalConceptId = normalizePresetId(activeTheme.preset);
  const concept = getConceptPack(canonicalConceptId);

  const fontVariables = [
    newsreader.variable,
    sourceSans.variable,
    fraunces.variable,
    instrumentSans.variable,
    bodoniModa.variable,
    albertSans.variable,
    ibmPlexMono.variable,
  ].join(" ");

  return (
    <html
      lang={DEFAULT_LOCALE}
      suppressHydrationWarning
      data-theme={canonicalConceptId}
      data-concept={canonicalConceptId}
      data-mode={activeTheme.mode}
      data-radius={activeTheme.radius}
      data-density={activeTheme.density}
      data-motion={activeTheme.motion.level}
      data-frame={concept.shape.frameStyle}
      data-ornament={concept.shape.ornamentSvg}
      data-entrance={concept.motion.entrance}
      data-vignette={concept.imageTreatment.vignette ? "true" : "false"}
      data-grain={concept.imageTreatment.grain ? "true" : "false"}
      className={`${fontVariables} ${activeTheme.mode === "dark" ? "dark" : ""}`.trim()}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Providers
          initialLocale={DEFAULT_LOCALE}
          initialThemeConfig={activeTheme}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
