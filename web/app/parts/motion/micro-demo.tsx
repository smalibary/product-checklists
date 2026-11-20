"use client";

import { useRef, useState } from "react";
import { Check, Copy, Heart } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { Toggle } from "../../components/kit/switch";

function Like({ pop }: { pop: boolean }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className="pt-like"
      data-on={on}
      data-pop={pop}
      aria-pressed={on}
      aria-label={on ? "Remove from favourites" : "Add to favourites"}
      onClick={() => setOn(!on)}
    >
      <Heart size={22} weight={on && pop ? "fill" : "regular"} aria-hidden="true" />
    </button>
  );
}

function CopyBtn({ tell }: { tell: boolean }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const copy = () => {
    void navigator.clipboard?.writeText("lorem-ipsum").catch(() => undefined);
    if (!tell) return;
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 1500);
  };
  return (
    <Button kind="secondary" icon={done ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />} onClick={copy}>
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </Button>
  );
}

function SwitchDemo({ snap }: { snap: boolean }) {
  const [on, setOn] = useState(false);
  return <Toggle label="Notifications" checked={on} onChange={setOn} snap={snap} />;
}

export function MicroDemo() {
  return (
    <div className="pt-grid">
      <div className="pt-card">
        <p className="pt-cap">Press</p>
        <Swap
          item={22}
          good={<Button kind="primary">Press and hold</Button>}
          broken={<span className="nv nv-btn" data-odd="b" style={{ pointerEvents: "none" }}>Press and hold</span>}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Switch</p>
        <Swap item={23} good={<SwitchDemo snap={false} />} broken={<SwitchDemo snap />} />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Like</p>
        <Swap item={24} good={<Like pop />} broken={<Like pop={false} />} />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Copy</p>
        <Swap item={25} good={<CopyBtn tell />} broken={<CopyBtn tell={false} />} />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Hover and focus</p>
        <Swap
          item={26}
          good={<a className="pt-hover" href="#card">Hover or focus this card</a>}
          broken={<a className="pt-hover" data-jump="" href="#card">Hover or focus this card</a>}
        />
      </div>
    </div>
  );
}
