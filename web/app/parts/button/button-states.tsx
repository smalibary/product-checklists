"use client";

import { useState } from "react";
import { CircleNotch, TextB } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";

function Loading() {
  const [busy, setBusy] = useState(false);
  const go = () => {
    setBusy(true);
    window.setTimeout(() => setBusy(false), 1600);
  };
  return (
    <Swap
      item={13}
      good={
        <Button kind="primary" loading={busy} onClick={go}>
          Save changes
        </Button>
      }
      broken={
        <Button kind="primary" onClick={go}>
          {busy ? <CircleNotch size={18} aria-label="Saving" /> : "Save changes"}
        </Button>
      }
    />
  );
}

function Send() {
  const [hint, setHint] = useState(false);
  return (
    <Swap
      item={14}
      good={
        <div className="pt-row">
          <Button kind="secondary" onClick={() => setHint(true)}>
            Send
          </Button>
          {hint && <span className="pt-note">Add a recipient to send.</span>}
        </div>
      }
      broken={
        <Button kind="secondary" disabled>
          Send
        </Button>
      }
    />
  );
}

function Toggle() {
  const [on, setOn] = useState(false);
  const { isMet } = useMet();
  return (
    <div className="pt-row">
      <Button kind="secondary" icon={<TextB size={18} aria-hidden="true" />} pressed={isMet(19) ? on : undefined} onClick={() => setOn(!on)}>
        Bold
      </Button>
      <span className="pt-note">{isMet(19) ? "Filled while on, and announced as pressed." : "Never shows whether it is on."}</span>
    </div>
  );
}

const STATES = ["Default", "Hover", "Pressed", "Disabled", "Loading"] as const;

export function ButtonStates() {
  const force = (s: string) => (s === "Hover" ? "hover" : s === "Pressed" ? "press" : undefined);
  return (
    <>
      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">States, each held still</p>
          <Swap
            item={11}
            good={
              <div className="pt-row">
                {STATES.map((s) => (
                  <Button key={s} kind="secondary" data-force={force(s)} disabled={s === "Disabled"} loading={s === "Loading"}>
                    {s}
                  </Button>
                ))}
              </div>
            }
            broken={
              <div className="pt-row">
                {STATES.map((s) => (
                  <span key={s} className="nv nv-btn">
                    {s}
                  </span>
                ))}
              </div>
            }
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Focus, from the keyboard</p>
          <Swap
            item={12}
            good={<Button kind="secondary" data-force="focus">Focused</Button>}
            broken={<span className="nv nv-btn" style={{ outline: "none" }}>Focused</span>}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Press to see loading</p>
          <Loading />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Press to see what is missing</p>
          <Send />
        </div>
        <div className="pt-card">
          <p className="pt-cap">On a 320 px phone</p>
          <div className="pt-phone">
            <Swap
              item={17}
              good={<Button kind="primary" fullOnPhone>Continue</Button>}
              broken={<span className="nv nv-btn">Continue</span>}
            />
          </div>
        </div>
        <div className="pt-card">
          <p className="pt-cap">A toggle button</p>
          <Swap item={19} good={<Toggle />} broken={<Toggle />} />
        </div>
      </div>
    </>
  );
}
