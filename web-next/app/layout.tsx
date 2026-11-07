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
import {
  getServerLocale,
  getServerPathname,
} from "@/lib/i18n/server-locale";
import { getServerThemeConfig } from "@/lib/data/server-theme";
import {
  buildAlternatesMetadata,
  DEFAULT_LOCALE,
  isFullyTranslatedRoute,
  isNonLocalizedPath,
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
  preload: false,
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-aegean",
  display: "swap",
  preload: false,
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-noir",
  display: "swap",
  preload: false,
});

const albertSans = Albert_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-noir",
  display: "swap",
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const pathname = await getServerPathname("/");
  const nonLocalized = isNonLocalizedPath(pathname);
  const translatedRoute = isFullyTranslatedRoute(pathname);
  const noindexUntranslatedLocale =
    locale !== DEFAULT_LOCALE && !translatedRoute;

  return {
    metadataBase: new URL(siteConfig.seo.siteUrl),
    title: {
      default: siteConfig.seo.defaultTitle,
      template: siteConfig.seo.titleTemplate,
    },
    description: siteConfig.brand.description,
    alternates: nonLocalized
      ? undefined
      : buildAlternatesMetadata(pathname, locale),
    ...(noindexUntranslatedLocale
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [serverLocale, activeTheme] = await Promise.all([
    getServerLocale(),
    getServerThemeConfig(),
  ]);

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
      lang={serverLocale}
      suppressHydrationWarning
      data-theme={activeTheme.preset}
      data-mode={activeTheme.mode}
      data-radius={activeTheme.radius}
      data-density={activeTheme.density}
      data-motion={activeTheme.motion.level}
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
          initialLocale={serverLocale}
          initialThemeConfig={activeTheme}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
