// The real recorded sign-up on the left, the best version on the right (in their style or plain ui-sdk),
// and the audit underneath: what the real one misses and why, with the source for each item.
import { useMemo, useState } from "react"
import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/react/segmented-control"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fileUrl, type Run } from "@/lib/api"
import { AuditView } from "@/components/library/audit-view"
import { BestSignUp } from "./signup-flow"
import { PLAIN, themeFrom, useWebFont } from "./theme"

export function SideBySide({ run }: { run: Run }) {
  const appName = run.site.replace(/^www\./, "").split(".")[0].replace(/^./, (c) => c.toUpperCase())
  const theirs = useMemo(() => themeFrom(appName, (run.components ?? []) as never), [run.id]) // eslint-disable-line react-hooks/exhaustive-deps
  const [style, setStyle] = useState(theirs ? "theirs" : "plain")
  const theme = style === "theirs" && theirs ? theirs : PLAIN
  useWebFont(theme.webFont)

  // the screens the real sign-up showed, in order: the first screen, then the screen after each step
  const shots = useMemo(() => {
    const list = [{ pic: run.screens[0]?.picture, label: "First screen" }]
    for (const s of run.steps) list.push({ pic: s.after, label: `Step ${s.n}: ${s.explanation.split(":")[0]}` })
    return list.filter((s) => s.pic)
  }, [run])
  const [at, setAt] = useState(0)
  const shot = shots[Math.min(at, shots.length - 1)]
  const fails = run.audit?.filter((g) => g.result === "fail" || g.result === "partly").length ?? 0

  return (
    <div className="mx-auto flex max-w-[64rem] flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-10">
        <figure className="flex flex-col gap-3">
          <figcaption className="flex h-9 items-center justify-between gap-3 text-sm">
            <span className="font-semibold">{appName} today</span>
            <span className="text-muted-foreground">{fails} items to fix</span>
          </figcaption>
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2.2rem] border-[10px] border-neutral-800 bg-white shadow-xl">
            {shot && <img src={fileUrl(run.id, shot.pic)} alt={shot.label} className="w-full object-top" />}
          </div>
          <div className="flex w-[390px] items-center gap-2 text-sm">
            <button type="button" aria-label="Previous screen" disabled={at === 0} onClick={() => setAt(at - 1)} className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40">
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-0 flex-1 truncate text-center text-muted-foreground">{at + 1} of {shots.length} · {shot?.label}</span>
            <button type="button" aria-label="Next screen" disabled={at >= shots.length - 1} onClick={() => setAt(at + 1)} className="inline-flex size-9 items-center justify-center rounded-md border disabled:opacity-40">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </figure>

        <figure className="flex flex-col gap-3">
          <figcaption className="flex h-9 items-center justify-between gap-3 text-sm">
            <span className="font-semibold">Best version</span>
            {theirs && (
              <SegmentedControl value={style} onValueChange={(v) => setStyle(v as string)} className="relative isolate inline-flex gap-0.5 rounded-md border bg-muted p-0.5">
                <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) rounded-[5px] border bg-background shadow-sm transition-all duration-200" />
                {[["theirs", `${appName}'s style`], ["plain", "Plain ui-sdk"]].map(([v, label]) => (
                  <SegmentedControlItem key={v} value={v} className="relative z-10 inline-flex h-7 cursor-pointer items-center rounded-[5px] px-3 text-xs font-medium text-muted-foreground outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-checked:text-foreground">
                    {label}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            )}
          </figcaption>
          <BestSignUp key={style} theme={theme} appName={appName} />
          <p className="w-[390px] text-center text-xs text-muted-foreground">Every screen works here; nothing is sent anywhere.</p>
        </figure>
      </div>

      {!!run.audit?.length && (
        <section>
          <h2 className="mb-2 text-base font-semibold">What the real one misses, and why</h2>
          <AuditView grades={run.audit} />
        </section>
      )}
    </div>
  )
}
