import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class", '[data-mode="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1420px",
      },
    },
    extend: {
      screens: {
        xs: "360px",
        "3xl": "1920px",
      },
      colors: {
        /* Layer 2 Semantic Hex Direct Tokens */
        canvas: "var(--color-bg-canvas)",
        surface: {
          DEFAULT: "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
          muted: "var(--color-bg-muted)",
          glass: "var(--color-bg-glass)",
        },
        ink: {
          DEFAULT: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          disabled: "var(--color-text-disabled)",
          inverse: "var(--color-text-inverse)",
        },
        hairline: {
          DEFAULT: "var(--color-border-hairline)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",
        },

        /* Layer 2 Tailwind HSL Bridges (Supports /opacity modifiers) */
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        atlas: {
          paper: "hsl(var(--atlas-paper))",
          ivory: "hsl(var(--atlas-ivory))",
          ink: "hsl(var(--atlas-ink))",
          slate: "hsl(var(--atlas-slate))",
          stone: "hsl(var(--atlas-stone))",
          oxide: "hsl(var(--atlas-oxide))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          subtle: "hsl(var(--primary-subtle))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--primary-hover))",
          subtle: "hsl(var(--primary-subtle))",
          foreground: "hsl(var(--accent-foreground))",
          vibrant: "hsl(var(--primary))",
          coral: "hsl(var(--primary))",
          emerald: "hsl(var(--success))",
          sky: "hsl(var(--atlas-slate))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        "surface-elevated": "hsl(var(--surface-elevated))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-glass": "hsl(var(--surface-glass))",
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        "text-disabled": "hsl(var(--text-disabled))",
      },
      fontSize: {
        "fluid-xs": "var(--font-size-xs)",
        "fluid-sm": "var(--font-size-sm)",
        "fluid-base": "var(--font-size-base)",
        "fluid-lg": "var(--font-size-lg)",
        "fluid-xl": "var(--font-size-xl)",
        "fluid-2xl": "var(--font-size-2xl)",
        "fluid-3xl": "var(--font-size-3xl)",
        "fluid-4xl": "var(--font-size-4xl)",
        "fluid-display": "var(--font-size-display)",
      },
      spacing: {
        "section-y": "var(--space-section-y)",
        "card-pad": "var(--space-card-padding)",
        "grid-gap": "var(--space-grid-gap)",
        "nav-h": "var(--nav-height)",
      },
      borderRadius: {
        lg: "var(--radius-card)",
        md: "var(--radius-control)",
        sm: "calc(var(--radius-control) * 0.5)",
        card: "var(--radius-card)",
        control: "var(--radius-control)",
        badge: "var(--radius-badge)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      transitionDuration: {
        xs: "var(--motion-duration-xs)",
        sm: "var(--motion-duration-sm)",
        md: "var(--motion-duration-md)",
        lg: "var(--motion-duration-lg)",
        xl: "var(--motion-duration-xl)",
      },
      transitionTimingFunction: {
        standard: "var(--motion-ease-standard)",
        emphasized: "var(--motion-ease-emphasized)",
        editorial: "var(--motion-ease-editorial)",
        exit: "var(--motion-ease-exit)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
