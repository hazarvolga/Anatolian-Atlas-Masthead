/**
 * Centralized Demo Image & Placeholder Registry (`src/lib/data/demo-images.ts`)
 *
 * Supports two asset modes:
 * 1. **Demo Photography Mode (default):** Serves local optimized copies under
 *    `/public/demo/*.jpg` via Next.js `<Image>` in AVIF/WebP formats.
 *    Original Unsplash source URLs, IDs, and license details are documented in
 *    `docs/ASSETS_CREDITS.md`.
 * 2. **Commercial Placeholder Mode (`NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE=true` or
 *    `NEXT_PUBLIC_ASSET_MODE=placeholder`):** Returns clean, self-contained
 *    cartographic/architectural SVG plates under `/public/placeholders/*.svg`
 *    so the commercial distribution package can ship without `public/demo/` photography.
 */

export interface DemoImageAsset {
  key: string;
  /** Active asset path (`/demo/*.jpg` or `/placeholders/*.svg` when placeholder mode is active) */
  src: string;
  /** Neutral architectural SVG placeholder path under `/public/placeholders/` */
  placeholderSrc: string;
  /** Original upstream Unsplash CDN URL for reference/attribution */
  remoteSourceUrl: string;
  unsplashAssetId: string;
  region: string;
  alt: string;
  width: number;
  height: number;
}

export const PLACEHOLDER_PLATES = {
  architecture: "/placeholders/plate-architecture.svg",
  landscape: "/placeholders/plate-landscape.svg",
  coastline: "/placeholders/plate-coastline.svg",
} as const;

/**
 * Returns `true` when neutral placeholder mode is enabled via environment variable:
 * - `NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE === "true"`
 * - OR `NEXT_PUBLIC_ASSET_MODE === "placeholder"`
 */
export function isPlaceholderImageMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE === "true" ||
    process.env.NEXT_PUBLIC_ASSET_MODE === "placeholder"
  );
}

const PHOTO_DEMO_IMAGES = {
  istanbulBosphorus: "/demo/istanbul-bosphorus.jpg",
  suleymaniyeGoldenHorn: "/demo/suleymaniye-golden-horn.jpg",
  galataKarakoy: "/demo/galata-karakoy.jpg",
  cappadociaGoreme: "/demo/cappadocia-goreme.jpg",
  cappadociaIgnimbrite: "/demo/cappadocia-ignimbrite.jpg",
  ephesusCelsus: "/demo/ephesus-celsus.jpg",
  aegeanIonia: "/demo/aegean-ionia.jpg",
  lyciaKasCoast: "/demo/lycia-kas-coast.jpg",
  lyciaPataraHarbor: "/demo/lycia-patara-harbor.jpg",
  pamukkaleTravertines: "/demo/pamukkale-travertines.jpg",
} as const;

const PLACEHOLDER_DEMO_IMAGES: Record<keyof typeof PHOTO_DEMO_IMAGES, string> = {
  istanbulBosphorus: PLACEHOLDER_PLATES.coastline,
  suleymaniyeGoldenHorn: PLACEHOLDER_PLATES.architecture,
  galataKarakoy: PLACEHOLDER_PLATES.architecture,
  cappadociaGoreme: PLACEHOLDER_PLATES.landscape,
  cappadociaIgnimbrite: PLACEHOLDER_PLATES.landscape,
  ephesusCelsus: PLACEHOLDER_PLATES.architecture,
  aegeanIonia: PLACEHOLDER_PLATES.coastline,
  lyciaKasCoast: PLACEHOLDER_PLATES.coastline,
  lyciaPataraHarbor: PLACEHOLDER_PLATES.coastline,
  pamukkaleTravertines: PLACEHOLDER_PLATES.landscape,
};

export function getDemoImage(key: keyof typeof PHOTO_DEMO_IMAGES): string {
  return isPlaceholderImageMode()
    ? PLACEHOLDER_DEMO_IMAGES[key]
    : PHOTO_DEMO_IMAGES[key];
}

export const DEMO_IMAGES: Record<keyof typeof PHOTO_DEMO_IMAGES, string> = {
  get istanbulBosphorus() {
    return getDemoImage("istanbulBosphorus");
  },
  get suleymaniyeGoldenHorn() {
    return getDemoImage("suleymaniyeGoldenHorn");
  },
  get galataKarakoy() {
    return getDemoImage("galataKarakoy");
  },
  get cappadociaGoreme() {
    return getDemoImage("cappadociaGoreme");
  },
  get cappadociaIgnimbrite() {
    return getDemoImage("cappadociaIgnimbrite");
  },
  get ephesusCelsus() {
    return getDemoImage("ephesusCelsus");
  },
  get aegeanIonia() {
    return getDemoImage("aegeanIonia");
  },
  get lyciaKasCoast() {
    return getDemoImage("lyciaKasCoast");
  },
  get lyciaPataraHarbor() {
    return getDemoImage("lyciaPataraHarbor");
  },
  get pamukkaleTravertines() {
    return getDemoImage("pamukkaleTravertines");
  },
};

export const DEFAULT_DEMO_HERO_IMAGE = isPlaceholderImageMode()
  ? PLACEHOLDER_PLATES.coastline
  : PHOTO_DEMO_IMAGES.istanbulBosphorus;

export const DEFAULT_DEMO_TOUR_IMAGE = isPlaceholderImageMode()
  ? PLACEHOLDER_PLATES.landscape
  : PHOTO_DEMO_IMAGES.cappadociaGoreme;

export const DEMO_IMAGE_MANIFEST: Record<
  keyof typeof PHOTO_DEMO_IMAGES,
  DemoImageAsset
> = {
  istanbulBosphorus: {
    key: "istanbulBosphorus",
    src: getDemoImage("istanbulBosphorus"),
    placeholderSrc: PLACEHOLDER_PLATES.coastline,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1524231757912-21f4fe3a7200",
    region: "İstanbul & The Bosphorus",
    alt: "Morning ferry crossing the Bosphorus Strait toward Ortaköy in İstanbul, Türkiye",
    width: 1400,
    height: 933,
  },
  suleymaniyeGoldenHorn: {
    key: "suleymaniyeGoldenHorn",
    src: getDemoImage("suleymaniyeGoldenHorn"),
    placeholderSrc: PLACEHOLDER_PLATES.architecture,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1541432901042-2d8bd64b4a9b",
    region: "İstanbul / Upper Mesopotamia",
    alt: "Cascading domes and stone architecture illuminated at dusk",
    width: 1400,
    height: 933,
  },
  galataKarakoy: {
    key: "galataKarakoy",
    src: getDemoImage("galataKarakoy"),
    placeholderSrc: PLACEHOLDER_PLATES.architecture,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1527838832700-5059252407fa",
    region: "Galata, Beyoğlu, İstanbul",
    alt: "Galata Tower overlooking the Karaköy waterfront and Bosphorus",
    width: 1400,
    height: 933,
  },
  cappadociaGoreme: {
    key: "cappadociaGoreme",
    src: getDemoImage("cappadociaGoreme"),
    placeholderSrc: PLACEHOLDER_PLATES.landscape,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1570939274717-7eda259b50ed",
    region: "Cappadocia & Göreme Valleys",
    alt: "Tuff rock formations and dawn light across Göreme valley, Cappadocia",
    width: 1400,
    height: 933,
  },
  cappadociaIgnimbrite: {
    key: "cappadociaIgnimbrite",
    src: getDemoImage("cappadociaIgnimbrite"),
    placeholderSrc: PLACEHOLDER_PLATES.landscape,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1641128324972-af3212f0f6bd",
    region: "Cappadocia & Central Plateau",
    alt: "Differential erosion columns in the Cappadocian ignimbrite formations at dawn",
    width: 1400,
    height: 933,
  },
  ephesusCelsus: {
    key: "ephesusCelsus",
    src: getDemoImage("ephesusCelsus"),
    placeholderSrc: PLACEHOLDER_PLATES.architecture,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1589561454226-796a8aa89b05",
    region: "Ephesus & The Aegean Hinterland",
    alt: "Two-story marble facade of the Library of Celsus at Ephesus, Selçuk",
    width: 1400,
    height: 933,
  },
  aegeanIonia: {
    key: "aegeanIonia",
    src: getDemoImage("aegeanIonia"),
    placeholderSrc: PLACEHOLDER_PLATES.coastline,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1570077188670-e3a8d69ac5ff",
    region: "Ephesus & The Ionian Coast",
    alt: "Classical marble architecture and coastal vistas along the Aegean",
    width: 1400,
    height: 933,
  },
  lyciaKasCoast: {
    key: "lyciaKasCoast",
    src: getDemoImage("lyciaKasCoast"),
    placeholderSrc: PLACEHOLDER_PLATES.coastline,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1519046904884-53103b34b206",
    region: "Kaş & The Lycian Coast",
    alt: "Turquoise limestone cove along the Lycian Way near Kaş",
    width: 1400,
    height: 933,
  },
  lyciaPataraHarbor: {
    key: "lyciaPataraHarbor",
    src: getDemoImage("lyciaPataraHarbor"),
    placeholderSrc: PLACEHOLDER_PLATES.coastline,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1519451241324-20b4ea2c4220",
    region: "Patara & Kekova, Lycia",
    alt: "Limestone littoral and submerged harbor breakwaters between Kaş and Kekova Island",
    width: 1400,
    height: 933,
  },
  pamukkaleTravertines: {
    key: "pamukkaleTravertines",
    src: getDemoImage("pamukkaleTravertines"),
    placeholderSrc: PLACEHOLDER_PLATES.landscape,
    remoteSourceUrl:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1400&q=82",
    unsplashAssetId: "photo-1596394516093-501ba68a0ba6",
    region: "Hierapolis & Pamukkale Travertines",
    alt: "Mineral-rich thermal pools on the white travertine terraces of Pamukkale",
    width: 1400,
    height: 933,
  },
};

/**
 * Resolves any legacy remote Unsplash URL, `/demo/*.jpg` path, or empty fallback
 * to the active asset path (`/demo/*.jpg` in normal mode, or `/placeholders/*.svg`
 * when `NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE=true`).
 */
export function resolveDemoImageUrl(
  url?: string | null,
  fallback: string = DEFAULT_DEMO_HERO_IMAGE
): string {
  const placeholderActive = isPlaceholderImageMode();

  if (!url || typeof url !== "string") {
    return placeholderActive ? PLACEHOLDER_PLATES.architecture : fallback;
  }

  if (placeholderActive && url.startsWith("/demo/")) {
    if (url.includes("cappadocia") || url.includes("pamukkale")) {
      return PLACEHOLDER_PLATES.landscape;
    }
    if (url.includes("lycia") || url.includes("aegean") || url.includes("bosphorus")) {
      return PLACEHOLDER_PLATES.coastline;
    }
    return PLACEHOLDER_PLATES.architecture;
  }

  if (url.startsWith("/demo/") || url.startsWith("/placeholders/")) {
    return url;
  }

  if (url.includes("1524231757912-21f4fe3a7200")) {
    return getDemoImage("istanbulBosphorus");
  }
  if (url.includes("1541432901042-2d8bd64b4a9b")) {
    return getDemoImage("suleymaniyeGoldenHorn");
  }
  if (url.includes("1527838832700-5059252407fa")) {
    return getDemoImage("galataKarakoy");
  }
  if (url.includes("1570939274717-7eda259b50ed")) {
    return getDemoImage("cappadociaGoreme");
  }
  if (url.includes("1641128324972-af3212f0f6bd")) {
    return getDemoImage("cappadociaIgnimbrite");
  }
  if (url.includes("1589561454226-796a8aa89b05")) {
    return getDemoImage("ephesusCelsus");
  }
  if (url.includes("1570077188670-e3a8d69ac5ff")) {
    return getDemoImage("aegeanIonia");
  }
  if (url.includes("1519046904884-53103b34b206")) {
    return getDemoImage("lyciaKasCoast");
  }
  if (url.includes("1519451241324-20b4ea2c4220")) {
    return getDemoImage("lyciaPataraHarbor");
  }
  if (url.includes("1596394516093-501ba68a0ba6")) {
    return getDemoImage("pamukkaleTravertines");
  }

  return placeholderActive ? PLACEHOLDER_PLATES.architecture : url;
}
