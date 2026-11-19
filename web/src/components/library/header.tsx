import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { startRecording } from "@/lib/api"

export function Header({ onStarted }: { onStarted: (id: string) => void }) {
  const [url, setUrl] = useState("")
  const [steps, setSteps] = useState(12)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    let u = url.trim()
    if (!u) return
    if (!/^https?:\/\//.test(u)) u = "https://" + u
    setBusy(true)
    try {
      onStarted(await startRecording(u, steps))
      setUrl("")
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <header className="flex items-center gap-4 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-md bg-foreground" />
        <span className="font-heading text-base font-semibold">agentscreen</span>
      </div>
      <form onSubmit={submit} className="ml-auto flex items-center gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Web address to record, e.g. example.com" className="w-80" />
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          tries
          <Input type="number" min={1} max={60} value={steps} onChange={(e) => setSteps(Number(e.target.value) || 12)} className="w-16" />
        </label>
        <Button type="submit" disabled={busy}>
          {busy ? "Starting…" : "Record"}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </header>
  )
}

