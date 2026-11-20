"use client";

import { fmt, type Series } from "./data";

type Pick = (text: string | null) => void;

// Plain-element charts. When "pointable" is off (item 9 unticked) the marks are only a picture:
// no hover, no focus, no exact value.
type Props = { s: Series; noun: string; pointable: boolean; onPick: Pick };

const text = (s: Series, i: number, noun: string) =>
  `${s.labels[i]}: ${fmt(s.values[i])} ${noun}${s.unit && s.unit !== noun ? ` ${s.unit}` : ""}`;

export function LineChart({ s, noun, pointable, onPick }: Props) {
  const max = Math.max(...s.values) * 1.12;
  const n = s.values.length;
  const pts = s.values.map((v, i) => ({ x: (i / (n - 1)) * 100, y: 100 - (v / max) * 100 }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <div className="db-chart">
      <div className="db-plot">
        <div className="db-plot-in">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} className="db-grid" vectorEffect="non-scaling-stroke" />
            ))}
            <polygon points={`0,100 ${line} 100,100`} className="db-area" />
            <polyline points={line} className="db-stroke" vectorEffect="non-scaling-stroke" />
          </svg>
          {pts.map((p, i) =>
            pointable ? (
              <button
                key={s.labels[i]}
                type="button"
                className="db-pt"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={text(s, i, noun)}
                onMouseEnter={() => onPick(text(s, i, noun))}
                onFocus={() => onPick(text(s, i, noun))}
                onMouseLeave={() => onPick(null)}
                onBlur={() => onPick(null)}
              />
            ) : (
              <i key={s.labels[i]} className="db-pt" style={{ left: `${p.x}%`, top: `${p.y}%` }} />
            ),
          )}
        </div>
      </div>
      <div className="db-xaxis" aria-hidden="true">
        <span>{s.labels[0]}</span>
        <span>{s.labels[n - 1]}</span>
      </div>
    </div>
  );
}

export function BarChart({ s, noun, pointable, onPick }: Props) {
  const max = Math.max(...s.values);
  return (
    <ul className="db-chart db-bars">
      {s.values.map((v, i) => {
        const inner = (
          <>
            <span className="db-bar-name">{s.labels[i]}</span>
            <span className="db-bar-track">
              <span className="db-bar-fill" style={{ width: `${(v / max) * 100}%` }} />
            </span>
          </>
        );
        return (
          <li key={s.labels[i]}>
            {pointable ? (
              <button
                type="button"
                className="db-bar"
                aria-label={text(s, i, noun)}
                onMouseEnter={() => onPick(text(s, i, noun))}
                onFocus={() => onPick(text(s, i, noun))}
                onMouseLeave={() => onPick(null)}
                onBlur={() => onPick(null)}
              >
                {inner}
              </button>
            ) : (
              <div className="db-bar">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// The wrong chart for a trend (item 7 unticked): a pie of days, no scale, no order.
export function Pie({ s }: { s: Series }) {
  const total = s.values.reduce((a, b) => a + b, 0);
  const stops = s.values.map((v, i) => {
    const from = (s.values.slice(0, i).reduce((x, y) => x + y, 0) / total) * 100;
    const to = from + (v / total) * 100;
    return `color-mix(in srgb, var(--accent) ${30 + ((i * 17) % 60)}%, var(--surface)) ${from}% ${to}%`;
  });
  return (
    <div className="db-chart db-pie-wrap">
      <div className="db-pie" style={{ background: `conic-gradient(${stops.join(", ")})` }} />
    </div>
  );
}
