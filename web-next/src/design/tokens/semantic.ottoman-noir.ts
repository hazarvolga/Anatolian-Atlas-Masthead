import { primitiveColors, primitiveShadows, primitiveTypography } from "./primitives";
import type { SemanticPresetDefinition } from "./semantic.atlas-editorial";

export const semanticOttomanNoir: SemanticPresetDefinition = {
  id: "ottoman-noir",
  label: "Ottoman Noir",
  character: "Nocturnal basalt charcoal, silk parchment, pale antique gold, private evening salon.",
  defaultMode: "dark",
  fonts: {
    display: primitiveTypography.fontFamilies.ottomanNoir.display,
    sans: primitiveTypography.fontFamilies.ottomanNoir.sans,
    mono: primitiveTypography.fontFamilies.ottomanNoir.mono,
    displayName: "Bodoni Moda (High-Contrast Didone Serif)",
    sansName: "Albert Sans (Architectural Geometric Sans)",
    monoName: "IBM Plex Mono",
    license: "SIL Open Font License 1.1 (Google Fonts)",
  },
  modes: {
    light: {
      bg: {
        canvas: primitiveColors.alabaster[100],   // #F3EFEA
        surface: primitiveColors.alabaster[50],   // #FAF7F2
        elevated: "#FFFFFF",
        muted: primitiveColors.alabaster[200],    // #E7E1D8
        glass: "rgba(243, 239, 234, 0.92)",
      },
      text: {
        primary: primitiveColors.obsidian[900],   // #171615
        secondary: primitiveColors.obsidian[600], // #524E4A
        muted: "#3D3A36",
        disabled: primitiveColors.obsidian[400],  // #8A8479
        inverse: primitiveColors.alabaster[50],   // #FAF7F2
      },
      accent: {
        primary: primitiveColors.gold[600],       // #7A5828
        hover: primitiveColors.gold[700],         // #5F431C
        subtle: "#EFE6D5",
        foreground: primitiveColors.alabaster[50],// #FAF7F2
      },
      border: {
        hairline: primitiveColors.alabaster[300], // #D3CBC0
        strong: primitiveColors.obsidian[900],    // #171615
        focus: primitiveColors.gold[600],         // #7A5828
      },
      status: {
        success: primitiveColors.status.successLight,
        successForeground: primitiveColors.alabaster[50],
        warning: primitiveColors.status.warningLight,
        warningForeground: primitiveColors.alabaster[50],
        danger: primitiveColors.status.dangerLight,
        dangerForeground: primitiveColors.alabaster[50],
      },
      shadow: primitiveShadows.light,
    },
    dark: {
      bg: {
        canvas: primitiveColors.obsidian[950],    // #121316
        surface: primitiveColors.obsidian[850],   // #1A1C20
        elevated: primitiveColors.obsidian[800],  // #1E2025
        muted: primitiveColors.obsidian[700],     // #26282E
        glass: "rgba(18, 19, 22, 0.92)",
      },
      text: {
        primary: primitiveColors.alabaster[400],  // #EDE8DD
        secondary: "#B3ADA1",
        muted: primitiveColors.obsidian[300],     // #A8A296
        disabled: primitiveColors.obsidian[600],  // #524E4A
        inverse: primitiveColors.obsidian[950],   // #121316
      },
      accent: {
        primary: primitiveColors.gold[400],       // #C8A464
        hover: primitiveColors.gold[300],         // #DEC089
        subtle: "#2A251B",
        foreground: primitiveColors.obsidian[950],// #121316
      },
      border: {
        hairline: "#2B2E36",
        strong: primitiveColors.alabaster[400],   // #EDE8DD
        focus: primitiveColors.gold[400],         // #C8A464
      },
      status: {
        success: primitiveColors.status.successDark,
        successForeground: primitiveColors.obsidian[950],
        warning: primitiveColors.status.warningDark,
        warningForeground: primitiveColors.obsidian[950],
        danger: primitiveColors.status.dangerDark,
        dangerForeground: primitiveColors.obsidian[950],
      },
      shadow: primitiveShadows.dark,
    },
  },
};
