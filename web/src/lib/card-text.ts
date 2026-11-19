// Turns a component card into text an AI can follow to rebuild it (the "Copy for AI" button).
import type { ComponentCard, Run } from "./api"

const LOOK_KEYS = [
  "width", "height", "padding", "gap", "background-color", "background-image", "color", "font-family", "font-size",
  "font-weight", "line-height", "letter-spacing", "text-transform", "border-top-width", "border-top-style",
  "border-top-color", "border-radius", "box-shadow", "opacity", "cursor",
]

export const lookRows = (c: ComponentCard) =>
  LOOK_KEYS.map((k) => [k, c.look[k]] as const).filter(([, v]) => v && v !== "none" && v !== "normal" && v !== "0px")

export function cardText(run: Run, c: ComponentCard): string {
  const lines = [
    `# ${c.family}${c.name ? `: "${c.name}"` : ""} (from ${run.site})`,
    "",
    c.explanation,
    "",
    "## Look at rest",
    ...lookRows(c).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## States",
  ]
  for (const s of c.states.slice(1)) {
    lines.push(`### ${s.state}`)
    if (s.changes.length === 0) lines.push("- no visible change")
    for (const ch of s.changes) lines.push(`- ${ch.what}: ${ch.from} → ${ch.to}`)
    for (const m of s.motion) lines.push(`- motion: ${m.what} over ${m.ms} ms${m.delay_ms ? ` after ${m.delay_ms} ms` : ""}, easing ${m.easing}`)
  }
  lines.push("", "## Build", `Element: <${c.tag}>${c.role ? ` role="${c.role}"` : ""}, parts: ${c.parts}`, "```html", c.html, "```")
  if (c.lessons.length) lines.push("", "## Design notes", ...c.lessons.map((l) => `- ${l}`))
  lines.push("", "Rebuild this component with the same look, states and motion in my app's stack (React, Tailwind, shadcn).")
  return lines.join("\n")
}
