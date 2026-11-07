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
import themeConfig from "@/config/theme.config";
import {
  getServerLocale,
  getServerPathname,
} from "@/lib/i18n/server-locale";
import {
  buildAlternatesMetadata,
  isNonLocalizedPath,
} from "@/lib/i18n/locale-utils";
import { Providers } from "./providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-atlas",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-atlas",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-aegean",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-aegean",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-noir",
  display: "swap",
});

const albertSans = Albert_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-noir",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const pathname = await getServerPathname("/");
  const nonLocalized = isNonLocalizedPath(pathname);

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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const serverLocale = await getServerLocale();

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
      data-theme={themeConfig.preset}
      data-mode={themeConfig.mode}
      data-radius={themeConfig.radius}
      data-density={themeConfig.density}
      data-motion={themeConfig.motion.level}
      className={`${fontVariables} ${themeConfig.mode === "dark" ? "dark" : ""}`.trim()}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Providers initialLocale={serverLocale}>{children}</Providers>
      </body>
    </html>
  );
}
