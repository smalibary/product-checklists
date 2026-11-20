"use client";

import { useState, type CSSProperties } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../../components/kit/button";

// A dot that runs along a track when Play is pressed, with the given time and curve.
export function Race({ label, ms, dur, ease, style }: { label: string; ms: string; dur: string; ease: string; style?: CSSProperties }) {
  const [go, setGo] = useState(false);
  return (
    <div className="pt-race">
      <Button kind="quiet" size="sm" icon={<Play size={16} aria-hidden="true" />} label={`Play ${label}`} onClick={() => setGo(!go)} />
      <span className="pt-race-name">
        {label} <span className="pt-note">{ms}</span>
      </span>
      <div className="pt-track" aria-hidden="true">
        <span
          className="pt-dot"
          style={{ insetInlineStart: go ? "calc(100% - 1rem)" : 0, transition: `inset-inline-start ${dur} ${ease}`, ...style }}
        />
      </div>
    </div>
  );
}

// One of the four named transitions, played on a small stage.
export function Named({ name, bad }: { name: "open" | "close" | "expand" | "push"; bad: boolean }) {
  const [on, setOn] = useState(name === "close");
  const odd: Record<string, string> = {
    open: "opacity 700ms linear",
    close: "opacity 90ms steps(2)",
    expand: "grid-template-rows 450ms ease-in-out",
    push: "transform 1100ms linear",
  };
  const t = bad ? { transition: odd[name] } : undefined;
  const label = name[0].toUpperCase() + name.slice(1);
  return (
    <div className="pt-named">
      <Button kind="secondary" size="sm" onClick={() => setOn(!on)}>
        {label}
      </Button>
      <div className="pt-stage" data-name={name} data-on={on}>
        {name === "expand" ? (
          <div className={bad ? "" : "m-expand"} style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", ...t }}>
            <div style={{ overflow: "hidden" }}>
              <div className="pt-chip">Lorem</div>
            </div>
          </div>
        ) : (
          <div
            className={bad ? "" : name === "push" ? "m-push" : name === "close" ? "m-close" : "m-open"}
            style={{
              opacity: name === "push" ? 1 : on ? 1 : 0,
              transform: name === "push" ? `translateX(${on ? "calc(100% + 3rem)" : "0"})` : `translateY(${on ? 0 : "var(--move)"})`,
              ...t,
            }}
          >
            <div className="pt-chip">Lorem</div>
          </div>
        )}
      </div>
    </div>
  );
}
