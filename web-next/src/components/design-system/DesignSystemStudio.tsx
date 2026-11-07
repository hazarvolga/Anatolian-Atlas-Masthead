"use client";

import React, { useState } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import {
  normalizePresetId,
  THEME_PRESETS,
  type MotionLevel,
  type ThemeDensity,
  type ThemeMode,
  type ThemePresetId,
  type ThemeRadius,
} from "@/design/tokens";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CoordTag } from "@/components/ui/coord-tag";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  CountUpStat,
  MagneticCTA,
  SplitTextHeading,
  SpotlightTourCard,
  TiltRegionCard,
} from "@/components/motion";
import {
  Check,
  Copy,
  Loader2,
  Moon,
  RotateCcw,
  Sliders,
  Sun,
} from "lucide-react";

const PRESET_LIST = [
  THEME_PRESETS["atlas-editorial"],
  THEME_PRESETS["aegean-linen"],
  THEME_PRESETS["ottoman-noir"],
];

export default function DesignSystemStudio() {
  const {
    config,
    setPreset,
    setMode,
    setRadius,
    setDensity,
    setMotionLevel,
    setLayoutVariant,
    resetConfig,
  } = useDesignSystem();

  const [copiedConfig, setCopiedConfig] = useState(false);
  const activePreset = THEME_PRESETS[normalizePresetId(config.preset)];
  const activeModeTokens = activePreset.modes[config.mode];

  const configSnippet = `// web-next/src/config/theme.config.ts
export default {
  preset: '${config.preset}',
  mode: '${config.mode}',
  layout: {
    header: '${config.layout.header}',
    footer: '${config.layout.footer}',
    home: '${config.layout.home}',
    tourCard: '${config.layout.tourCard}',
    destinationIndex: '${config.layout.destinationIndex}',
    tourDetail: '${config.layout.tourDetail}',
  },
  motion: { level: '${config.motion.level}', smoothScroll: ${config.motion.smoothScroll} },
  radius: '${config.radius}',
  density: '${config.density}',
};`;

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(configSnippet);
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-20 pb-24">
      {/* Masthead Header */}
      <header className="border-b border-border bg-surface-container/40">
        <div className="container py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="editorial-kicker">
                System Specification — Phase 02
              </span>
              <CoordTag
                plate="STUDIO"
                coordinates="41.0256° N, 28.9742° E"
                elevation="GALATA"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">noindex · isolated chunk</Badge>
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset Defaults
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-fluid-4xl tracking-tight text-foreground">
                Anatolian Atlas Design System
              </h1>
              <p className="text-fluid-base text-text-secondary max-w-2xl">
                Three-layer token architecture (Primitive → Semantic → Component)
                with mathematically verified WCAG 2.2 AA/AAA contrast ratios and
                zero hardcoded component colors.
              </p>
            </div>
            <div className="lg:col-span-4 border-l border-border pl-6 space-y-1.5">
              <span className="editorial-meta block">Active Configuration</span>
              <p className="font-serif text-xl text-foreground">
                {activePreset.label} ({config.mode})
              </p>
              <p className="text-xs text-text-secondary">
                {activePreset.fonts.displayName} + {activePreset.fonts.sansName}
              </p>
              <p className="font-mono text-[11px] text-primary">
                {activePreset.fonts.license}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Live Theme Control Bar */}
      <section
        aria-label="Live Theme Controls"
        className="sticky top-[4.5rem] z-30 border-b border-border bg-background/95 backdrop-blur-md"
      >
        <div className="container py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Preset Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-meta mr-2 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-primary" />
              Preset:
            </span>
            {PRESET_LIST.map((preset) => {
              const isSelected = config.preset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPreset(preset.id as ThemePresetId, true)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-[0.13em] font-medium border rounded-control transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Orthogonal Controls: Mode, Radius, Density, Motion */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode */}
            <div className="inline-flex border border-border rounded-control overflow-hidden">
              {(["light", "dark"] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] inline-flex items-center gap-1.5 ${
                    config.mode === m
                      ? "bg-foreground text-background font-semibold"
                      : "bg-card text-text-secondary hover:text-foreground"
                  }`}
                >
                  {m === "light" ? (
                    <Sun className="h-3 w-3" />
                  ) : (
                    <Moon className="h-3 w-3" />
                  )}
                  {m}
                </button>
              ))}
            </div>

            {/* Radius */}
            <div className="inline-flex border border-border rounded-control overflow-hidden">
              {(["sharp", "soft"] as ThemeRadius[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] ${
                    config.radius === r
                      ? "bg-foreground text-background font-semibold"
                      : "bg-card text-text-secondary hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Density */}
            <div className="inline-flex border border-border rounded-control overflow-hidden">
              {(["airy", "comfortable"] as ThemeDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDensity(d)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] ${
                    config.density === d
                      ? "bg-foreground text-background font-semibold"
                      : "bg-card text-text-secondary hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Motion */}
            <div className="inline-flex border border-border rounded-control overflow-hidden">
              {(["full", "subtle", "off"] as MotionLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMotionLevel(lvl)}
                  className={`px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] ${
                    config.motion.level === lvl
                      ? "bg-foreground text-background font-semibold"
                      : "bg-card text-text-secondary hover:text-foreground"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-20 pt-14">
        {/* 00. Layout Engine & Section Registry Controls */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <span className="editorial-kicker block mb-2">
                00 / Layout Variant Engine & Section Registry
              </span>
              <h2 className="font-serif text-fluid-2xl">
                Config-Driven Structural Variants
              </h2>
            </div>
            <p className="text-xs font-mono text-text-secondary">
              URL Preview: <code>?home={config.layout.home}&amp;tourCard={config.layout.tourCard}</code>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                key: "home" as const,
                label: "Homepage Hero",
                options: ["masthead", "split-cinema"] as const,
              },
              {
                key: "destinationIndex" as const,
                label: "Destination Index",
                options: ["map-index", "grid-mosaic"] as const,
              },
              {
                key: "tourCard" as const,
                label: "Tour Card Layout",
                options: ["portrait-4x5", "landscape-row", "minimal-list"] as const,
              },
              {
                key: "header" as const,
                label: "Header Bar",
                options: ["swiss-bar", "centered-logo"] as const,
              },
              {
                key: "footer" as const,
                label: "Footer Colophon",
                options: ["atlas-columns", "big-wordmark"] as const,
              },
            ].map((group) => (
              <div
                key={group.key}
                className="border border-border bg-card rounded-card p-4 space-y-3"
              >
                <span className="editorial-meta block">{group.label}</span>
                <div className="flex flex-col gap-1.5">
                  {group.options.map((opt) => {
                    const active = config.layout[group.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLayoutVariant(group.key, opt as any)}
                        className={`text-left px-3 py-2 text-xs font-mono uppercase tracking-[0.11em] border rounded-control transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary font-semibold"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 01. Concept Presets & WCAG 2.2 Contrast Verification */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <span className="editorial-kicker block mb-2">
                01 / Concept Presets & Semantic Swatches
              </span>
              <h2 className="font-serif text-fluid-2xl">
                Semantic Palette — {activePreset.label} ({config.mode})
              </h2>
            </div>
            <p className="text-xs font-mono text-text-secondary">
              URL Preview: <code>?preset={config.preset}&amp;mode={config.mode}</code>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "color.bg.canvas",
                cssVar: "--color-bg-canvas",
                hex: activeModeTokens.bg.canvas,
                sampleClass: "bg-canvas text-ink border-border",
                contrastNote: "Base editorial page background",
              },
              {
                name: "color.bg.surface",
                cssVar: "--color-bg-surface",
                hex: activeModeTokens.bg.surface,
                sampleClass: "bg-surface text-ink border-border",
                contrastNote: "Elevated dossier & card surface",
              },
              {
                name: "color.text.primary",
                cssVar: "--color-text-primary",
                hex: activeModeTokens.text.primary,
                sampleClass: "bg-ink text-canvas border-border",
                contrastNote: "WCAG AAA (>13.4:1 on canvas)",
              },
              {
                name: "color.text.secondary",
                cssVar: "--color-text-secondary",
                hex: activeModeTokens.text.secondary,
                sampleClass: "bg-ink-secondary text-canvas border-border",
                contrastNote: "WCAG AA+ (>6.6:1 on canvas)",
              },
              {
                name: "color.accent.primary",
                cssVar: "--color-accent-primary",
                hex: activeModeTokens.accent.primary,
                sampleClass: "bg-primary text-primary-foreground border-primary",
                contrastNote: "WCAG AA (>5.7:1 with foreground)",
              },
              {
                name: "color.accent.subtle",
                cssVar: "--color-accent-subtle",
                hex: activeModeTokens.accent.subtle,
                sampleClass: "bg-primary-subtle text-primary border-border",
                contrastNote: "Quiet highlight & badge surface",
              },
              {
                name: "color.border.hairline",
                cssVar: "--color-border-hairline",
                hex: activeModeTokens.border.hairline,
                sampleClass: "bg-surface-container text-ink border-border",
                contrastNote: "1px Swiss architectural rule",
              },
              {
                name: "color.status.success",
                cssVar: "--color-status-success",
                hex: activeModeTokens.status.success,
                sampleClass: "bg-success text-success-foreground border-transparent",
                contrastNote: "WCAG AA (>6.2:1 verified)",
              },
            ].map((swatch) => (
              <div
                key={swatch.name}
                className="border border-border bg-card rounded-card overflow-hidden flex flex-col justify-between"
              >
                <div
                  className={`h-24 p-4 flex items-end justify-between border-b ${swatch.sampleClass}`}
                >
                  <span className="font-mono text-xs uppercase tracking-wider">
                    {swatch.hex}
                  </span>
                  <span className="font-mono text-[10px] opacity-80">Aa</span>
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-mono text-xs font-medium text-foreground">
                    {swatch.name}
                  </p>
                  <p className="font-mono text-[11px] text-text-secondary">
                    {swatch.cssVar}
                  </p>
                  <p className="text-xs text-text-secondary pt-1">
                    {swatch.contrastNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 02. Fluid Typography Scale & Licensed Font Pairings */}
        <section className="space-y-8">
          <div className="border-b border-border pb-5">
            <span className="editorial-kicker block mb-2">
              02 / Fluid Type Scale & SIL OFL Font Pairings
            </span>
            <h2 className="font-serif text-fluid-2xl">
              Editorial Hierarchy ({activePreset.fonts.displayName})
            </h2>
          </div>

          <div className="space-y-6 border border-border bg-card p-6 md:p-10 rounded-card">
            {[
              {
                token: "--font-size-display",
                spec: "clamp(2.85rem, 2.2rem + 3.6vw, 5.6rem)",
                className: "font-serif text-fluid-display leading-[0.98] tracking-[-0.032em]",
                sample: "Türkiye, place by place.",
              },
              {
                token: "--font-size-3xl",
                spec: "clamp(2.05rem, 1.72rem + 1.6vw, 2.95rem)",
                className: "font-serif text-fluid-3xl leading-[1.06] tracking-[-0.025em]",
                sample: "Plate I — Volcanic Valleys of Cappadocia",
              },
              {
                token: "--font-size-xl",
                spec: "clamp(1.32rem, 1.2rem + 0.58vw, 1.6rem)",
                className: "font-serif text-fluid-xl leading-[1.18]",
                sample: "Small-group archaeological dispatches led by regional historians.",
              },
              {
                token: "--font-size-base",
                spec: "clamp(0.98rem, 0.94rem + 0.22vw, 1.0625rem)",
                className: "font-sans text-fluid-base text-text-secondary max-w-3xl",
                sample:
                  "Morning walks follow rock-cut monastic valleys between Göreme and Çavuşin before mid-day crowds arrive, pairing private cave-church access with viticultural tastings on the high tuff plateau.",
              },
              {
                token: "--font-mono (Tabular Metadata)",
                spec: "0.6875rem / tracking 0.14em / tabular-nums",
                className: "editorial-meta",
                sample: "STAGE 02/04 · 38.6431° N, 34.8289° E · ELEVATION 1,240M · €2,480 PER GUEST",
              },
            ].map((row) => (
              <div
                key={row.token}
                className="grid lg:grid-cols-12 gap-4 items-baseline border-b border-border/60 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="lg:col-span-4 space-y-1">
                  <p className="font-mono text-xs text-primary">{row.token}</p>
                  <p className="font-mono text-[11px] text-text-secondary">
                    {row.spec}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className={row.className}>{row.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03. Core UI Primitives & Interactive States */}
        <section className="space-y-8">
          <div className="border-b border-border pb-5">
            <span className="editorial-kicker block mb-2">
              03 / Layer 3 Component Primitives
            </span>
            <h2 className="font-serif text-fluid-2xl">
              Buttons, Badges, Inputs, Cards & System States
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Buttons & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Button & Badge Variants</CardTitle>
                <CardDescription>
                  All variants inherit <code>--radius-control</code> ({config.radius}) and WCAG AA verified foreground contrast.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Primary Action</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline Dossier</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="default" disabled>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading State
                  </Button>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <span className="editorial-meta block">
                    Badges & Cartographic Tags
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="default">Featured Route</Badge>
                    <Badge variant="accent">Small Group · Max 10</Badge>
                    <Badge variant="secondary">8 Days / 7 Nights</Badge>
                    <Badge variant="outline">Autumn Window</Badge>
                    <Badge variant="success">Confirmed</Badge>
                    <Badge variant="warning">3 Berths Left</Badge>
                    <CoordTag
                      plate="PLATE IV"
                      coordinates="36.1993° N, 29.6397° E"
                      elevation="KAŞ"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Controls & Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Form Controls & Skeleton States</CardTitle>
                <CardDescription>
                  Minimum 46px touch height (WCAG 2.2 target size) with explicit focus rings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="studio-input-default"
                      className="form-label"
                    >
                      Traveller Full Name
                    </label>
                    <Input
                      id="studio-input-default"
                      placeholder="e.g. Clara Vance"
                      defaultValue="Clara Vance"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="studio-input-disabled"
                      className="form-label"
                    >
                      Dossier Reference (Locked)
                    </label>
                    <Input
                      id="studio-input-disabled"
                      disabled
                      value="NST-2026-CAP-04"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <span className="editorial-meta block">
                    Loading Skeletons
                  </span>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-20 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty & Error States */}
          <div className="grid lg:grid-cols-2 gap-8">
            <EmptyState
              kicker="Index — 00 Matches"
              title="No seasonal routes match your current filter"
              description="Try broadening your departure month or region filter, or request a bespoke private itinerary from our Galata planning desk."
              actionLabel="Reset All Filters"
              onAction={() => {}}
            />
            <ErrorState
              code="ERR_503 — ARCHIVE GATEWAY TIMEOUT"
              title="Live availability feed temporarily unreachable"
              description="Our reservation ledger did not respond within the expected window. Your selections remain preserved."
              onRetry={() => {}}
            />
          </div>
        </section>

        {/* 04. Clean-Room GSAP Micro-Components & Motion Architecture */}
        <section className="space-y-8">
          <div className="border-b border-border pb-5">
            <span className="editorial-kicker block mb-2">
              04 / Motion System & Clean-Room GSAP Primitives
            </span>
            <h2 className="font-serif text-fluid-2xl">
              Lenis + GSAP ScrollTrigger + 5 First-Party Micro-Components
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <SpotlightTourCard className="border border-border bg-card rounded-card p-6 space-y-4">
              <span className="editorial-meta block">
                01–03 / SplitText · CountUp · MagneticCTA
              </span>
              <SplitTextHeading
                as="h3"
                text="Stratigraphy at walking pace."
                className="font-serif text-2xl text-foreground"
              />
              <div className="py-3 border-y border-border flex items-baseline justify-between">
                <span className="text-xs text-text-secondary">
                  Verified Field Routes:
                </span>
                <span className="font-serif text-3xl text-primary">
                  <CountUpStat value={6} prefix="0" />
                </span>
              </div>
              <MagneticCTA>
                <Button variant="default" size="sm">
                  Magnetic Primary CTA
                </Button>
              </MagneticCTA>
            </SpotlightTourCard>

            <SpotlightTourCard className="border border-border bg-card rounded-card p-6 space-y-3">
              <span className="editorial-meta block">
                04 / SpotlightTourCard (Hover Cursor Radial)
              </span>
              <h3 className="font-serif text-2xl text-foreground">
                Warm Paper Radial Illumination
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Move your pointer across this card to inspect the zero-canvas GSAP quickTo radial spotlight mapped to <code>--spot-x</code> and <code>--spot-y</code>.
              </p>
            </SpotlightTourCard>

            <TiltRegionCard className="h-full">
              <div className="h-full border border-border bg-card rounded-card p-6 space-y-3">
                <span className="editorial-meta block">
                  05 / TiltRegionCard (Max ±3.2° Perspective)
                </span>
                <h3 className="font-serif text-2xl text-foreground">
                  Cartographic Plate Tilt
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Subtle 3D perspective rotation capped at ±3.2 degrees on fine pointers; automatically disabled on touch screens and reduced-motion.
                </p>
              </div>
            </TiltRegionCard>
          </div>
        </section>

        {/* 05. Exportable theme.config.ts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="editorial-kicker block mb-1">
                05 / Single Source Configuration
              </span>
              <h2 className="font-serif text-fluid-xl">
                Export <code>theme.config.ts</code>
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyConfig}>
              {copiedConfig ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Config
                </>
              )}
            </Button>
          </div>
          <pre className="p-6 border border-border bg-card rounded-card font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
            <code>{configSnippet}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
