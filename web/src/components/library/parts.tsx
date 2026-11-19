import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Step } from "@/lib/api"

export const OUTCOMES: Step["outcome"][] = ["new-screen", "changed-in-place", "nothing-changed", "error"]
export const KINDS = ["link", "button", "input", "select"]

export const outcomeTone: Record<Step["outcome"], string> = {
  "new-screen": "bg-emerald-500",
  "changed-in-place": "bg-sky-500",
  "nothing-changed": "bg-muted-foreground/40",
  error: "bg-destructive",
}

export function StatusBadge({ status }: { status: string }) {
  if (status === "running") return <Badge className="animate-pulse">Recording</Badge>
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>
  return <Badge variant="secondary">Done</Badge>
}

export function Chips({
  all,
  labels,
  value,
  onChange,
}: {
  all: string[]
  labels?: Record<string, string>
  value: Set<string>
  onChange: (v: Set<string>) => void
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {all.map((k) => {
        const on = value.has(k)
        return (
          <Button
            key={k}
            size="xs"
            variant={on ? "default" : "outline"}
            onClick={() => {
              const next = new Set(value)
              if (on) next.delete(k)
              else next.add(k)
              onChange(next)
            }}
          >
            {labels?.[k] ?? k}
          </Button>
        )
      })}
    </div>
  )
}

