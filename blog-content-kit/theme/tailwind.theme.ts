/* ============================================================================
   Blog & Content Kit — Tailwind theme mapping
   ----------------------------------------------------------------------------
   Merge this into your host `tailwind.config.ts` under `theme.extend`. It maps
   the semantic tokens from theme/theme.css onto Tailwind utilities the kit uses
   (bg-card, text-primary, border-border, font-display, rounded-lg, …).

   Most Lovable/shadcn projects ALREADY have the colors block below — in that
   case you only need to add the two `fontFamily` entries so `font-display` /
   `font-body` follow the theme's font vars instead of a hardcoded family.

   Usage:
     import { kitTheme } from "./theme/tailwind.theme";
     export default { theme: { extend: { ...kitTheme } } } satisfies Config;
   ============================================================================ */

export const kitTheme = {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
    // kit-specific
    brand: {
      DEFAULT: "hsl(var(--brand))",
      foreground: "hsl(var(--brand-foreground))",
    },
    "surface-2": "hsl(var(--surface-2))",
    sidebar: {
      DEFAULT: "hsl(var(--sidebar-background))",
      foreground: "hsl(var(--sidebar-foreground))",
      primary: "hsl(var(--sidebar-primary))",
      "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
      accent: "hsl(var(--sidebar-accent))",
      "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
      border: "hsl(var(--sidebar-border))",
      ring: "hsl(var(--sidebar-ring))",
    },
  },
  // Fonts follow the theme vars — the kit uses font-display / font-body only.
  fontFamily: {
    display: ["var(--font-display)"],
    body: ["var(--font-body)"],
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
  maxWidth: {
    prose: "var(--prose-max-width)",
  },
} as const;
