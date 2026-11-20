"use client";

import { useRef, useState } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { LikeButton } from "../../components/kit/like";
import { motionMs } from "../../components/kit/motion";

// Item 7: a card that eases its border and background on hover and on keyboard focus.
export function HoverCard() {
  const card = (jump: boolean) => (
    <a className="mi-hover" data-jump={jump || undefined} href="#card">
      <strong>Lorem ipsum dolor</strong>
      <span>Hover over this card, or Tab to it.</span>
    </a>
  );
  return <Swap item={7} good={card(false)} broken={card(true)} />;
}

const TASKS = ["Reply to the invoice email", "Book the room for Tuesday", "Send the draft to review"];

function Tasks({ slow }: { slow: boolean }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [busy, setBusy] = useState(-1);
  const timer = useRef(0);
  const finish = (i: number) => {
    setDone((d) => ({ ...d, [i]: !d[i] }));
    if (!slow) return;
    // The broken version plays a long celebration and holds the buttons until it is over.
    setBusy(i);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBusy(-1), motionMs("--dur-slow") * 3 + 20);
  };
  return (
    <ul className="mi-tasks">
      {TASKS.map((t, i) => (
        <li key={t} className="mi-task" data-done={!!done[i]} data-party={slow && busy === i}>
          <span>{t}</span>
          <Button
            kind="quiet"
            size="sm"
            icon={done[i] ? <Check size={16} aria-hidden="true" /> : undefined}
            pressed={!!done[i]}
            disabled={slow && busy >= 0}
            onClick={() => finish(i)}
          >
            Done
          </Button>
        </li>
      ))}
    </ul>
  );
}

// Item 8: a repeated task stays fast.
export function TaskList() {
  return <Swap item={8} good={<Tasks slow={false} />} broken={<Tasks slow />} />;
}

// Item 9: the keyboard ring on two controls that animate. The broken version removes the ring.
export function KeyboardRow() {
  const row = (cls: string) => (
    <div className={`mi-keys ${cls}`}>
      <Button kind="secondary" data-force="focus">
        Share
      </Button>
      <LikeButton force="focus" label="saved" />
    </div>
  );
  return <Swap item={9} good={row("")} broken={row("mi-noring")} />;
}
