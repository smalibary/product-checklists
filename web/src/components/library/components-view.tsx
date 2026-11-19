import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { fileUrl, type Run } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Chips } from "./parts"
import { ComponentDetail } from "./component-detail"

export function ComponentsView({ run }: { run: Run }) {
  const cards = run.components ?? []
  const [query, setQuery] = useState("")
  const [families, setFamilies] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  useEffect(() => setSelected(null), [run.id])

  const allFamilies = useMemo(() => [...new Set(cards.map((c) => c.family))].sort(), [cards])
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cards.filter(
      (c) =>
        (families.size === 0 || families.has(c.family)) &&
        (!q || [c.name, c.family, c.explanation, ...c.lessons].join(" ").toLowerCase().includes(q))
    )
  }, [cards, query, families])
  const current = cards.find((c) => c.id === selected) ?? shown[0] ?? null

  if (cards.length === 0)
    return <p className="p-4 text-sm text-muted-foreground">No component cards in this recording. Recordings made from now on include them.</p>

  return (
    <div className="flex min-h-0 flex-1">
      <section className="flex w-96 shrink-0 flex-col border-r">
        <div className="flex flex-col gap-2 border-b p-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components: name, hover, focus, contrast…" />
          <Chips all={allFamilies} value={families} onChange={setFamilies} />
          <p className="text-xs text-muted-foreground">
            {shown.length} of {cards.length} components
          </p>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {shown.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelected(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                  current?.id === c.id && "bg-muted"
                )}
              >
                <span className="grid h-12 w-24 shrink-0 place-items-center overflow-hidden rounded border bg-muted/40">
                  <img src={fileUrl(run.id, c.states[0]?.picture ?? "")} alt="" className="max-h-full max-w-full object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{c.name || `Unnamed ${c.kind}`}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.family}
                    {c.used > 1 ? ` · ${c.used}×` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="min-w-0 flex-1 overflow-y-auto p-4">
        {current ? <ComponentDetail run={run} card={current} /> : <p className="text-sm text-muted-foreground">No components match.</p>}
      </section>
    </div>
  )
}
