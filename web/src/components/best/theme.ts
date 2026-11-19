// The look of the best-version phone: the same colour roles the page's components use (primary,
// border, muted...), so restyling it in a recorded app's style only swaps these values (part E1.6).
import type { CSSProperties } from "react"

export type Theme = {
  name: string
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  muted: string
  mutedForeground: string
  border: string
  destructive: string
  ring: string
  radius: string
  /** corner of the main buttons (some apps use full pills) */
  buttonRadius: string
  font: string
}

/** Plain ui-sdk on shadcn, light. */
export const PLAIN: Theme = {
  name: "Plain ui-sdk",
  background: "#ffffff",
  foreground: "#0a0a0a",
  primary: "#171717",
  primaryForeground: "#fafafa",
  muted: "#f5f5f5",
  mutedForeground: "#6b6b6b",
  border: "#e5e5e5",
  destructive: "#c62828",
  ring: "#a3a3a3",
  radius: "0.625rem",
  buttonRadius: "0.625rem",
  font: "'Geist Variable', sans-serif",
}

export function themeStyle(t: Theme): CSSProperties {
  return {
    "--background": t.background,
    "--foreground": t.foreground,
    "--card": t.background,
    "--card-foreground": t.foreground,
    "--popover": t.background,
    "--popover-foreground": t.foreground,
    "--primary": t.primary,
    "--primary-foreground": t.primaryForeground,
    "--secondary": t.muted,
    "--secondary-foreground": t.foreground,
    "--muted": t.muted,
    "--muted-foreground": t.mutedForeground,
    "--accent": t.muted,
    "--accent-foreground": t.foreground,
    "--border": t.border,
    "--input": t.border,
    "--destructive": t.destructive,
    "--ring": t.ring,
    "--radius": t.radius,
    "--bv-button-radius": t.buttonRadius,
    fontFamily: t.font,
    colorScheme: "light",
    background: t.background,
    color: t.foreground,
  } as CSSProperties
}
