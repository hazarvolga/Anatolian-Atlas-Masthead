import type {
  MotionLevel,
  ThemeDensity,
  ThemeMode,
  ThemePresetId,
  ThemeRadius,
} from "@/design/tokens";

export type HeaderLayoutVariant =
  | "swiss-bar"
  | "centered-logo"
  | "minimal-overlay"
  | "sidebar-rail";

export type FooterLayoutVariant =
  | "atlas-columns"
  | "minimal"
  | "big-wordmark";

export type HomeLayoutVariant =
  | "masthead"
  | "split-cinema"
  | "fullscreen-reel"
  | "editorial-index";

export type TourCardVariant =
  | "portrait-4x5"
  | "landscape-row"
  | "minimal-list";

export type DestinationIndexVariant =
  | "map-index"
  | "grid-mosaic"
  | "horizontal-scroll";

export type TourDetailVariant =
  | "dossier"
  | "story-scroll"
  | "tabs";

export interface ThemeConfig {
  preset: ThemePresetId;
  mode: ThemeMode;
  layout: {
    header: HeaderLayoutVariant;
    footer: FooterLayoutVariant;
    home: HomeLayoutVariant;
    tourCard: TourCardVariant;
    destinationIndex: DestinationIndexVariant;
    tourDetail: TourDetailVariant;
  };
  motion: {
    level: MotionLevel;
    smoothScroll: boolean;
  };
  radius: ThemeRadius;
  density: ThemeDensity;
}

export const themeConfig: ThemeConfig = {
  preset: "atlas-editorial",
  mode: "light",
  layout: {
    header: "swiss-bar",
    footer: "atlas-columns",
    home: "masthead",
    tourCard: "portrait-4x5",
    destinationIndex: "map-index",
    tourDetail: "dossier",
  },
  motion: {
    level: "full",
    smoothScroll: true,
  },
  radius: "sharp",
  density: "airy",
};

export default themeConfig;
