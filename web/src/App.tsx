import { useEffect, useState } from "react"
import { getRun, listRuns, fileUrl, type Run, type RunSummary } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Header } from "@/components/library/header"
import { RunView } from "@/components/library/run-view"
import { StatusBadge } from "@/components/library/parts"

export function App() {
  const [runs, setRuns] = useState<RunSummary[]>([])
  const [runId, setRunId] = useState<string | null>(null)
  const [run, setRun] = useState<Run | null>(null)

  // keep the list fresh; poll faster while something is recording
  useEffect(() => {
    let alive = true
    const tick = async () => {
      const r = await listRuns()
      if (!alive) return
      setRuns(r)
      setRunId((cur) => cur ?? r[0]?.id ?? null)
    }
    tick()
    const busy = runs.some((r) => r.status === "running") || run?.status === "running"
    const t = setInterval(tick, busy ? 1500 : 6000)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [runs.some((r) => r.status === "running"), run?.status])

  useEffect(() => {
    if (!runId) return
    let alive = true
    const load = async () => {
      const r = await getRun(runId)
      if (alive) setRun(r)
    }
    load()
    const t = setInterval(load, 1500)
    return () => {
      alive = false
      clearInterval(t)
    }
  }, [runId])

  return (
    <div className="flex h-svh flex-col bg-background text-foreground">
      <Header
        onStarted={(id) => {
          setRunId(id)
          setRun(null)
        }}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 overflow-y-auto border-r p-3">
          <p className="mb-2 px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Recordings</p>
          {runs.length === 0 && <p className="px-1 text-sm text-muted-foreground">Nothing recorded yet. Paste a web address above.</p>}
          <ul className="flex flex-col gap-2">
            {runs.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setRunId(r.id)}
                  className={cn(
                    "w-full overflow-hidden rounded-lg border text-left transition hover:border-foreground/30",
                    r.id === runId && "border-foreground/60 ring-1 ring-foreground/20"
                  )}
                >
                  {r.cover ? (
                    <img src={fileUrl(r.id, r.cover)} alt="" className="aspect-[16/10] w-full border-b object-cover object-top" />
                  ) : (
                    <div className="aspect-[16/10] w-full animate-pulse border-b bg-muted" />
                  )}
                  <div className="p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{r.site}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {r.steps} steps · {r.screens} screens · {new Date(r.started_at).toLocaleString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="min-w-0 flex-1 overflow-hidden">
          {run ? <RunView run={run} /> : <div className="p-8 text-sm text-muted-foreground">Pick a recording on the left.</div>}
        </main>
      </div>
    </div>
  )
}

export default App
