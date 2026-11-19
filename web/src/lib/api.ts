// What the Rust app sends back (mirrors the library's run.json).
export type Control = { index: number; kind: string; text: string; href: string | null; external: boolean; tried: boolean }
export type Screen = { code: string; url: string; title: string; picture: string; first_step: number; controls: Control[] }
export type Step = {
  n: number; action: string; control_kind: string; control_text: string
  screen_before: string; screen_after: string; url_before: string; url_after: string
  outcome: "new-screen" | "changed-in-place" | "nothing-changed" | "error"
  explanation: string; before: string; after: string; clip: string | null; clip_ms: number; frames: number
}
export type Change = { what: string; from: string; to: string }
export type Motion = { what: string; ms: number; delay_ms: number; easing: string }
export type StateShot = { state: "normal" | "hover" | "focus" | "pressed"; picture: string; changes: Change[]; motion: Motion[]; said: string }
export type ComponentCard = {
  id: string; screen: string; kind: string; family: string; name: string; used: number
  tag: string; role: string; parts: string; html: string; look: Record<string, string>
  states: StateShot[]; explanation: string; lessons: string[]
  live?: string | null
}
export type Run = {
  id: string; site: string; start_url: string; started_at: string; finished_at: string | null
  status: "running" | "done" | "failed"; error: string | null; screens: Screen[]; steps: Step[]; components?: ComponentCard[]
}
export type RunSummary = { id: string; site: string; start_url: string; started_at: string; status: string; steps: number; screens: number; components?: number; cover: string | null }

export const fileUrl = (runId: string, name: string) => `/files/${runId}/${name}`

export async function listRuns(): Promise<RunSummary[]> {
  const r = await fetch("/api/runs")
  return r.ok ? r.json() : []
}
export async function getRun(id: string): Promise<Run | null> {
  const r = await fetch(`/api/runs/${id}`)
  return r.ok ? r.json() : null
}
export async function startRecording(url: string, steps: number): Promise<string> {
  const r = await fetch("/api/record", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url, steps }) })
  if (!r.ok) throw new Error(await r.text())
  return (await r.json()).id
}

export const outcomeLabel: Record<Step["outcome"], string> = {
  "new-screen": "New screen",
  "changed-in-place": "Changed in place",
  "nothing-changed": "Nothing changed",
  error: "Error",
}
