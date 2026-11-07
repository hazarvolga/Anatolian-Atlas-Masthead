/**
 * Centralized Demo Image Registry (`src/lib/data/demo-images.ts`)
 *
 * All demo photographic plates are stored as local optimized copies under
 * `/public/demo/*.jpg` and served via Next.js `<Image>` in AVIF/WebP formats.
 * Original Unsplash source URLs, IDs, and license details are documented in
 * `docs/ASSETS_CREDITS.md`.
 */

export interface DemoImageAsset {
  key: string;
  /** Local optimized asset path under `public/demo/` */
  src: string;
  /** Original upstream Unsplash CDN URL for reference/attribution */
  remoteSourceUrl: string;
  unsplashAssetId: string;
  region: string;
  alt: string;
  width: number;
  height: number;
}

export const DEMO_IMAGES = {
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

export const DEFAULT_DEMO_HERO_IMAGE = DEMO_IMAGES.istanbulBosphorus;
export const DEFAULT_DEMO_TOUR_IMAGE = DEMO_IMAGES.cappadociaGoreme;

export const DEMO_IMAGE_MANIFEST: Record<
  keyof typeof DEMO_IMAGES,
  DemoImageAsset
> = {
  istanbulBosphorus: {
    key: "istanbulBosphorus",
    src: DEMO_IMAGES.istanbulBosphorus,
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
    src: DEMO_IMAGES.suleymaniyeGoldenHorn,
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
    src: DEMO_IMAGES.galataKarakoy,
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
    src: DEMO_IMAGES.cappadociaGoreme,
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
    src: DEMO_IMAGES.cappadociaIgnimbrite,
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
    src: DEMO_IMAGES.ephesusCelsus,
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
    src: DEMO_IMAGES.aegeanIonia,
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
    src: DEMO_IMAGES.lyciaKasCoast,
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
    src: DEMO_IMAGES.lyciaPataraHarbor,
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
    src: DEMO_IMAGES.pamukkaleTravertines,
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
 * Resolves any legacy remote Unsplash URL or empty fallback to the local
 * optimized `/demo/*.jpg` asset path so `next/image` serves local AVIF/WebP.
 */
export function resolveDemoImageUrl(
  url?: string | null,
  fallback: string = DEFAULT_DEMO_HERO_IMAGE
): string {
  if (!url || typeof url !== "string") return fallback;
  if (url.startsWith("/demo/")) return url;

  if (url.includes("1524231757912-21f4fe3a7200")) {
    return DEMO_IMAGES.istanbulBosphorus;
  }
  if (url.includes("1541432901042-2d8bd64b4a9b")) {
    return DEMO_IMAGES.suleymaniyeGoldenHorn;
  }
  if (url.includes("1527838832700-5059252407fa")) {
    return DEMO_IMAGES.galataKarakoy;
  }
  if (url.includes("1570939274717-7eda259b50ed")) {
    return DEMO_IMAGES.cappadociaGoreme;
  }
  if (url.includes("1641128324972-af3212f0f6bd")) {
    return DEMO_IMAGES.cappadociaIgnimbrite;
  }
  if (url.includes("1589561454226-796a8aa89b05")) {
    return DEMO_IMAGES.ephesusCelsus;
  }
  if (url.includes("1570077188670-e3a8d69ac5ff")) {
    return DEMO_IMAGES.aegeanIonia;
  }
  if (url.includes("1519046904884-53103b34b206")) {
    return DEMO_IMAGES.lyciaKasCoast;
  }
  if (url.includes("1519451241324-20b4ea2c4220")) {
    return DEMO_IMAGES.lyciaPataraHarbor;
  }
  if (url.includes("1596394516093-501ba68a0ba6")) {
    return DEMO_IMAGES.pamukkaleTravertines;
  }

  return url;
}
