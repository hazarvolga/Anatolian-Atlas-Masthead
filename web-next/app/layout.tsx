import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NextStopTurkey",
    template: "%s | NextStopTurkey",
  },
  description:
    "Experience breathtaking tours and luxury accommodations in the most beautiful destinations around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${sourceSans.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
