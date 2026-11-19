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
  /** the app's own font, loaded from Google Fonts when it is there */
  webFont?: string
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

type Card = { kind: string; family: string; look: Record<string, string> }
const clear = (c?: string) => !c || /rgba\(.*,\s*0\)$/.test(c) || c === "transparent"
const px = (v?: string) => {
  const n = parseFloat(v ?? "")
  return isNaN(n) ? undefined : n > 999 ? "9999px" : `${n}px`
}

/** The recorded app's style, read from its component cards: the filled button gives the main colour and
 * the button corners, the text field gives text colour, borders and field corners, a small link the grey. */
export function themeFrom(site: string, cards: Card[]): Theme | null {
  const filled = cards.find((c) => c.family === "filled button" && !clear(c.look["background-color"]))
  const field = cards.find((c) => c.kind === "text field")
  if (!filled && !field) return null
  const quiet = cards.find((c) => /link|ghost/.test(c.family) && c.look.color && c.look.color !== field?.look.color)
  const font = (filled ?? field)!.look["font-family"]
  const t: Theme = { ...PLAIN, name: `${site}'s style` }
  if (filled) {
    t.primary = filled.look["background-color"]
    t.primaryForeground = filled.look.color || t.primaryForeground
    t.buttonRadius = px(filled.look["border-radius"]) ?? t.buttonRadius
  }
  if (field) {
    t.foreground = field.look.color || t.foreground
    t.border = field.look["border-top-color"] || t.border
    t.radius = px(field.look["border-radius"]) ?? t.radius
    t.background = clear(field.look.backdrop) ? t.background : field.look.backdrop
  }
  if (quiet) t.mutedForeground = quiet.look.color
  t.muted = `color-mix(in srgb, ${t.mutedForeground} 10%, ${t.background})`
  t.ring = `color-mix(in srgb, ${t.primary} 45%, ${t.background})`
  if (font) {
    t.font = `"${font.split(",")[0].replace(/["']/g, "").trim()}", ${PLAIN.font}`
    t.webFont = font.split(",")[0].replace(/["']/g, "").trim()
  }
  return t
}

/** Loads the app's font from Google Fonts when it is there; the plain font shows otherwise. */
export function useWebFont(name?: string) {
  if (!name || typeof document === "undefined") return
  const id = `font-${name.replace(/\W+/g, "-")}`
  if (document.getElementById(id)) return
  const link = Object.assign(document.createElement("link"), {
    id, rel: "stylesheet", href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`,
  })
  document.head.appendChild(link)
}
