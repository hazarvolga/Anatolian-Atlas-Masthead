/**
 * Layer 1 — Primitive Design Tokens
 * Raw values only. Never consumed directly by UI components;
 * mapped through Layer 2 (Semantic) and Layer 3 (Component).
 */

export const primitiveColors = {
  // Warm Paper & Limestone (Atlas Editorial)
  paper: {
    50: "#FAF8F3",
    100: "#F4F1EA",
    200: "#EBE7DD",
    300: "#D8D3C6",
    400: "#B5AFA0",
    500: "#857F72",
  },
  cypress: {
    50: "#EEF2F1",
    100: "#D5DFDD",
    300: "#8EA39F",
    500: "#485855",
    600: "#354441",
    800: "#162220",
    900: "#162927",
    950: "#101918",
  },
  terracotta: {
    300: "#E29584",
    400: "#D47A66",
    500: "#B8523B",
    600: "#9E402C",
    700: "#823221",
    800: "#682618",
  },

  // Sunbleached Linen & Aegean Slate (Aegean Linen)
  linen: {
    50: "#FCFBF8",
    100: "#F5F2EB",
    200: "#EAE5DA",
    300: "#D6CFC1",
    400: "#B2AA9B",
    500: "#7E776A",
  },
  aegean: {
    50: "#EEF2F4",
    200: "#C5D2D8",
    300: "#9EB0B8",
    500: "#465862",
    600: "#31424B",
    800: "#162229",
    900: "#18262E",
    950: "#0F181D",
  },
  seaTeal: {
    300: "#7DC0C5",
    400: "#63B0B6",
    500: "#2B747A",
    600: "#1F5E63",
    700: "#17484C",
  },

  // Nocturnal Basalt & Ottoman Gold (Ottoman Noir)
  alabaster: {
    50: "#FAF7F2",
    100: "#F3EFEA",
    200: "#E7E1D8",
    300: "#D3CBC0",
    400: "#EDE8DD",
  },
  obsidian: {
    300: "#A8A296",
    400: "#8A8479",
    600: "#524E4A",
    700: "#26282E",
    800: "#1E2025",
    850: "#1A1C20",
    900: "#171615",
    950: "#121316",
  },
  gold: {
    300: "#DEC089",
    400: "#C8A464",
    500: "#B08B48",
    600: "#7A5828",
    700: "#5F431C",
  },

  // Universal Status Primitives (WCAG AA calibrated)
  status: {
    successLight: "#1D6849",
    successDark: "#52B788",
    warningLight: "#8A5A00",
    warningDark: "#EAB308",
    dangerLight: "#A8241A",
    dangerDark: "#F07167",
  },
} as const;

export const primitiveTypography = {
  fontFamilies: {
    atlasEditorial: {
      display: "var(--font-display-atlas), Georgia, serif",
      sans: "var(--font-sans-atlas), -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
    },
    aegeanLinen: {
      display: "var(--font-display-aegean), Georgia, serif",
      sans: "var(--font-sans-aegean), -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
    },
    ottomanNoir: {
      display: "var(--font-display-noir), Georgia, serif",
      sans: "var(--font-sans-noir), -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "var(--font-mono), ui-monospace, SFMono-Regular, monospace",
    },
  },
  /**
   * Fluid type scale (ratio 1.2 min -> 1.333 max)
   */
  scale: {
    xs: "clamp(0.72rem, 0.7rem + 0.12vw, 0.78rem)",
    sm: "clamp(0.84rem, 0.81rem + 0.16vw, 0.92rem)",
    base: "clamp(0.98rem, 0.94rem + 0.22vw, 1.0625rem)",
    lg: "clamp(1.125rem, 1.06rem + 0.35vw, 1.275rem)",
    xl: "clamp(1.32rem, 1.2rem + 0.58vw, 1.6rem)",
    "2xl": "clamp(1.62rem, 1.42rem + 0.95vw, 2.15rem)",
    "3xl": "clamp(2.05rem, 1.72rem + 1.6vw, 2.95rem)",
    "4xl": "clamp(2.55rem, 2.05rem + 2.45vw, 4.1rem)",
    display: "clamp(2.85rem, 2.2rem + 3.6vw, 5.6rem)",
  },
  lineHeight: {
    tight: "0.98",
    heading: "1.08",
    snug: "1.25",
    body: "1.68",
    relaxed: "1.8",
  },
  letterSpacing: {
    display: "-0.032em",
    heading: "-0.022em",
    body: "0em",
    kicker: "0.16em",
    meta: "0.13em",
  },
} as const;

export const primitiveSpace = {
  0: "0px",
  1: "0.25rem",  // 4px
  2: "0.5rem",   // 8px
  3: "0.75rem",  // 12px
  4: "1rem",     // 16px
  5: "1.25rem",  // 20px
  6: "1.5rem",   // 24px
  8: "2rem",     // 32px
  10: "2.5rem",  // 40px
  12: "3rem",    // 48px
  16: "4rem",    // 64px
  20: "5rem",    // 80px
  24: "6rem",    // 96px
  32: "8rem",    // 128px
  sectionAiry: "clamp(4.5rem, 8.5vw, 8rem)",
  sectionComfortable: "clamp(3rem, 5.5vw, 5.25rem)",
} as const;

export const primitiveRadius = {
  sharp: {
    sm: "0px",
    md: "0px",
    lg: "0px",
  },
  soft: {
    sm: "0.25rem", // 4px
    md: "0.5rem",  // 8px
    lg: "0.75rem", // 12px
  },
} as const;

export const primitiveShadows = {
  light: {
    sm: "0 1px 2px 0 rgba(22, 41, 39, 0.04)",
    md: "0 6px 18px -4px rgba(22, 41, 39, 0.07)",
    lg: "0 18px 36px -10px rgba(22, 41, 39, 0.11)",
  },
  dark: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
    md: "0 8px 20px -4px rgba(0, 0, 0, 0.45)",
    lg: "0 20px 42px -10px rgba(0, 0, 0, 0.6)",
  },
} as const;

export const primitiveZIndex = {
  base: 1,
  sticky: 20,
  nav: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
} as const;

export const primitiveBreakpoints = {
  xs: "360px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "1920px",
} as const;

export const primitiveMotion = {
  duration: {
    xs: "120ms",
    sm: "220ms",
    md: "380ms",
    lg: "650ms",
    xl: "950ms",
  },
  ease: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
    editorial: "cubic-bezier(0.25, 1, 0.5, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },
  stagger: {
    tight: "40ms",
    base: "70ms",
    relaxed: "120ms",
  },
} as const;
