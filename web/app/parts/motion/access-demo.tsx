"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { Toggle } from "../../components/kit/switch";

function Panel({ ignore }: { ignore: boolean }) {
  const [open, setOpen] = useState(false);
  // Good: slides by the token (0 when calm) and fades. Broken: no fade at all, and a big zoom that ignores the setting.
  const style = ignore
    ? { opacity: 1, transform: open ? "none" : "scale(0.2)", transition: "transform 600ms ease-out", visibility: open ? ("visible" as const) : ("hidden" as const) }
    : { opacity: open ? 1 : 0, transform: `translateY(${open ? 0 : "var(--move)"})`, transition: "opacity var(--dur-fade) linear, transform var(--dur-base) var(--ease-enter)" };
  return (
    <div className="pt-box">
      <Button kind="secondary" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Close panel" : "Open panel"}
      </Button>
      <div className="pt-chip pt-panel" style={style}>
        A panel that arrives by a short slide and a fade. With reduced motion it only fades.
      </div>
    </div>
  );
}

function Loop({ canPause }: { canPause: boolean }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="pt-row">
      <span className="pt-spinner" data-paused={paused} aria-hidden="true" />
      {canPause && (
        <Button kind="quiet" size="sm" icon={paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />} onClick={() => setPaused(!paused)}>
          {paused ? "Play" : "Pause"}
        </Button>
      )}
    </div>
  );
}

function Setting({ follows }: { follows: boolean }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return (
    <p className="pt-note">
      {follows
        ? reduced
          ? "Your device asks for less motion, so the page keeps movement out and uses fades."
          : "Your device allows motion, so the page slides things a short way."
        : "The page moves the same way whatever your device asks for."}
    </p>
  );
}

function Calm() {
  const [on, setOn] = useState(false);
  useEffect(() => () => void delete document.documentElement.dataset.calm, []);
  const change = (next: boolean) => {
    setOn(next);
    document.documentElement.dataset.calm = next ? "true" : "false";
  };
  return <Toggle label="Calm mode" checked={on} onChange={change} />;
}

export function AccessDemo() {
  return (
    <div className="pt-grid">
      <div className="pt-card">
        <p className="pt-cap">Device setting</p>
        <Swap item={29} good={<Setting follows />} broken={<Setting follows={false} />} />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Calm, not nothing</p>
        <Swap item={30} good={<Panel ignore={false} />} broken={<Panel ignore />} />
      </div>
      <div className="pt-card">
        <p className="pt-cap">In-app switch</p>
        <Swap
          item={31}
          good={<Calm />}
          broken={<p className="pt-note">No switch. Only the device setting can turn motion down.</p>}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">A loop that can be paused</p>
        <Swap item={34} good={<Loop canPause />} broken={<Loop canPause={false} />} />
      </div>
    </div>
  );
}
