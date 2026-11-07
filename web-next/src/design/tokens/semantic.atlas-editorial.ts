import { primitiveColors, primitiveShadows, primitiveTypography } from "./primitives";

export interface SemanticColorModeTokens {
  bg: {
    canvas: string;
    surface: string;
    elevated: string;
    muted: string;
    glass: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
    inverse: string;
  };
  accent: {
    primary: string;
    hover: string;
    subtle: string;
    foreground: string;
  };
  border: {
    hairline: string;
    strong: string;
    focus: string;
  };
  status: {
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    danger: string;
    dangerForeground: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface SemanticPresetDefinition {
  id: "atlas-editorial" | "aegean-linen" | "ottoman-noir";
  label: string;
  character: string;
  defaultMode: "light" | "dark";
  fonts: {
    display: string;
    sans: string;
    mono: string;
    displayName: string;
    sansName: string;
    monoName: string;
    license: string;
  };
  modes: {
    light: SemanticColorModeTokens;
    dark: SemanticColorModeTokens;
  };
}

export const semanticAtlasEditorial: SemanticPresetDefinition = {
  id: "atlas-editorial",
  label: "Atlas Editorial",
  character: "Warm limestone paper, deep cypress ink, carnelian terracotta, cartographic monograph.",
  defaultMode: "light",
  fonts: {
    display: primitiveTypography.fontFamilies.atlasEditorial.display,
    sans: primitiveTypography.fontFamilies.atlasEditorial.sans,
    mono: primitiveTypography.fontFamilies.atlasEditorial.mono,
    displayName: "Newsreader (Optical Serif)",
    sansName: "Source Sans 3 (Humanist Sans)",
    monoName: "IBM Plex Mono",
    license: "SIL Open Font License 1.1 (Google Fonts)",
  },
  modes: {
    light: {
      bg: {
        canvas: primitiveColors.paper[100],      // #F4F1EA
        surface: primitiveColors.paper[50],      // #FAF8F3
        elevated: "#FFFFFF",
        muted: primitiveColors.paper[200],       // #EBE7DD
        glass: "rgba(244, 241, 234, 0.92)",
      },
      text: {
        primary: primitiveColors.cypress[900],   // #162927
        secondary: primitiveColors.cypress[500], // #485855
        muted: primitiveColors.cypress[600],     // #354441
        disabled: primitiveColors.paper[500],    // #857F72
        inverse: primitiveColors.paper[50],      // #FAF8F3
      },
      accent: {
        primary: primitiveColors.terracotta[600], // #9E402C
        hover: primitiveColors.terracotta[700],   // #823221
        subtle: "#F3E3DE",
        foreground: primitiveColors.paper[50],    // #FAF8F3
      },
      border: {
        hairline: primitiveColors.paper[300],     // #D8D3C6
        strong: primitiveColors.cypress[900],     // #162927
        focus: primitiveColors.terracotta[600],   // #9E402C
      },
      status: {
        success: primitiveColors.status.successLight,
        successForeground: primitiveColors.paper[50],
        warning: primitiveColors.status.warningLight,
        warningForeground: primitiveColors.paper[50],
        danger: primitiveColors.status.dangerLight,
        dangerForeground: primitiveColors.paper[50],
      },
      shadow: primitiveShadows.light,
    },
    dark: {
      bg: {
        canvas: primitiveColors.cypress[950],     // #101918
        surface: primitiveColors.cypress[800],    // #162220
        elevated: "#1C2B29",
        muted: "#1F302D",
        glass: "rgba(16, 25, 24, 0.92)",
      },
      text: {
        primary: "#EDEAE2",
        secondary: "#A9B8B5",
        muted: primitiveColors.cypress[300],      // #8EA39F
        disabled: primitiveColors.cypress[500],   // #485855
        inverse: primitiveColors.cypress[950],    // #101918
      },
      accent: {
        primary: primitiveColors.terracotta[400], // #D47A66
        hover: primitiveColors.terracotta[300],   // #E29584
        subtle: "#2C201E",
        foreground: primitiveColors.cypress[950], // #101918
      },
      border: {
        hairline: "#283A37",
        strong: "#EDEAE2",
        focus: primitiveColors.terracotta[400],
      },
      status: {
        success: primitiveColors.status.successDark,
        successForeground: primitiveColors.cypress[950],
        warning: primitiveColors.status.warningDark,
        warningForeground: primitiveColors.cypress[950],
        danger: primitiveColors.status.dangerDark,
        dangerForeground: primitiveColors.cypress[950],
      },
      shadow: primitiveShadows.dark,
    },
  },
};
