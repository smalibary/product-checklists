import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fileUrl, type ComponentCard, type Run } from "@/lib/api"
import { cardText, lookRows } from "@/lib/card-text"
import { LivePreview } from "./live-preview"

const STATE_LABEL: Record<string, string> = { normal: "Normal", hover: "Hover", focus: "Focus (keyboard)", pressed: "Pressed" }

export function ComponentDetail({ run, card }: { run: Run; card: ComponentCard }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(cardText(run, card))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="mx-auto flex max-w-[64rem] flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{card.name || `Unnamed ${card.kind}`}</h2>
            <Badge variant="secondary">{card.family}</Badge>
            {card.used > 1 && <Badge variant="outline">used {card.used}× on this screen</Badge>}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{card.explanation}</p>
        </div>
        <Button size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy for AI"}
        </Button>
      </div>

      {card.live && <LivePreview key={card.id} runId={run.id} file={card.live} />}

      <section>
        <h3 className="mb-2 text-sm font-semibold">States</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {card.states.map((s) => (
            <figure key={s.state} className="flex flex-col overflow-hidden rounded-lg border">
              <div className="grid min-h-28 place-items-center bg-muted/40 p-3">
                <img src={fileUrl(run.id, s.picture)} alt={`${card.name} ${s.state}`} className="max-h-32 max-w-full object-contain" />
              </div>
              <figcaption className="flex flex-1 flex-col gap-1 border-t p-2 text-xs">
                <span className="font-medium">{STATE_LABEL[s.state] ?? s.state}</span>
                {s.state !== "normal" && <span className="text-muted-foreground">{s.said}</span>}
                {s.motion.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {s.motion.map((m, i) => (
                      <Badge key={i} variant="outline" className="h-auto font-mono text-[10px] break-all whitespace-normal">
                        {m.what} {m.ms}ms {m.easing}
                      </Badge>
                    ))}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {card.lessons.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold">What to learn from it</h3>
          <ul className="flex flex-col gap-1.5 text-sm">
            {card.lessons.map((l, i) => (
              <li key={i} className="rounded-md border px-3 py-2">
                {l}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section>
          <h3 className="mb-2 text-sm font-semibold">Look at rest</h3>
          <table className="w-full text-xs">
            <tbody className="divide-y">
              {lookRows(card).map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1 pr-3 text-muted-foreground">{k}</td>
                  <td className="py-1 font-mono break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h3 className="mb-2 text-sm font-semibold">How it is built</h3>
          <p className="mb-2 text-xs text-muted-foreground">
            A {"<"}
            {card.tag}
            {">"} element{card.role ? ` with the role "${card.role}"` : ""}, made of: {card.parts}.
          </p>
          <pre className="max-h-64 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px] whitespace-pre-wrap break-all">
            {card.html}
          </pre>
        </section>
      </div>
    </div>
  )
}
