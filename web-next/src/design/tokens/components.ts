/**
 * Layer 3 — Component-Level Design Tokens
 * Binds semantic tokens to specific component roles so component styles
 * never reference primitive colors or raw pixel values.
 */

export const componentTokens = {
  nav: {
    height: "4.5rem", // 72px
    bg: "var(--color-bg-glass)",
    border: "var(--color-border-hairline)",
  },
  button: {
    radius: "var(--radius-control)",
    paddingX: "1.75rem",
    paddingY: "0.95rem",
    fontSize: "0.75rem",
    letterSpacing: "0.14em",
    primary: {
      bg: "var(--color-accent-primary)",
      bgHover: "var(--color-accent-hover)",
      text: "var(--color-accent-foreground)",
    },
    secondary: {
      bg: "var(--color-text-primary)",
      bgHover: "var(--color-accent-primary)",
      text: "var(--color-bg-canvas)",
    },
    outline: {
      border: "var(--color-border-strong)",
      text: "var(--color-text-primary)",
      bgHover: "var(--color-text-primary)",
      textHover: "var(--color-bg-canvas)",
    },
  },
  card: {
    radius: "var(--radius-card)",
    bg: "var(--color-bg-surface)",
    border: "var(--color-border-hairline)",
    borderHover: "var(--color-border-strong)",
    padding: "var(--space-card-padding)",
    tour: {
      portraitAspect: "4 / 5",
      landscapeAspect: "16 / 10",
    },
  },
  input: {
    radius: "var(--radius-control)",
    bg: "var(--color-bg-surface)",
    border: "var(--color-border-hairline)",
    borderFocus: "var(--color-border-strong)",
    text: "var(--color-text-primary)",
    placeholder: "var(--color-text-muted)",
    height: "2.875rem", // 46px (>=44px WCAG touch target)
  },
  badge: {
    radius: "var(--radius-badge)",
    bg: "var(--color-accent-subtle)",
    text: "var(--color-accent-primary)",
    border: "var(--color-border-hairline)",
  },
} as const;
