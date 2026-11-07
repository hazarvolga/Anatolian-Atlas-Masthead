"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import defaultThemeConfig, { type ThemeConfig } from "@/config/theme.config";
import { siteConfig } from "@/config/site.config";
import {
  THEME_PRESETS,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
  type ThemeRadius,
} from "@/design/tokens";

const STORAGE_KEY = "nst_theme_config_v1";

interface DesignSystemContextValue {
  config: ThemeConfig;
  setPreset: (preset: ThemePresetId, syncDefaultMode?: boolean) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setRadius: (radius: ThemeRadius) => void;
  setDensity: (density: ThemeDensity) => void;
  setMotionLevel: (level: MotionLevel) => void;
  setLayoutVariant: <K extends keyof ThemeConfig["layout"]>(
    key: K,
    value: ThemeConfig["layout"][K]
  ) => void;
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

function resolveInitialConfig(): ThemeConfig {
  const nextConfig: ThemeConfig = {
    ...defaultThemeConfig,
    layout: { ...defaultThemeConfig.layout },
    motion: { ...defaultThemeConfig.motion },
  };

  if (typeof window === "undefined") {
    return nextConfig;
  }

  try {
    const savedRaw = window.localStorage.getItem(STORAGE_KEY);
    if (savedRaw) {
      const parsed = JSON.parse(savedRaw) as Partial<ThemeConfig>;
      if (parsed.preset && isValidPreset(parsed.preset)) {
        nextConfig.preset = parsed.preset;
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
    const qPreset = params.get("preset");
    const qMode = params.get("mode");
    const qRadius = params.get("radius");
    const qDensity = params.get("density");
    const qMotion = params.get("motion");
    const qHome = params.get("home");
    const qTourCard = params.get("tourCard");
    const qDestIndex = params.get("destinationIndex");
    const qHeader = params.get("header");
    const qFooter = params.get("footer");

    if (isValidPreset(qPreset)) {
      nextConfig.preset = qPreset;
      if (!isValidMode(qMode)) {
        nextConfig.mode = THEME_PRESETS[qPreset].defaultMode;
      }
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
      qTourCard === "minimal-list"
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
  }

  return nextConfig;
}

function applyAttributesToDocument(cfg: ThemeConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", cfg.preset);
  root.setAttribute("data-mode", cfg.mode);
  root.setAttribute("data-radius", cfg.radius);
  root.setAttribute("data-density", cfg.density);
  root.setAttribute("data-motion", cfg.motion.level);

  if (cfg.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);

  useEffect(() => {
    const initial = resolveInitialConfig();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfig(initial);
    applyAttributesToDocument(initial);
  }, []);

  const persistAndApply = useCallback(
    (updater: (prev: ThemeConfig) => ThemeConfig) => {
      setConfig((prev) => {
        const updated = updater(prev);
        applyAttributesToDocument(updated);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage write errors
        }
        return updated;
      });
    },
    []
  );

  const setPreset = useCallback(
    (preset: ThemePresetId, syncDefaultMode = true) => {
      persistAndApply((prev) => ({
        ...prev,
        preset,
        mode: syncDefaultMode ? THEME_PRESETS[preset].defaultMode : prev.mode,
      }));
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

  const resetConfig = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setConfig(defaultThemeConfig);
    applyAttributesToDocument(defaultThemeConfig);
  }, []);

  const value = useMemo(
    () => ({
      config,
      setPreset,
      setMode,
      toggleMode,
      setRadius,
      setDensity,
      setMotionLevel,
      setLayoutVariant,
      resetConfig,
    }),
    [
      config,
      setPreset,
      setMode,
      toggleMode,
      setRadius,
      setDensity,
      setMotionLevel,
      setLayoutVariant,
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
    throw new Error("useDesignSystem must be used within a DesignSystemProvider");
  }
  return ctx;
}
