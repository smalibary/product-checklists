"use client";

import { useState } from "react";
import { Columns, Rows, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Segmented } from "../../components/kit/button";

const VIEWS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];
const MANY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "All"].map((d) => ({ value: d, label: d }));
const ICONS = [
  { value: "list", label: "List", icon: <Rows size={18} aria-hidden="true" /> },
  { value: "board", label: "Board", icon: <Columns size={18} aria-hidden="true" /> },
  { value: "grid", label: "Grid", icon: <SquaresFour size={18} aria-hidden="true" /> },
];

// Plain boxes, the version without the kit: faint selection, uneven widths, tiny taps.
function Plain({ labels, faint, tiny, wrap }: { labels: string[]; faint?: boolean; tiny?: boolean; wrap?: boolean }) {
  const [v, setV] = useState(labels[0]);
  return (
    <div className="pt-row" style={{ gap: 0, flexWrap: wrap ? "nowrap" : "wrap" }}>
      {labels.map((l) => (
        <button
          key={l}
          type="button"
          className="nv nv-btn"
          onClick={() => setV(l)}
          style={{
            borderRadius: 0,
            width: wrap ? "4rem" : undefined,
            padding: tiny ? "0 4px" : undefined,
            fontSize: tiny ? "0.6875rem" : undefined,
            background: v === l ? (faint ? "#f4f4f8" : "var(--accent)") : "none",
            color: v === l && !faint ? "var(--accent-fg)" : "var(--fg)",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SegmentedDemo() {
  const [view, setView] = useState("week");
  const [lay, setLay] = useState("list");
  const [day, setDay] = useState("Mon");
  return (
    <div className="pt-grid">
      <div className="pt-card">
        <p className="pt-cap">A few related choices</p>
        <Swap
          item={22}
          good={<Segmented label="Calendar view" options={VIEWS} value={view} onChange={setView} />}
          broken={<Segmented label="Day of the week" options={MANY} value={day} onChange={setDay} />}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Words or named icons, one kind</p>
        <Swap
          item={24}
          good={<Segmented label="Layout" options={ICONS} value={lay} onChange={setLay} />}
          broken={<Plain labels={["List", "A long label that explains itself", "☰"]} />}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">The chosen one is clear</p>
        <Swap
          item={26}
          good={<Segmented label="Calendar view" options={VIEWS} value={view} onChange={setView} />}
          broken={<Plain labels={["Day", "Week", "Month"]} faint />}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Equal parts, one line each</p>
        <Swap
          item={28}
          good={<Segmented label="Plan" options={[{ value: "a", label: "Monthly" }, { value: "b", label: "Yearly" }]} value={view === "week" ? "a" : "b"} onChange={(v) => setView(v === "a" ? "week" : "month")} />}
          broken={<Plain labels={["Monthly billing", "Yearly", "Lifetime plan"]} wrap />}
        />
      </div>
      <div className="pt-card">
        <p className="pt-cap">Big enough to tap</p>
        <Swap
          item={29}
          good={<Segmented label="Calendar view" options={VIEWS} value={view} onChange={setView} />}
          broken={<Plain labels={["Day", "Week", "Month"]} tiny />}
        />
      </div>
    </div>
  );
}
