import {
  normalizePresetId,
  THEME_PRESETS,
  type CanonicalConceptId,
  type MotionLevel,
  type SemanticPresetDefinition,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
  type ThemeRadius,
} from "./tokens";
import type {
  DestinationIndexVariant,
  FooterLayoutVariant,
  HeaderLayoutVariant,
  HomeLayoutVariant,
  TourCardVariant,
  TourDetailVariant,
} from "@/config/theme.config";

export type ConceptMotionEntrance =
  | "masked-line"
  | "drift-parallax"
  | "clip-curtain";

export type ConceptFrameStyle =
  | "hairline-grid"
  | "frameless-bleed"
  | "double-gold-ornament";

export type ConceptOrnamentSet =
  | "compass-ticks"
  | "none"
  | "ottoman-corner";

export type HomeManifestSectionType =
  | "hero"
  | "destination-index"
  | "featured-tours"
  | "manifesto"
  | "testimonials"
  | "cta-band";

export interface HomeManifestSectionEntry {
  id: string;
  type: HomeManifestSectionType;
  enabled: boolean;
  variant?: string;
}

export type ToursCatalogSectionType =
  | "header"
  | "filter-bar"
  | "featured-banner"
  | "tours-grid"
  | "stewardship-note";

export interface ToursManifestSectionEntry {
  id: string;
  type: ToursCatalogSectionType;
  enabled: boolean;
  variant?: string;
}

export interface ConceptPack {
  id: CanonicalConceptId;
  aliases: ThemePresetId[];
  label: string;
  subtitle: string;
  character: string;
  tokens: {
    semantic: SemanticPresetDefinition;
    defaultMode: ThemeMode;
    defaultDensity: ThemeDensity;
    typeScaleRatio: number;
    spacingMultiplier: number;
  };
  layout: {
    header: HeaderLayoutVariant;
    footer: FooterLayoutVariant;
    home: HomeLayoutVariant;
    tourCard: TourCardVariant;
    destinationIndex: DestinationIndexVariant;
    tourDetail: TourDetailVariant;
  };
  pageManifests: {
    home: {
      pageId: "home";
      title: string;
      sections: HomeManifestSectionEntry[];
    };
    tours: {
      pageId: "tours";
      title: string;
      gridStructure:
        | "swiss-sidebar-grid"
        | "asymmetric-offset-rows"
        | "symmetrical-salon-showcase";
      sections: ToursManifestSectionEntry[];
    };
  };
  motion: {
    durationSeconds: number;
    durationRangeLabel: string;
    ease: string;
    entrance: ConceptMotionEntrance;
    staggerSeconds: number;
    defaultLevel: MotionLevel;
    smoothScroll: boolean;
  };
  imageTreatment: {
    cssFilter: string;
    primaryAspect: "4/5" | "16/10" | "3/4";
    secondaryAspect: "3/2" | "4/3" | "21/9";
    vignette: boolean;
    grain: boolean;
    highKey: boolean;
  };
  shape: {
    radius: ThemeRadius;
    frameStyle: ConceptFrameStyle;
    ornamentSvg: ConceptOrnamentSet;
  };
  voice: {
    eyebrowPrefix: string;
    ctaPrimaryVerb: string;
    ctaSecondaryVerb: string;
    metaTone: "cartographic-ledger" | "coastal-stillness" | "imperial-salon";
    microcopySample: string;
  };
}

export const CONCEPT_PACKS: Record<CanonicalConceptId, ConceptPack> = {
  "atlas-editorial": {
    id: "atlas-editorial",
    aliases: ["atlas-editorial", "anatolian-atlas"],
    label: "Atlas Editorial",
    subtitle: "12-Column Swiss Monograph & Cartographic Ledger",
    character:
      "12-column Swiss grid, exposed 1px hairline rules, left-aligned typography, tabular numbering (01 / 06) and coordinate badges, sharp 0px corners.",
    tokens: {
      semantic: THEME_PRESETS["atlas-editorial"],
      defaultMode: "light",
      defaultDensity: "airy",
      typeScaleRatio: 1.25,
      spacingMultiplier: 1.0,
    },
    layout: {
      header: "swiss-bar",
      footer: "atlas-columns",
      home: "masthead",
      tourCard: "portrait-4x5",
      destinationIndex: "map-index",
      tourDetail: "dossier",
    },
    pageManifests: {
      home: {
        pageId: "home",
        title: "Atlas Editorial — Masthead & Regional Index",
        sections: [
          {
            id: "atlas-hero",
            type: "hero",
            enabled: true,
            variant: "masthead",
          },
          {
            id: "atlas-destinations",
            type: "destination-index",
            enabled: true,
            variant: "map-index",
          },
          {
            id: "atlas-featured-tours",
            type: "featured-tours",
            enabled: true,
            variant: "portrait-4x5",
          },
          {
            id: "atlas-manifesto",
            type: "manifesto",
            enabled: true,
            variant: "swiss-diptych",
          },
          {
            id: "atlas-testimonials",
            type: "testimonials",
            enabled: true,
            variant: "ledger-columns",
          },
          {
            id: "atlas-cta",
            type: "cta-band",
            enabled: true,
            variant: "ledger-split",
          },
        ],
      },
      tours: {
        pageId: "tours",
        title: "Expedition Catalogue — Swiss Tabular Ledger",
        gridStructure: "swiss-sidebar-grid",
        sections: [
          {
            id: "atlas-tours-header",
            type: "header",
            enabled: true,
            variant: "swiss-ledger",
          },
          {
            id: "atlas-tours-filter",
            type: "filter-bar",
            enabled: true,
            variant: "tabular-4col",
          },
          {
            id: "atlas-tours-grid",
            type: "tours-grid",
            enabled: true,
            variant: "portrait-4x5",
          },
          {
            id: "atlas-tours-stewardship",
            type: "stewardship-note",
            enabled: true,
            variant: "archive-colophon",
          },
        ],
      },
    },
    motion: {
      durationSeconds: 0.6,
      durationRangeLabel: "0.5–0.7s crisp editorial",
      ease: "power3.out",
      entrance: "masked-line",
      staggerSeconds: 0.055,
      defaultLevel: "full",
      smoothScroll: true,
    },
    imageTreatment: {
      cssFilter: "contrast(1.03) saturate(0.98)",
      primaryAspect: "4/5",
      secondaryAspect: "3/2",
      vignette: false,
      grain: false,
      highKey: false,
    },
    shape: {
      radius: "sharp",
      frameStyle: "hairline-grid",
      ornamentSvg: "compass-ticks",
    },
    voice: {
      eyebrowPrefix: "FIELD DOSSIER · PLATE",
      ctaPrimaryVerb: "Inspect Route Dossier",
      ctaSecondaryVerb: "Consult Galata Desk",
      metaTone: "cartographic-ledger",
      microcopySample:
        "38.64° N, 34.82° E · Timed 08:00 Morning Entry · Max 12 Guests",
    },
  },

  "aegean-linen": {
    id: "aegean-linen",
    aliases: ["aegean-linen"],
    label: "Aegean Linen",
    subtitle: "Asymmetric Coastal Stillness & Sun-Bleached Gallery",
    character:
      "Asymmetric composition, overflowing full-bleed visuals, generous whitespace (1.22x), soft architectural corners, zero heavy rules or ornaments.",
    tokens: {
      semantic: THEME_PRESETS["aegean-linen"],
      defaultMode: "light",
      defaultDensity: "airy",
      typeScaleRatio: 1.333,
      spacingMultiplier: 1.22,
    },
    layout: {
      header: "minimal-overlay",
      footer: "minimal",
      home: "split-cinema",
      tourCard: "landscape-row",
      destinationIndex: "horizontal-scroll",
      tourDetail: "story-scroll",
    },
    pageManifests: {
      home: {
        pageId: "home",
        title: "Aegean Linen — Coastal Stillness & Story Scroll",
        sections: [
          {
            id: "aegean-hero",
            type: "hero",
            enabled: true,
            variant: "split-cinema",
          },
          {
            id: "aegean-manifesto",
            type: "manifesto",
            enabled: true,
            variant: "asymmetric-essay",
          },
          {
            id: "aegean-destinations",
            type: "destination-index",
            enabled: true,
            variant: "horizontal-scroll",
          },
          {
            id: "aegean-featured-tours",
            type: "featured-tours",
            enabled: true,
            variant: "landscape-row",
          },
          {
            id: "aegean-testimonials",
            type: "testimonials",
            enabled: true,
            variant: "airy-quotes",
          },
          {
            id: "aegean-cta",
            type: "cta-band",
            enabled: true,
            variant: "coastal-invitation",
          },
        ],
      },
      tours: {
        pageId: "tours",
        title: "Coastal & Inland Journeys — Asymmetric Offset Rows",
        gridStructure: "asymmetric-offset-rows",
        sections: [
          {
            id: "aegean-tours-header",
            type: "header",
            enabled: true,
            variant: "asymmetric-bleed",
          },
          {
            id: "aegean-tours-banner",
            type: "featured-banner",
            enabled: true,
            variant: "sunlit-feature",
          },
          {
            id: "aegean-tours-filter",
            type: "filter-bar",
            enabled: true,
            variant: "floating-pill",
          },
          {
            id: "aegean-tours-grid",
            type: "tours-grid",
            enabled: true,
            variant: "landscape-row",
          },
        ],
      },
    },
    motion: {
      durationSeconds: 1.2,
      durationRangeLabel: "1.0–1.4s drifting coastal ease",
      ease: "power2.out",
      entrance: "drift-parallax",
      staggerSeconds: 0.11,
      defaultLevel: "full",
      smoothScroll: true,
    },
    imageTreatment: {
      cssFilter: "brightness(1.05) contrast(0.95) saturate(0.94)",
      primaryAspect: "16/10",
      secondaryAspect: "4/3",
      vignette: false,
      grain: false,
      highKey: true,
    },
    shape: {
      radius: "soft",
      frameStyle: "frameless-bleed",
      ornamentSvg: "none",
    },
    voice: {
      eyebrowPrefix: "COASTAL & UPLAND NOTES",
      ctaPrimaryVerb: "Explore the Journey",
      ctaSecondaryVerb: "Inquire for Private Dates",
      metaTone: "coastal-stillness",
      microcopySample:
        "Unrushed mornings by wooden gulet, olive-grove tables & quiet stone inns.",
    },
  },

  "ottoman-noir": {
    id: "ottoman-noir",
    aliases: ["ottoman-noir"],
    label: "Ottoman Noir",
    subtitle: "Symmetrical Nocturnal Salon & Burnished Gold Framing",
    character:
      "Centered symmetrical axes, full-viewport nocturnal chapters, thin burnished-gold inset frames and corner ornaments, dramatic curtain reveals.",
    tokens: {
      semantic: THEME_PRESETS["ottoman-noir"],
      defaultMode: "dark",
      defaultDensity: "airy",
      typeScaleRatio: 1.414,
      spacingMultiplier: 1.12,
    },
    layout: {
      header: "centered-logo",
      footer: "big-wordmark",
      home: "fullscreen-reel",
      tourCard: "full-bleed-minimal",
      destinationIndex: "grid-mosaic",
      tourDetail: "tabs",
    },
    pageManifests: {
      home: {
        pageId: "home",
        title: "Ottoman Noir — Private Evening Salon & Imperial Chronicles",
        sections: [
          {
            id: "noir-hero",
            type: "hero",
            enabled: true,
            variant: "fullscreen-reel",
          },
          {
            id: "noir-featured-tours",
            type: "featured-tours",
            enabled: true,
            variant: "full-bleed-minimal",
          },
          {
            id: "noir-manifesto",
            type: "manifesto",
            enabled: true,
            variant: "centered-salon",
          },
          {
            id: "noir-destinations",
            type: "destination-index",
            enabled: true,
            variant: "grid-mosaic",
          },
          {
            id: "noir-testimonials",
            type: "testimonials",
            enabled: true,
            variant: "symmetrical-triptych",
          },
          {
            id: "noir-cta",
            type: "cta-band",
            enabled: true,
            variant: "ornate-frame",
          },
        ],
      },
      tours: {
        pageId: "tours",
        title: "Private Commissions & Nocturnal Salon — Symmetrical Showcase",
        gridStructure: "symmetrical-salon-showcase",
        sections: [
          {
            id: "noir-tours-header",
            type: "header",
            enabled: true,
            variant: "centered-monument",
          },
          {
            id: "noir-tours-filter",
            type: "filter-bar",
            enabled: true,
            variant: "centered-gold-frame",
          },
          {
            id: "noir-tours-grid",
            type: "tours-grid",
            enabled: true,
            variant: "full-bleed-minimal",
          },
          {
            id: "noir-tours-banner",
            type: "featured-banner",
            enabled: true,
            variant: "private-charter-seal",
          },
        ],
      },
    },
    motion: {
      durationSeconds: 1.05,
      durationRangeLabel: "0.9–1.2s dramatic curtain reveal",
      ease: "expo.out",
      entrance: "clip-curtain",
      staggerSeconds: 0.09,
      defaultLevel: "full",
      smoothScroll: true,
    },
    imageTreatment: {
      cssFilter: "brightness(0.88) contrast(1.09) saturate(0.92)",
      primaryAspect: "3/4",
      secondaryAspect: "21/9",
      vignette: true,
      grain: true,
      highKey: false,
    },
    shape: {
      radius: "sharp",
      frameStyle: "double-gold-ornament",
      ornamentSvg: "ottoman-corner",
    },
    voice: {
      eyebrowPrefix: "PRIVATE SALON CHRONICLE",
      ctaPrimaryVerb: "Enter the Chronicle",
      ctaSecondaryVerb: "Request Private Commission",
      metaTone: "imperial-salon",
      microcopySample:
        "By private appointment · After-hours monument access & scholar-hosted tables.",
    },
  },
};

export function getConceptPack(
  preset: ThemePresetId | string | null | undefined
): ConceptPack {
  const canonical = normalizePresetId(preset);
  return CONCEPT_PACKS[canonical];
}

export const ALL_CONCEPT_PACKS: ConceptPack[] = [
  CONCEPT_PACKS["atlas-editorial"],
  CONCEPT_PACKS["aegean-linen"],
  CONCEPT_PACKS["ottoman-noir"],
];
