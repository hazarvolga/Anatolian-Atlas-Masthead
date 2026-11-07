import { primitiveColors, primitiveShadows, primitiveTypography } from "./primitives";
import type { SemanticPresetDefinition } from "./semantic.atlas-editorial";

export const semanticAegeanLinen: SemanticPresetDefinition = {
  id: "aegean-linen",
  label: "Aegean Linen",
  character: "Sunbleached linen, whitewashed limestone, calm pelagic teal, tactile coastal stillness.",
  defaultMode: "light",
  fonts: {
    display: primitiveTypography.fontFamilies.aegeanLinen.display,
    sans: primitiveTypography.fontFamilies.aegeanLinen.sans,
    mono: primitiveTypography.fontFamilies.aegeanLinen.mono,
    displayName: "Fraunces (Soft Optical Serif)",
    sansName: "Instrument Sans (Contemporary Gallery Sans)",
    monoName: "IBM Plex Mono",
    license: "SIL Open Font License 1.1 (Google Fonts)",
  },
  modes: {
    light: {
      bg: {
        canvas: primitiveColors.linen[100],      // #F5F2EB
        surface: primitiveColors.linen[50],      // #FCFBF8
        elevated: "#FFFFFF",
        muted: primitiveColors.linen[200],       // #EAE5DA
        glass: "rgba(245, 242, 235, 0.92)",
      },
      text: {
        primary: primitiveColors.aegean[900],    // #18262E
        secondary: primitiveColors.aegean[500],  // #465862
        muted: primitiveColors.aegean[600],      // #31424B
        disabled: primitiveColors.linen[500],    // #7E776A
        inverse: primitiveColors.linen[50],      // #FCFBF8
      },
      accent: {
        primary: primitiveColors.seaTeal[600],   // #1F5E63
        hover: primitiveColors.seaTeal[700],     // #17484C
        subtle: "#DFECEE",
        foreground: primitiveColors.linen[50],   // #FCFBF8
      },
      border: {
        hairline: primitiveColors.linen[300],    // #D6CFC1
        strong: primitiveColors.aegean[900],     // #18262E
        focus: primitiveColors.seaTeal[600],     // #1F5E63
      },
      status: {
        success: primitiveColors.status.successLight,
        successForeground: primitiveColors.linen[50],
        warning: primitiveColors.status.warningLight,
        warningForeground: primitiveColors.linen[50],
        danger: primitiveColors.status.dangerLight,
        dangerForeground: primitiveColors.linen[50],
      },
      shadow: primitiveShadows.light,
    },
    dark: {
      bg: {
        canvas: primitiveColors.aegean[950],     // #0F181D
        surface: primitiveColors.aegean[800],    // #162229
        elevated: "#1C2B34",
        muted: "#1F303A",
        glass: "rgba(15, 24, 29, 0.92)",
      },
      text: {
        primary: primitiveColors.aegean[50],     // #EEF2F4
        secondary: "#A6B8C0",
        muted: primitiveColors.aegean[300],      // #9EB0B8
        disabled: primitiveColors.aegean[500],   // #465862
        inverse: primitiveColors.aegean[950],    // #0F181D
      },
      accent: {
        primary: primitiveColors.seaTeal[400],   // #63B0B6
        hover: primitiveColors.seaTeal[300],     // #7DC0C5
        subtle: "#172D31",
        foreground: primitiveColors.aegean[950], // #0F181D
      },
      border: {
        hairline: "#263842",
        strong: primitiveColors.aegean[50],
        focus: primitiveColors.seaTeal[400],
      },
      status: {
        success: primitiveColors.status.successDark,
        successForeground: primitiveColors.aegean[950],
        warning: primitiveColors.status.warningDark,
        warningForeground: primitiveColors.aegean[950],
        danger: primitiveColors.status.dangerDark,
        dangerForeground: primitiveColors.aegean[950],
      },
      shadow: primitiveShadows.dark,
    },
  },
};
