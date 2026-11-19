import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { Grade } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Chips } from "./parts"

// The sign-up checklist graded from the recording: measured automatically, or judged by Claude.
const RESULTS = ["fail", "partly", "pass", "not-offered", "not-reached", "untested", "not-relevant", "for-claude"]
const LABEL: Record<string, string> = {
  fail: "Fails", partly: "Partly", pass: "Passes", "not-offered": "Not offered", "not-reached": "Not reached",
  untested: "Not tested", "not-relevant": "Not relevant", "for-claude": "Waiting for Claude",
}
const TONE: Record<string, string> = {
  fail: "bg-destructive text-white", partly: "bg-amber-500 text-white", pass: "bg-emerald-500 text-white",
}

export function AuditView({ grades }: { grades: Grade[] }) {
  const [show, setShow] = useState(new Set(["fail", "partly", "pass", "not-offered"]))
  const count = (r: string) => grades.filter((g) => g.result === r).length
  const sections = useMemo(() => {
    const m = new Map<string, Grade[]>()
    for (const g of grades.filter((g) => show.has(g.result))) m.set(g.section, [...(m.get(g.section) ?? []), g])
    return [...m]
  }, [grades, show])
  const judged = count("pass") + count("partly") + count("fail")

  return (
    <div className="mx-auto max-w-[52rem]">
      <p className="mb-3 text-sm text-muted-foreground">
        {judged} of {grades.length} items judged: {count("pass")} pass, {count("partly")} partly, {count("fail")} fail.
        The rest were not offered, not reached or need a hands-on test.
      </p>
      <Chips
        all={RESULTS.filter(count)}
        labels={Object.fromEntries(RESULTS.map((r) => [r, `${LABEL[r]} ${count(r)}`]))}
        value={show}
        onChange={setShow}
      />
      {sections.map(([name, list]) => (
        <div key={name} className="mt-5">
          <h2 className="mb-2 text-sm font-semibold">{name}</h2>
          <ul className="divide-y rounded-lg border">
            {list.map((g) => (
              <li key={g.item} className="flex items-start gap-3 px-3 py-2 text-sm">
                <Badge className={cn("mt-0.5 w-[6.5rem] shrink-0 justify-center", TONE[g.result])} variant={TONE[g.result] ? "default" : "outline"}>
                  {LABEL[g.result] ?? g.result}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p>{g.item}</p>
                  {g.why && <p className="text-xs text-muted-foreground">{g.why}</p>}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{g.by === "claude" ? "Claude" : "measured"}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
