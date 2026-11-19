import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "@ui-sdk/react/timeline"
import { fileUrl, outcomeLabel, type Run } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Chips, KINDS, OUTCOMES, outcomeTone } from "./parts"
import { StepDetail } from "./step-detail"

export function RunView({ run }: { run: Run }) {
  const [query, setQuery] = useState("")
  const [outcomes, setOutcomes] = useState<Set<string>>(new Set())
  const [kinds, setKinds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => setSelected(null), [run.id])

  const steps = useMemo(() => {
    const q = query.trim().toLowerCase()
    return run.steps.filter(
      (s) =>
        (outcomes.size === 0 || outcomes.has(s.outcome)) &&
        (kinds.size === 0 || kinds.has(s.control_kind)) &&
        (!q || [s.control_text, s.explanation, s.url_after, s.control_kind].join(" ").toLowerCase().includes(q))
    )
  }, [run.steps, query, outcomes, kinds])

  const current = run.steps.find((s) => s.n === selected) ?? steps[0] ?? null
  const controls = run.screens.flatMap((sc) => sc.controls)
  const tried = run.screens[0]?.controls.filter((c) => c.tried).length ?? 0

  return (
    <Tabs defaultValue="steps" className="flex h-full flex-col gap-0">
      <div className="flex items-center gap-4 border-b px-4 py-2">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">{run.site}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {run.start_url} · {run.steps.length} steps · {run.screens.length} screens
            {run.error ? ` · stopped: ${run.error}` : ""}
          </p>
        </div>
        <TabsList className="ml-auto">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="screens">Screens</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="steps" className="flex min-h-0 flex-1">
        <section className="flex w-96 shrink-0 flex-col border-r">
          <div className="flex flex-col gap-2 border-b p-3">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search steps: button text, address, what happened" />
            <Chips all={OUTCOMES} labels={outcomeLabel} value={outcomes} onChange={setOutcomes} />
            <Chips all={KINDS} value={kinds} onChange={setKinds} />
            <p className="text-xs text-muted-foreground">
              {steps.length} of {run.steps.length} steps
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <Timeline aria-label="Steps" className="relative flex flex-col">
              {steps.map((s, i) => (
                <TimelineItem
                  key={s.n}
                  onClick={() => setSelected(s.n)}
                  className={cn(
                    "relative grid cursor-pointer grid-cols-[20px_1fr] gap-x-3 rounded-lg px-2 py-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                    current?.n === s.n && "bg-muted"
                  )}
                >
                  <TimelineMarker className={cn("mt-1 size-3 rounded-full ring-4 ring-background", outcomeTone[s.outcome])} />
                  {i < steps.length - 1 && <TimelineConnector className="absolute top-6 bottom-[-8px] left-[13px] w-px bg-border" />}
                  <TimelineTitle className="col-start-2 truncate text-sm font-medium">
                    {s.n}. {s.control_text || `(unnamed ${s.control_kind})`}
                  </TimelineTitle>
                  <TimelineDescription className="col-start-2 text-xs text-muted-foreground">
                    {outcomeLabel[s.outcome]} · {s.control_kind}
                    {s.clip ? ` · ${(s.clip_ms / 1000).toFixed(1)}s clip` : ""}
                  </TimelineDescription>
                </TimelineItem>
              ))}
            </Timeline>
            {run.status === "running" && <p className="px-2 py-3 text-xs text-muted-foreground animate-pulse">Recording the next step…</p>}
          </div>
        </section>
        <section className="min-w-0 flex-1 overflow-y-auto p-4">
          {current ? <StepDetail run={run} step={current} /> : <p className="text-sm text-muted-foreground">No steps match.</p>}
        </section>
      </TabsContent>

      <TabsContent value="screens" className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {run.screens.map((sc) => (
            <figure key={sc.code} className="overflow-hidden rounded-lg border">
              <img src={fileUrl(run.id, sc.picture)} alt={sc.title} className="aspect-[16/10] w-full border-b object-cover object-top" />
              <figcaption className="p-2">
                <p className="truncate text-sm font-medium">{sc.title || sc.url}</p>
                <p className="truncate text-xs text-muted-foreground">{sc.url}</p>
                <p className="text-xs text-muted-foreground">
                  {sc.controls.length} links, buttons and fields · first seen {sc.first_step === 0 ? "at the start" : `at step ${sc.first_step}`}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="checklist" className="min-h-0 flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Start screen: {tried} of {run.screens[0]?.controls.length ?? 0} tried · {controls.length} controls seen on all screens
        </p>
        {run.screens.map((sc) => (
          <div key={sc.code} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold">{sc.title || sc.url}</h2>
            <ul className="divide-y rounded-lg border">
              {sc.controls.map((c) => (
                <li key={c.index} className="flex items-center gap-3 px-3 py-1.5 text-sm">
                  <span
                    className={cn(
                      "grid size-4 place-items-center rounded border text-[10px]",
                      c.tried && "border-emerald-500 bg-emerald-500 text-white",
                      c.external && "border-dashed"
                    )}
                  >
                    {c.tried ? "✓" : ""}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{c.text || <em className="text-muted-foreground">no label</em>}</span>
                  <Badge variant="outline">{c.kind}</Badge>
                  {c.external && <span className="text-xs text-muted-foreground">leaves the site, not tried</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}

