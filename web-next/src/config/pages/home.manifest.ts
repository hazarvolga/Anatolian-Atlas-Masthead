import themeConfig, {
  type DestinationIndexVariant,
  type HomeLayoutVariant,
} from "@/config/theme.config";

export type SectionBlockType =
  | "hero"
  | "destination-index"
  | "featured-tours"
  | "manifesto"
  | "testimonials"
  | "cta-band";

export interface PageSectionManifestItem {
  id: string;
  type: SectionBlockType;
  enabled: boolean;
  variant?: HomeLayoutVariant | DestinationIndexVariant | string;
}

export interface PageManifest {
  pageId: string;
  title: string;
  sections: PageSectionManifestItem[];
}

/**
 * Declarative Homepage Composition Manifest
 * Reordering, disabling, or changing a section's variant here (or in theme.config.ts)
 * reshapes the homepage without touching page component code.
 */
export const homePageManifest: PageManifest = {
  pageId: "home",
  title: "Anatolian Atlas — Masthead & Regional Index",
  sections: [
    {
      id: "home-hero",
      type: "hero",
      enabled: true,
      variant: themeConfig.layout.home,
    },
    {
      id: "home-destinations",
      type: "destination-index",
      enabled: true,
      variant: themeConfig.layout.destinationIndex,
    },
    {
      id: "home-featured-tours",
      type: "featured-tours",
      enabled: true,
    },
    {
      id: "home-manifesto",
      type: "manifesto",
      enabled: true,
    },
    {
      id: "home-testimonials",
      type: "testimonials",
      enabled: true,
    },
    {
      id: "home-cta",
      type: "cta-band",
      enabled: true,
    },
  ],
};

export default homePageManifest;
