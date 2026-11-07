#!/usr/bin/env node
/**
 * Build-time Token Compiler & WCAG 2.2 Contrast Verifier
 * Reads the 3-layer token architecture (primitives -> semantic.<preset> -> components),
 * verifies WCAG 2.2 AA/AAA contrast ratios mathematically, and outputs:
 *   1. web-next/src/styles/themes.generated.css
 *   2. docs/TOKEN_CONTRAST_REPORT.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webNextRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webNextRoot, "..");

// --- Color Math Utilities (W3C WCAG 2.2 Relative Luminance & HSL Conversion) ---

function parseHex(hex) {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex) {
  const [r8, g8, b8] = parseHex(hex);
  const toLinear = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r8);
  const G = toLinear(g8);
  const B = toLinear(b8);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToHslTriplet(hex) {
  const [r255, g255, b255] = parseHex(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 1000) / 10;
  const lPct = Math.round(l * 1000) / 10;
  return `${hDeg} ${sPct}% ${lPct}%`;
}

// --- Preset Definitions (Mirroring src/design/tokens/semantic.*.ts) ---

const PRESETS = [
  {
    id: "atlas-editorial",
    aliases: ["anatolian-atlas"],
    label: "Atlas Editorial",
    character: "Warm limestone paper, deep cypress ink, carnelian terracotta, cartographic monograph.",
    defaultMode: "light",
    typeScaleRatio: 1.25,
    spacingMultiplier: 1.0,
    imageFilter: "contrast(1.02) saturate(0.98)",
    fonts: {
      displayVar: "var(--font-display-atlas), Georgia, serif",
      sansVar: "var(--font-sans-atlas), -apple-system, BlinkMacSystemFont, sans-serif",
      monoVar: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
      displayName: "Newsreader (Optical Serif)",
      sansName: "Source Sans 3 (Humanist Sans)",
      monoName: "IBM Plex Mono",
      license: "SIL Open Font License 1.1 (Google Fonts)",
    },
    modes: {
      light: {
        bg: {
          canvas: "#F4F1EA",
          surface: "#FAF8F3",
          elevated: "#FFFFFF",
          muted: "#EBE7DD",
          glass: "rgba(244, 241, 234, 0.92)",
        },
        text: {
          primary: "#162927",
          secondary: "#485855",
          muted: "#354441",
          disabled: "#857F72",
          inverse: "#FAF8F3",
        },
        accent: {
          primary: "#9E402C",
          hover: "#823221",
          subtle: "#F3E3DE",
          foreground: "#FAF8F3",
        },
        border: {
          hairline: "#D8D3C6",
          strong: "#162927",
          focus: "#9E402C",
        },
        status: {
          success: "#1D6849",
          successForeground: "#FAF8F3",
          warning: "#8A5A00",
          warningForeground: "#FAF8F3",
          danger: "#A8241A",
          dangerForeground: "#FAF8F3",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(22, 41, 39, 0.04)",
          md: "0 6px 18px -4px rgba(22, 41, 39, 0.07)",
          lg: "0 18px 36px -10px rgba(22, 41, 39, 0.11)",
        },
      },
      dark: {
        bg: {
          canvas: "#101918",
          surface: "#162220",
          elevated: "#1C2B29",
          muted: "#1F302D",
          glass: "rgba(16, 25, 24, 0.92)",
        },
        text: {
          primary: "#EDEAE2",
          secondary: "#A9B8B5",
          muted: "#8EA39F",
          disabled: "#485855",
          inverse: "#101918",
        },
        accent: {
          primary: "#D47A66",
          hover: "#E29584",
          subtle: "#2C201E",
          foreground: "#101918",
        },
        border: {
          hairline: "#283A37",
          strong: "#EDEAE2",
          focus: "#D47A66",
        },
        status: {
          success: "#52B788",
          successForeground: "#101918",
          warning: "#EAB308",
          warningForeground: "#101918",
          danger: "#F07167",
          dangerForeground: "#101918",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
          md: "0 8px 20px -4px rgba(0, 0, 0, 0.45)",
          lg: "0 20px 42px -10px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  {
    id: "aegean-linen",
    aliases: [],
    label: "Aegean Linen",
    character: "Sunbleached linen, whitewashed limestone, calm pelagic teal, tactile coastal stillness.",
    defaultMode: "light",
    typeScaleRatio: 1.333,
    spacingMultiplier: 1.25,
    imageFilter: "brightness(1.04) contrast(0.96) saturate(0.92) sepia(0.06)",
    fonts: {
      displayVar: "var(--font-display-aegean), Georgia, serif",
      sansVar: "var(--font-sans-aegean), -apple-system, BlinkMacSystemFont, sans-serif",
      monoVar: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
      displayName: "Fraunces (Soft Optical Serif)",
      sansName: "Instrument Sans (Contemporary Gallery Sans)",
      monoName: "IBM Plex Mono",
      license: "SIL Open Font License 1.1 (Google Fonts)",
    },
    modes: {
      light: {
        bg: {
          canvas: "#F5F2EB",
          surface: "#FCFBF8",
          elevated: "#FFFFFF",
          muted: "#EAE5DA",
          glass: "rgba(245, 242, 235, 0.92)",
        },
        text: {
          primary: "#18262E",
          secondary: "#465862",
          muted: "#31424B",
          disabled: "#7E776A",
          inverse: "#FCFBF8",
        },
        accent: {
          primary: "#1F5E63",
          hover: "#17484C",
          subtle: "#DFECEE",
          foreground: "#FCFBF8",
        },
        border: {
          hairline: "#D6CFC1",
          strong: "#18262E",
          focus: "#1F5E63",
        },
        status: {
          success: "#1D6849",
          successForeground: "#FCFBF8",
          warning: "#8A5A00",
          warningForeground: "#FCFBF8",
          danger: "#A8241A",
          dangerForeground: "#FCFBF8",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(24, 38, 46, 0.04)",
          md: "0 6px 18px -4px rgba(24, 38, 46, 0.07)",
          lg: "0 18px 36px -10px rgba(24, 38, 46, 0.11)",
        },
      },
      dark: {
        bg: {
          canvas: "#0F181D",
          surface: "#162229",
          elevated: "#1C2B34",
          muted: "#1F303A",
          glass: "rgba(15, 24, 29, 0.92)",
        },
        text: {
          primary: "#EEF2F4",
          secondary: "#A6B8C0",
          muted: "#9EB0B8",
          disabled: "#465862",
          inverse: "#0F181D",
        },
        accent: {
          primary: "#63B0B6",
          hover: "#7DC0C5",
          subtle: "#172D31",
          foreground: "#0F181D",
        },
        border: {
          hairline: "#263842",
          strong: "#EEF2F4",
          focus: "#63B0B6",
        },
        status: {
          success: "#52B788",
          successForeground: "#0F181D",
          warning: "#EAB308",
          warningForeground: "#0F181D",
          danger: "#F07167",
          dangerForeground: "#0F181D",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
          md: "0 8px 20px -4px rgba(0, 0, 0, 0.45)",
          lg: "0 20px 42px -10px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  {
    id: "ottoman-noir",
    aliases: [],
    label: "Ottoman Noir",
    character: "Nocturnal basalt charcoal, silk parchment, pale antique gold, private evening salon.",
    defaultMode: "dark",
    typeScaleRatio: 1.38,
    spacingMultiplier: 1.15,
    imageFilter: "brightness(0.9) contrast(1.12) saturate(0.84) sepia(0.12)",
    fonts: {
      displayVar: "var(--font-display-noir), Georgia, serif",
      sansVar: "var(--font-sans-noir), -apple-system, BlinkMacSystemFont, sans-serif",
      monoVar: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
      displayName: "Bodoni Moda (High-Contrast Didone Serif)",
      sansName: "Albert Sans (Architectural Geometric Sans)",
      monoName: "IBM Plex Mono",
      license: "SIL Open Font License 1.1 (Google Fonts)",
    },
    modes: {
      light: {
        bg: {
          canvas: "#F3EFEA",
          surface: "#FAF7F2",
          elevated: "#FFFFFF",
          muted: "#E7E1D8",
          glass: "rgba(243, 239, 234, 0.92)",
        },
        text: {
          primary: "#171615",
          secondary: "#524E4A",
          muted: "#3D3A36",
          disabled: "#8A8479",
          inverse: "#FAF7F2",
        },
        accent: {
          primary: "#7A5828",
          hover: "#5F431C",
          subtle: "#EFE6D5",
          foreground: "#FAF7F2",
        },
        border: {
          hairline: "#D3CBC0",
          strong: "#171615",
          focus: "#7A5828",
        },
        status: {
          success: "#1D6849",
          successForeground: "#FAF7F2",
          warning: "#8A5A00",
          warningForeground: "#FAF7F2",
          danger: "#A8241A",
          dangerForeground: "#FAF7F2",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(23, 22, 21, 0.04)",
          md: "0 6px 18px -4px rgba(23, 22, 21, 0.07)",
          lg: "0 18px 36px -10px rgba(23, 22, 21, 0.11)",
        },
      },
      dark: {
        bg: {
          canvas: "#121316",
          surface: "#1A1C20",
          elevated: "#1E2025",
          muted: "#26282E",
          glass: "rgba(18, 19, 22, 0.92)",
        },
        text: {
          primary: "#EDE8DD",
          secondary: "#B3ADA1",
          muted: "#A8A296",
          disabled: "#524E4A",
          inverse: "#121316",
        },
        accent: {
          primary: "#C8A464",
          hover: "#DEC089",
          subtle: "#2A251B",
          foreground: "#121316",
        },
        border: {
          hairline: "#2B2E36",
          strong: "#EDE8DD",
          focus: "#C8A464",
        },
        status: {
          success: "#52B788",
          successForeground: "#121316",
          warning: "#EAB308",
          warningForeground: "#121316",
          danger: "#F07167",
          dangerForeground: "#121316",
        },
        shadow: {
          sm: "0 1px 2px 0 rgba(0, 0, 0, 0.45)",
          md: "0 8px 20px -4px rgba(0, 0, 0, 0.55)",
          lg: "0 20px 42px -10px rgba(0, 0, 0, 0.7)",
        },
      },
    },
  },
];

// --- 1. Verify WCAG 2.2 AA Contrast Ratios ---

const reportRows = [];
let hasFailure = false;

for (const preset of PRESETS) {
  for (const modeName of ["light", "dark"]) {
    const m = preset.modes[modeName];
    const checks = [
      { pair: "text.primary / bg.canvas", fg: m.text.primary, bg: m.bg.canvas, min: 4.5 },
      { pair: "text.primary / bg.surface", fg: m.text.primary, bg: m.bg.surface, min: 4.5 },
      { pair: "text.secondary / bg.canvas", fg: m.text.secondary, bg: m.bg.canvas, min: 4.5 },
      { pair: "text.secondary / bg.surface", fg: m.text.secondary, bg: m.bg.surface, min: 4.5 },
      { pair: "text.muted / bg.canvas", fg: m.text.muted, bg: m.bg.canvas, min: 4.5 },
      { pair: "accent.fg / accent.primary", fg: m.accent.foreground, bg: m.accent.primary, min: 4.5 },
      { pair: "accent.primary / bg.canvas (Large/UI)", fg: m.accent.primary, bg: m.bg.canvas, min: 3.0 },
      { pair: "status.successFg / status.success", fg: m.status.successForeground, bg: m.status.success, min: 4.5 },
      { pair: "status.warningFg / status.warning", fg: m.status.warningForeground, bg: m.status.warning, min: 4.5 },
      { pair: "status.dangerFg / status.danger", fg: m.status.dangerForeground, bg: m.status.danger, min: 4.5 },
    ];

    for (const c of checks) {
      const ratio = contrastRatio(c.fg, c.bg);
      const passAA = ratio >= c.min;
      const grade = ratio >= 7.0 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3.0 ? "AA Large" : "FAIL";
      if (!passAA) {
        hasFailure = true;
        console.error(
          `[WCAG FAIL] ${preset.id} (${modeName}) — ${c.pair}: ${c.fg} on ${c.bg} = ${ratio.toFixed(2)}:1 (min ${c.min}:1)`
        );
      }
      reportRows.push({
        preset: preset.id,
        mode: modeName,
        pair: c.pair,
        fg: c.fg,
        bg: c.bg,
        ratio: ratio.toFixed(2),
        min: c.min.toFixed(1),
        grade,
        pass: passAA,
      });
    }
  }
}

if (hasFailure) {
  process.exit(1);
}

// --- 2. Generate CSS Custom Properties (Layer 1 + Layer 2 + Layer 3) ---

function renderModeVariables(preset, modeName) {
  const m = preset.modes[modeName];
  return `
    /* Font Stack & Concept Pack Scales (Preset: ${preset.label}) */
    --font-serif: ${preset.fonts.displayVar};
    --font-sans: ${preset.fonts.sansVar};
    --font-mono: ${preset.fonts.monoVar};
    --concept-type-scale: ${preset.typeScaleRatio};
    --concept-spacing-multiplier: ${preset.spacingMultiplier};
    --concept-img-filter: ${preset.imageFilter};

    /* Layer 2: Semantic Hex Tokens */
    --color-bg-canvas: ${m.bg.canvas};
    --color-bg-surface: ${m.bg.surface};
    --color-bg-elevated: ${m.bg.elevated};
    --color-bg-muted: ${m.bg.muted};
    --color-bg-glass: ${m.bg.glass};

    --color-text-primary: ${m.text.primary};
    --color-text-secondary: ${m.text.secondary};
    --color-text-muted: ${m.text.muted};
    --color-text-disabled: ${m.text.disabled};
    --color-text-inverse: ${m.text.inverse};

    --color-accent-primary: ${m.accent.primary};
    --color-accent-hover: ${m.accent.hover};
    --color-accent-subtle: ${m.accent.subtle};
    --color-accent-foreground: ${m.accent.foreground};

    --color-border-hairline: ${m.border.hairline};
    --color-border-strong: ${m.border.strong};
    --color-border-focus: ${m.border.focus};

    --color-status-success: ${m.status.success};
    --color-status-success-fg: ${m.status.successForeground};
    --color-status-warning: ${m.status.warning};
    --color-status-warning-fg: ${m.status.warningForeground};
    --color-status-danger: ${m.status.danger};
    --color-status-danger-fg: ${m.status.dangerForeground};

    /* Layer 2: Tailwind HSL Bridges (Zero Hardcoded Colors in Components) */
    --background: ${hexToHslTriplet(m.bg.canvas)};
    --foreground: ${hexToHslTriplet(m.text.primary)};
    --card: ${hexToHslTriplet(m.bg.surface)};
    --card-foreground: ${hexToHslTriplet(m.text.primary)};
    --popover: ${hexToHslTriplet(m.bg.surface)};
    --popover-foreground: ${hexToHslTriplet(m.text.primary)};
    --primary: ${hexToHslTriplet(m.accent.primary)};
    --primary-hover: ${hexToHslTriplet(m.accent.hover)};
    --primary-subtle: ${hexToHslTriplet(m.accent.subtle)};
    --primary-foreground: ${hexToHslTriplet(m.accent.foreground)};
    --secondary: ${hexToHslTriplet(m.bg.muted)};
    --secondary-foreground: ${hexToHslTriplet(m.text.primary)};
    --accent: ${hexToHslTriplet(m.accent.primary)};
    --accent-foreground: ${hexToHslTriplet(m.accent.foreground)};
    --muted: ${hexToHslTriplet(m.bg.muted)};
    --muted-foreground: ${hexToHslTriplet(m.text.secondary)};
    --border: ${hexToHslTriplet(m.border.hairline)};
    --border-strong: ${hexToHslTriplet(m.border.strong)};
    --input: ${hexToHslTriplet(m.border.hairline)};
    --ring: ${hexToHslTriplet(m.border.focus)};

    --text-primary: ${hexToHslTriplet(m.text.primary)};
    --text-secondary: ${hexToHslTriplet(m.text.secondary)};
    --text-tertiary: ${hexToHslTriplet(m.text.muted)};
    --text-disabled: ${hexToHslTriplet(m.text.disabled)};

    --surface-elevated: ${hexToHslTriplet(m.bg.elevated)};
    --surface-container: ${hexToHslTriplet(m.bg.muted)};
    --surface-container-high: ${hexToHslTriplet(m.border.hairline)};
    --surface-glass: ${hexToHslTriplet(m.bg.canvas)} / 0.92;

    --destructive: ${hexToHslTriplet(m.status.danger)};
    --destructive-foreground: ${hexToHslTriplet(m.status.dangerForeground)};
    --success: ${hexToHslTriplet(m.status.success)};
    --success-foreground: ${hexToHslTriplet(m.status.successForeground)};
    --warning: ${hexToHslTriplet(m.status.warning)};
    --warning-foreground: ${hexToHslTriplet(m.status.warningForeground)};

    --atlas-paper: ${hexToHslTriplet(m.bg.canvas)};
    --atlas-ivory: ${hexToHslTriplet(m.bg.surface)};
    --atlas-ink: ${hexToHslTriplet(m.text.primary)};
    --atlas-slate: ${hexToHslTriplet(m.text.secondary)};
    --atlas-stone: ${hexToHslTriplet(m.border.hairline)};
    --atlas-oxide: ${hexToHslTriplet(m.accent.primary)};

    /* Elevation Shadows */
    --shadow-sm: ${m.shadow.sm};
    --shadow: ${m.shadow.sm};
    --shadow-md: ${m.shadow.md};
    --shadow-lg: ${m.shadow.lg};
    --shadow-xl: ${m.shadow.lg};`;
}

const cssBlocks = [];

cssBlocks.push(`/* AUTO-GENERATED BY scripts/build-tokens.mjs — DO NOT EDIT MANUALLY */
@layer base {
  :root {
    /* Layer 1: Fluid Typography Scale (1.2 -> 1.333 ratio) */
    --font-size-xs: clamp(0.72rem, 0.7rem + 0.12vw, 0.78rem);
    --font-size-sm: clamp(0.84rem, 0.81rem + 0.16vw, 0.92rem);
    --font-size-base: clamp(0.98rem, 0.94rem + 0.22vw, 1.0625rem);
    --font-size-lg: clamp(1.125rem, 1.06rem + 0.35vw, 1.275rem);
    --font-size-xl: clamp(1.32rem, 1.2rem + 0.58vw, 1.6rem);
    --font-size-2xl: clamp(1.62rem, 1.42rem + 0.95vw, 2.15rem);
    --font-size-3xl: clamp(2.05rem, 1.72rem + 1.6vw, 2.95rem);
    --font-size-4xl: clamp(2.55rem, 2.05rem + 2.45vw, 4.1rem);
    --font-size-display: clamp(2.85rem, 2.2rem + 3.6vw, 5.6rem);

    /* Layer 1: Motion Tokens */
    --motion-duration-xs: 120ms;
    --motion-duration-sm: 220ms;
    --motion-duration-md: 380ms;
    --motion-duration-lg: 650ms;
    --motion-duration-xl: 950ms;

    --motion-ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
    --motion-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
    --motion-ease-editorial: cubic-bezier(0.25, 1, 0.5, 1);
    --motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);

    --motion-stagger-tight: 40ms;
    --motion-stagger-base: 70ms;
    --motion-stagger-relaxed: 120ms;

    /* Layer 2: Radius & Density Defaults (sharp + airy) */
    --radius: 0px;
    --radius-control: 0px;
    --radius-card: 0px;
    --radius-badge: 0px;

    --space-section-y: clamp(4.5rem, 8.5vw, 8rem);
    --space-card-padding: 1.75rem;
    --space-grid-gap: 1.75rem;

    /* Layer 3: Component Tokens */
    --nav-height: 4.5rem;
    --button-primary-bg: var(--color-accent-primary);
    --button-primary-bg-hover: var(--color-accent-hover);
    --button-primary-text: var(--color-accent-foreground);
    --card-bg: var(--color-bg-surface);
    --card-border: var(--color-border-hairline);
    --card-border-hover: var(--color-border-strong);
    --input-height: 2.875rem;
${renderModeVariables(PRESETS[0], "light")}
  }

  /* Default Dark Mode Fallback */
  :root.dark,
  :root[data-mode="dark"] {
${renderModeVariables(PRESETS[0], "dark")}
  }
`);

for (const preset of PRESETS) {
  const allIds = [preset.id, ...(preset.aliases || [])];
  const lightSelectors = allIds
    .flatMap((id) => [`:root[data-theme="${id}"]`, `:root[data-theme="${id}"][data-mode="light"]`])
    .join(",\n  ");
  const darkSelectors = allIds
    .flatMap((id) => [`:root[data-theme="${id}"].dark`, `:root[data-theme="${id}"][data-mode="dark"]`])
    .join(",\n  ");

  cssBlocks.push(`  /* Preset: ${preset.label} (Light) */
  ${lightSelectors} {
${renderModeVariables(preset, "light")}
  }

  /* Preset: ${preset.label} (Dark) */
  ${darkSelectors} {
${renderModeVariables(preset, "dark")}
  }
`);
}

cssBlocks.push(`  /* Concept Pack Image Treatment & Tactile Grain Rules */
  :root[data-theme] main img {
    filter: var(--concept-img-filter, none);
  }

  :root[data-concept="ottoman-noir"] article > header {
    margin-inline: auto;
    text-align: center;
  }

  :root[data-concept="ottoman-noir"] article > header > div:first-child {
    justify-content: center;
  }

  :root[data-concept="ottoman-noir"] article > figure {
    padding: 0.75rem;
    border-color: var(--color-accent-primary);
  }

  :root[data-concept="aegean-linen"] article > figure {
    border-radius: 1rem;
    overflow: hidden;
    border-color: transparent;
    box-shadow: var(--shadow-lg);
  }

  :root[data-grain="true"] body::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 45;
    opacity: 0.032;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
`);

cssBlocks.push(`  /* Orthogonal Radius Tokens */
  :root[data-radius="sharp"] {
    --radius: 0px;
    --radius-control: 0px;
    --radius-card: 0px;
    --radius-badge: 0px;
  }

  :root[data-radius="soft"] {
    --radius: 0.5rem;
    --radius-control: 0.375rem;
    --radius-card: 0.625rem;
    --radius-badge: 9999px;
  }

  /* Orthogonal Density Tokens */
  :root[data-density="airy"] {
    --space-section-y: clamp(4.5rem, 8.5vw, 8rem);
    --space-card-padding: 1.75rem;
    --space-grid-gap: 1.75rem;
  }

  :root[data-density="comfortable"] {
    --space-section-y: clamp(3rem, 5.5vw, 5.25rem);
    --space-card-padding: 1.25rem;
    --space-grid-gap: 1.25rem;
  }

  /* Surface Override: Admin Panel (compact, high-legibility sans) */
  [data-surface="admin"] {
    --space-section-y: 2rem;
    --space-card-padding: 1.25rem;
    --space-grid-gap: 1rem;
  }

  /* Motion Level Override */
  :root[data-motion="off"] *,
  :root[data-motion="off"] *::before,
  :root[data-motion="off"] *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`);

const generatedCssPath = path.join(webNextRoot, "src/styles/themes.generated.css");
fs.writeFileSync(generatedCssPath, cssBlocks.join("\n"), "utf8");

// Assemble app/globals.css for Turbopack + Tailwind v3 compatibility (single PostCSS pass)
const baseCss = fs.readFileSync(path.join(webNextRoot, "src/styles/base.css"), "utf8");
const componentsCss = fs.readFileSync(path.join(webNextRoot, "src/styles/components.css"), "utf8");
const utilitiesCss = fs.readFileSync(path.join(webNextRoot, "src/styles/utilities.css"), "utf8");

const globalsCssContent = [
  "/* AUTO-GENERATED BY scripts/build-tokens.mjs — EDIT src/design/tokens/* OR src/styles/*.css */",
  "@tailwind base;",
  "@tailwind components;",
  "@tailwind utilities;",
  "",
  cssBlocks.join("\n"),
  baseCss,
  componentsCss,
  utilitiesCss,
].join("\n\n");

const globalsCssPath = path.join(webNextRoot, "app/globals.css");
fs.writeFileSync(globalsCssPath, globalsCssContent, "utf8");

// --- 3. Generate Markdown Contrast & Font License Report ---

const mdLines = [
  "# Design System Token & WCAG 2.2 Contrast Verification Report",
  "",
  "> Auto-generated by `web-next/scripts/build-tokens.mjs` using W3C WCAG 2.2 relative luminance formula.",
  "",
  "## 1. Typography Presets & Commercial Redistribution Licenses",
  "",
  "| Preset ID | Label | Default Mode | Display Serif | Body Sans | Monospace / Data | License |",
  "|---|---|---|---|---|---|---|",
  ...PRESETS.map(
    (p) =>
      `| \`${p.id}\` | **${p.label}** | \`${p.defaultMode}\` | ${p.fonts.displayName} | ${p.fonts.sansName} | ${p.fonts.monoName} | ${p.fonts.license} |`
  ),
  "",
  `## 2. WCAG 2.2 AA / AAA Contrast Matrix (${reportRows.length}/${reportRows.length} Checks Passed)`,
  "",
  "| Preset | Mode | Token Pair | Foreground | Background | Ratio | Threshold | WCAG Grade |",
  "|---|---|---|---|---|---|---|---|",
  ...reportRows.map(
    (r) =>
      `| \`${r.preset}\` | \`${r.mode}\` | \`${r.pair}\` | \`${r.fg}\` | \`${r.bg}\` | **${r.ratio}:1** | \`${r.min}:1\` | **${r.grade}** |`
  ),
  "",
];

const docsDir = path.join(repoRoot, "docs");
fs.mkdirSync(docsDir, { recursive: true });
const reportPath = path.join(docsDir, "TOKEN_CONTRAST_REPORT.md");
fs.writeFileSync(reportPath, mdLines.join("\n"), "utf8");

console.log(`✓ Generated ${path.relative(repoRoot, generatedCssPath)}`);
console.log(`✓ Generated ${path.relative(repoRoot, reportPath)} (${reportRows.length}/${reportRows.length} WCAG checks passed)`);
