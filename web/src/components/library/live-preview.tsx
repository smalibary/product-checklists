// The live working copy of a component: a small page rebuilt from the recording, shown in a frame.
// "Live" lets you hover, Tab into and press it yourself; the other choices hold one state still.
import { useEffect, useRef, useState } from "react"
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/react/segmented-control"
import { fileUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

const STATES = [
  ["live", "Live"],
  ["normal", "Normal"],
  ["hover", "Hover"],
  ["focus", "Focus"],
  ["pressed", "Pressed"],
] as const
type Mode = (typeof STATES)[number][0]

/** Frame that shows the copy; `scale` shrinks it to fit (list thumbnails), `mode` holds a state. */
export function LiveFrame({ runId, file, mode = "live", thumb = false, className }: { runId: string; file: string; mode?: Mode; thumb?: boolean; className?: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(1)

  const apply = () => {
    const doc = ref.current?.contentDocument
    if (!doc) return
    const html = doc.documentElement
    html.classList.remove("f-hover", "f-focus", "f-pressed")
    if (mode === "hover" || mode === "focus" || mode === "pressed") html.classList.add(`f-${mode}`)
    if (thumb) {
      // shrink big components so the whole thing fits the small box
      doc.body.style.padding = "4px"
      html.style.overflow = "hidden"
      const root = doc.querySelector<HTMLElement>('[data-as-n="0"]')
      const box = ref.current!.parentElement!.getBoundingClientRect()
      if (root && box.width) {
        const r = root.getBoundingClientRect()
        setScale(Math.min(1, (box.width - 8) / Math.max(r.width, 1), (box.height - 8) / Math.max(r.height, 1)))
      }
    }
  }
  useEffect(apply, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <iframe
      ref={ref}
      src={fileUrl(runId, file)}
      onLoad={apply}
      title="Live copy"
      tabIndex={thumb ? -1 : 0}
      style={thumb && scale < 1 ? { width: `${100 / scale}%`, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: "0 0" } : undefined}
      className={cn("block border-0", thumb && "pointer-events-none", className)}
    />
  )
}

export function LivePreview({ runId, file }: { runId: string; file: string }) {
  const [mode, setMode] = useState<Mode>("live")
  return (
    <section className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center gap-3 border-b bg-muted/30 px-3 py-2">
        <span className="text-sm font-semibold">Live copy</span>
        <SegmentedControl value={mode} onValueChange={(v) => setMode(v as Mode)} className="relative inline-flex gap-0.5 rounded-md border bg-muted p-0.5 isolate">
          <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) rounded-[5px] border bg-background shadow-sm transition-all duration-200" />
          {STATES.map(([v, label]) => (
            <SegmentedControlItem
              key={v}
              value={v}
              className="relative z-10 inline-flex h-7 cursor-pointer items-center rounded-[5px] px-3 text-xs font-medium text-muted-foreground outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-checked:text-foreground"
            >
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <span className="text-xs text-muted-foreground">
          {mode === "live" ? "Hover it, press Tab to focus it, click and hold to press it." : "Held in this state."}
        </span>
      </div>
      <LiveFrame runId={runId} file={file} mode={mode} className="h-56 w-full" />
    </section>
  )
}
