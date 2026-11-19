import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fileUrl, type Run, type Step } from "@/lib/api"
import { cn } from "@/lib/utils"
import { outcomeTone } from "./parts"

export function StepDetail({ run, step }: { run: Run; step: Step }) {
  const [speed, setSpeed] = useState(1)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (video) video.playbackRate = speed
  }, [video, speed, step.n])
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", outcomeTone[step.outcome])} />
          <h2 className="text-lg font-semibold">
            Step {step.n}: {step.control_text || `unnamed ${step.control_kind}`}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">{step.explanation}</p>
      </div>

      {step.clip ? (
        <div className="overflow-hidden rounded-lg border bg-muted">
          <video
            ref={setVideo}
            key={step.clip}
            src={fileUrl(run.id, step.clip)}
            className="aspect-[16/10] w-full"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
          <div className="flex items-center gap-1 border-t bg-background px-2 py-1.5">
            <span className="mr-1 text-xs text-muted-foreground">Speed</span>
            {[0.25, 0.5, 1].map((s) => (
              <Button key={s} size="xs" variant={speed === s ? "default" : "ghost"} onClick={() => setSpeed(s)}>
                {s}×
              </Button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {step.frames} frames · {(step.clip_ms / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border p-3 text-sm text-muted-foreground">Nothing moved, so there is no clip for this step.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          ["Before", step.before, step.url_before],
          ["After", step.after, step.url_after],
        ].map(([label, pic, url]) => (
          <figure key={label} className="overflow-hidden rounded-lg border">
            <img src={fileUrl(run.id, pic)} alt={label} className="w-full border-b" />
            <figcaption className="flex items-center gap-2 p-2 text-xs">
              <span className="font-medium">{label}</span>
              <span className="truncate text-muted-foreground">{url}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

