import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import DesignSystemStudioLoader from "@/components/design-system/DesignSystemStudioLoader";

export const metadata: Metadata = {
  title: "Design System & Preset Studio",
  description:
    "Three-layer token specification, WCAG 2.2 AA/AAA contrast matrix, and live concept preset switcher.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DesignSystemPage() {
  if (!siteConfig.features.enableDesignStudio) {
    notFound();
  }

  return <DesignSystemStudioLoader />;
}
