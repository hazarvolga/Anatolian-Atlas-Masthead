"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import defaultThemeConfig, {
  resolveThemeFromConcept,
  type ThemeConfig,
} from "@/config/theme.config";
import { isDemoMode, siteConfig } from "@/config/site.config";
import {
  normalizePresetId,
  THEME_PRESETS,
  type CanonicalConceptId,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
  type ThemeRadius,
} from "@/design/tokens";
import { getConceptPack, type ConceptPack } from "@/design/concepts";

const STORAGE_KEY = "nst_theme_config_v1";
const COOKIE_KEY = "nst_theme_config";

interface DesignSystemContextValue {
  config: ThemeConfig;
  concept: ConceptPack;
  canonicalPreset: CanonicalConceptId;
  setPreset: (preset: ThemePresetId, syncConceptDefaults?: boolean) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setRadius: (radius: ThemeRadius) => void;
  setDensity: (density: ThemeDensity) => void;
  setMotionLevel: (level: MotionLevel) => void;
  setLayoutVariant: <K extends keyof ThemeConfig["layout"]>(
    key: K,
    value: ThemeConfig["layout"][K]
  ) => void;
  replaceConfig: (nextConfig: ThemeConfig) => void;
  resetConfig: () => void;
}

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(
  undefined
);

function isValidPreset(val: string | null): val is ThemePresetId {
  return Boolean(val && val in THEME_PRESETS);
}

function isValidMode(val: string | null): val is ThemeMode {
  return val === "light" || val === "dark";
}

function isValidRadius(val: string | null): val is ThemeRadius {
  return val === "sharp" || val === "soft";
}

function isValidDensity(val: string | null): val is ThemeDensity {
  return val === "airy" || val === "comfortable";
}

function isValidMotion(val: string | null): val is MotionLevel {
  return val === "full" || val === "subtle" || val === "off";
}

function readThemeCookie(): Partial<ThemeConfig> | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_KEY}=`));
    if (!match) return null;
    const rawVal = match.slice(COOKIE_KEY.length + 1);
    return JSON.parse(decodeURIComponent(rawVal)) as Partial<ThemeConfig>;
  } catch {
    return null;
  }
}

function resolveInitialConfig(
  baseConfig: ThemeConfig = defaultThemeConfig
): ThemeConfig {
  let nextConfig: ThemeConfig = {
    ...baseConfig,
    preset: normalizePresetId(baseConfig.preset),
    layout: { ...baseConfig.layout },
    motion: { ...baseConfig.motion },
  };

  // Client-side overrides (`nst_theme_config` cookie/localStorage and `?preset=` URL preview)
  // are ONLY enabled when `NEXT_PUBLIC_DEMO_MODE=true` (`isDemoMode() === true`).
  if (typeof window === "undefined" || !isDemoMode()) {
    return nextConfig;
  }

  try {
    const cookieParsed = readThemeCookie();
    const savedRaw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: Partial<ThemeConfig> | null =
      cookieParsed || (savedRaw ? (JSON.parse(savedRaw) as Partial<ThemeConfig>) : null);

    if (parsed) {
      if (parsed.preset && isValidPreset(parsed.preset)) {
        nextConfig = resolveThemeFromConcept(parsed.preset);
      }
      if (parsed.mode && isValidMode(parsed.mode)) {
        nextConfig.mode = parsed.mode;
      }
      if (parsed.radius && isValidRadius(parsed.radius)) {
        nextConfig.radius = parsed.radius;
      }
      if (parsed.density && isValidDensity(parsed.density)) {
        nextConfig.density = parsed.density;
      }
      if (parsed.motion?.level && isValidMotion(parsed.motion.level)) {
        nextConfig.motion.level = parsed.motion.level;
      }
      if (parsed.layout && typeof parsed.layout === "object") {
        nextConfig.layout = {
          ...nextConfig.layout,
          ...parsed.layout,
        };
      }
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }

  if (siteConfig.features.allowUrlThemePreview) {
    const params = new URLSearchParams(window.location.search);
    const qPreset = params.get("preset") || params.get("concept");
    const qMode = params.get("mode");
    const qRadius = params.get("radius");
    const qDensity = params.get("density");
    const qMotion = params.get("motion");
    const qHome = params.get("home");
    const qTourCard = params.get("tourCard");
    const qDestIndex = params.get("destinationIndex");
    const qHeader = params.get("header");
    const qFooter = params.get("footer");
    const qTourDetail = params.get("tourDetail");

    if (isValidPreset(qPreset)) {
      // Switching preset via ?preset= loads the complete ConceptPack identity
      nextConfig = resolveThemeFromConcept(qPreset);
    }
    if (isValidMode(qMode)) nextConfig.mode = qMode;
    if (isValidRadius(qRadius)) nextConfig.radius = qRadius;
    if (isValidDensity(qDensity)) nextConfig.density = qDensity;
    if (isValidMotion(qMotion)) nextConfig.motion.level = qMotion;

    if (
      qHome === "masthead" ||
      qHome === "split-cinema" ||
      qHome === "fullscreen-reel" ||
      qHome === "editorial-index"
    ) {
      nextConfig.layout.home = qHome;
    }
    if (
      qTourCard === "portrait-4x5" ||
      qTourCard === "landscape-row" ||
      qTourCard === "minimal-list" ||
      qTourCard === "full-bleed-minimal"
    ) {
      nextConfig.layout.tourCard = qTourCard;
    }
    if (
      qDestIndex === "map-index" ||
      qDestIndex === "grid-mosaic" ||
      qDestIndex === "horizontal-scroll"
    ) {
      nextConfig.layout.destinationIndex = qDestIndex;
    }
    if (
      qHeader === "swiss-bar" ||
      qHeader === "centered-logo" ||
      qHeader === "minimal-overlay" ||
      qHeader === "sidebar-rail"
    ) {
      nextConfig.layout.header = qHeader;
    }
    if (
      qFooter === "atlas-columns" ||
      qFooter === "minimal" ||
      qFooter === "big-wordmark"
    ) {
      nextConfig.layout.footer = qFooter;
    }
    if (
      qTourDetail === "dossier" ||
      qTourDetail === "story-scroll" ||
      qTourDetail === "tabs"
    ) {
      nextConfig.layout.tourDetail = qTourDetail;
    }
  }

  return nextConfig;
}

function applyAttributesToDocument(cfg: ThemeConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const canonical = normalizePresetId(cfg.preset);
  const concept = getConceptPack(canonical);

  root.setAttribute("data-theme", canonical);
  root.setAttribute("data-concept", canonical);
  root.setAttribute("data-mode", cfg.mode);
  root.setAttribute("data-radius", cfg.radius);
  root.setAttribute("data-density", cfg.density);
  root.setAttribute("data-motion", cfg.motion.level);
  root.setAttribute("data-frame", concept.shape.frameStyle);
  root.setAttribute("data-ornament", concept.shape.ornamentSvg);
  root.setAttribute("data-entrance", concept.motion.entrance);
  root.setAttribute(
    "data-vignette",
    concept.imageTreatment.vignette ? "true" : "false"
  );
  root.setAttribute(
    "data-grain",
    concept.imageTreatment.grain ? "true" : "false"
  );

  if (cfg.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function writeThemeCookie(cfg: ThemeConfig | null) {
  if (typeof document === "undefined" || !isDemoMode()) return;
  try {
    if (!cfg) {
      document.cookie = `${COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
      return;
    }
    const serialized = encodeURIComponent(JSON.stringify(cfg));
    document.cookie = `${COOKIE_KEY}=${serialized}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    // Ignore cookie write errors
  }
}

export function DesignSystemProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: ThemeConfig;
}) {
  const baseInitial = initialConfig || defaultThemeConfig;
  const [config, setConfig] = useState<ThemeConfig>(() => ({
    ...baseInitial,
    preset: normalizePresetId(baseInitial.preset),
  }));

  useEffect(() => {
    const initial = resolveInitialConfig(baseInitial);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig(initial);
    applyAttributesToDocument(initial);
  }, [baseInitial]);

  const persistAndApply = useCallback(
    (updater: (prev: ThemeConfig) => ThemeConfig) => {
      setConfig((prev) => {
        const updated = updater(prev);
        applyAttributesToDocument(updated);
        if (isDemoMode()) {
          writeThemeCookie(updated);
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // Ignore storage write errors
          }
        }
        return updated;
      });
    },
    []
  );

  const setPreset = useCallback(
    (preset: ThemePresetId, syncConceptDefaults = true) => {
      persistAndApply((prev) => {
        if (syncConceptDefaults) {
          return resolveThemeFromConcept(preset);
        }
        const canonical = normalizePresetId(preset);
        return {
          ...prev,
          preset: canonical,
        };
      });
    },
    [persistAndApply]
  );

  const setMode = useCallback(
    (mode: ThemeMode) => {
      persistAndApply((prev) => ({ ...prev, mode }));
    },
    [persistAndApply]
  );

  const toggleMode = useCallback(() => {
    persistAndApply((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, [persistAndApply]);

  const setRadius = useCallback(
    (radius: ThemeRadius) => {
      persistAndApply((prev) => ({ ...prev, radius }));
    },
    [persistAndApply]
  );

  const setDensity = useCallback(
    (density: ThemeDensity) => {
      persistAndApply((prev) => ({ ...prev, density }));
    },
    [persistAndApply]
  );

  const setMotionLevel = useCallback(
    (level: MotionLevel) => {
      persistAndApply((prev) => ({
        ...prev,
        motion: { ...prev.motion, level },
      }));
    },
    [persistAndApply]
  );

  const setLayoutVariant = useCallback(
    <K extends keyof ThemeConfig["layout"]>(
      key: K,
      value: ThemeConfig["layout"][K]
    ) => {
      persistAndApply((prev) => ({
        ...prev,
        layout: {
          ...prev.layout,
          [key]: value,
        },
      }));
    },
    [persistAndApply]
  );

  const replaceConfig = useCallback(
    (nextConfig: ThemeConfig) => {
      persistAndApply(() => ({
        ...nextConfig,
        preset: normalizePresetId(nextConfig.preset),
        layout: { ...nextConfig.layout },
        motion: { ...nextConfig.motion },
      }));
    },
    [persistAndApply]
  );

  const resetConfig = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    writeThemeCookie(null);
    setConfig(defaultThemeConfig);
    applyAttributesToDocument(defaultThemeConfig);
  }, []);

  const canonicalPreset = normalizePresetId(config.preset);
  const concept = useMemo(
    () => getConceptPack(canonicalPreset),
    [canonicalPreset]
  );

  const value = useMemo(
    () => ({
      config,
      concept,
      canonicalPreset,
      setPreset,
      setMode,
      toggleMode,
      setRadius,
      setDensity,
      setMotionLevel,
      setLayoutVariant,
      replaceConfig,
      resetConfig,
    }),
    [
      config,
      concept,
      canonicalPreset,
      setPreset,
      setMode,
      toggleMode,
      setRadius,
      setDensity,
      setMotionLevel,
      setLayoutVariant,
      replaceConfig,
      resetConfig,
    ]
  );

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem(): DesignSystemContextValue {
  const ctx = useContext(DesignSystemContext);
  if (!ctx) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    );
  }
  return ctx;
}
