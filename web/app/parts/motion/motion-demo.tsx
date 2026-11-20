"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { Swap } from "../../components/checklist-layer/swap";
import { Named, Race } from "./motion-bits";

const DURS: [string, string, string][] = [
  ["--dur-quick", "120 ms", "A toggle, a hover, a press"],
  ["--dur-base", "200 ms", "A menu, a part sliding to size"],
  ["--dur-slow", "320 ms", "A whole panel or screen"],
  ["--dur-leave", "140 ms", "Anything going away"],
];
const CURVES: [string, string, string][] = [
  ["--ease-enter", "ease-out", "Things arriving"],
  ["--ease-leave", "ease-in", "Things leaving"],
  ["--ease-move", "standard", "Moves on screen"],
];
const SPEC = [
  ["Open", "click or Enter", "opacity, transform", "200 ms", "ease-out", "0"],
  ["Close", "click, Esc", "opacity, transform", "140 ms", "ease-in", "0"],
  ["Expand", "click", "grid rows", "200 ms", "standard", "0"],
  ["Push", "click", "transform", "320 ms", "standard", "0"],
];

function Tokens() {
  return (
    <div className="pt-two">
      <table className="pt-table">
        <caption className="pt-cap">Durations</caption>
        <tbody>
          {DURS.map(([n, v, u]) => (
            <tr key={n}>
              <th scope="row"><code>{n}</code></th>
              <td>{v}</td>
              <td>{u}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="pt-table">
        <caption className="pt-cap">Curves</caption>
        <tbody>
          {CURVES.map(([n, v, u]) => (
            <tr key={n}>
              <th scope="row"><code>{n}</code></th>
              <td>{v}</td>
              <td>{u}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mess() {
  const rows = ["80ms", "130ms", "175ms", "230ms", "260ms", "310ms", "420ms", "480ms", "640ms", "900ms"];
  return (
    <div className="pt-two">
      <p className="pt-note">Durations typed in by hand: {rows.join(", ")}.</p>
      <p className="pt-note">Curves typed in by hand: ease, ease-in-out, linear, cubic-bezier(.3,.1,.7,.9), steps(4).</p>
    </div>
  );
}

export function MotionDemo() {
  const { isMet } = useMet();
  const bad = !isMet(3);
  return (
    <div className="pt">
      <div className="pt-box">
        <p className="pt-cap">Tokens</p>
        <Swap item={1} good={<Tokens />} broken={<Mess />} />
        <Swap
          item={2}
          good={<p className="pt-note">Four durations and three curves are the whole list.</p>}
          broken={<p className="pt-note">Every screen added its own, so nobody can say what the list is.</p>}
        />
      </div>

      <div className="pt-box">
        <p className="pt-cap">One transition for each job</p>
        <Swap
          item={3}
          good={
            <div className="pt-row">
              {(["open", "close", "expand", "push"] as const).map((n) => (
                <Named key={n} name={n} bad={false} />
              ))}
            </div>
          }
          broken={
            <div className="pt-row">
              {(["open", "close", "expand", "push"] as const).map((n) => (
                <Named key={n} name={n} bad={bad} />
              ))}
            </div>
          }
        />
      </div>

      <div className="pt-box">
        <p className="pt-cap">Principles and spec</p>
        <Swap
          item={7}
          good={
            <ol className="pt-note pt-principles">
              <li>Motion explains where something came from or went. It never decorates.</li>
              <li>Small things are quick; big things take a little longer. Leaving is faster than arriving.</li>
              <li>Everything has a calm version that still shows the change.</li>
            </ol>
          }
          broken={<p className="pt-note">No written principles.</p>}
        />
        <Swap
          item={5}
          good={
            <div className="pt-tscroll">
            <table className="pt-table" style={{ minWidth: "34rem" }}>
              <thead>
                <tr>
                  {["Name", "Trigger", "Property", "Duration", "Curve", "Delay"].map((h) => (
                    <th key={h} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (i === 0 ? <th key={c} scope="row">{c}</th> : <td key={c + i}>{c}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          }
          broken={<p className="pt-note">&quot;Make it feel smooth.&quot; Nothing more.</p>}
        />
        <Swap
          item={6}
          good={
            <div className="pt-grid">
              <Race label="Open" ms="200 ms" dur="var(--dur-base)" ease="var(--ease-enter)" />
              <Race label="Close" ms="140 ms" dur="var(--dur-leave)" ease="var(--ease-leave)" />
            </div>
          }
          broken={<p className="pt-note">The spec has no demo beside it.</p>}
        />
      </div>

      <div className="pt-box">
        <p className="pt-cap">Timing: press Play on each</p>
        <Swap item={10} good={<Race label="Small" ms="120 ms" dur="var(--dur-quick)" ease="var(--ease-move)" />} broken={<Race label="Small" ms="900 ms" dur="900ms" ease="linear" />} />
        <Swap item={11} good={<Race label="Medium" ms="200 ms" dur="var(--dur-base)" ease="var(--ease-move)" />} broken={<Race label="Medium" ms="1200 ms" dur="1200ms" ease="linear" />} />
        <Swap item={12} good={<Race label="Big" ms="320 ms" dur="var(--dur-slow)" ease="var(--ease-move)" />} broken={<Race label="Big" ms="1600 ms" dur="1600ms" ease="linear" />} />
        <Swap item={13} good={<Race label="Leaving" ms="140 ms" dur="var(--dur-leave)" ease="var(--ease-leave)" />} broken={<Race label="Leaving" ms="700 ms" dur="700ms" ease="var(--ease-leave)" />} />
        <Swap
          item={15}
          good={
            <div className="pt-grid">
              <Race label="Enter" ms="ease-out" dur="1000ms" ease="var(--ease-enter)" />
              <Race label="Leave" ms="ease-in" dur="1000ms" ease="var(--ease-leave)" />
              <Race label="Move" ms="standard" dur="1000ms" ease="var(--ease-move)" />
            </div>
          }
          broken={
            <div className="pt-grid">
              <Race label="Enter" ms="linear" dur="1000ms" ease="linear" />
              <Race label="Leave" ms="linear" dur="1000ms" ease="linear" />
              <Race label="Move" ms="linear" dur="1000ms" ease="linear" />
            </div>
          }
        />
        <p className="pt-note">The curve race is slowed to 1 second so the difference can be seen.</p>
      </div>
    </div>
  );
}
