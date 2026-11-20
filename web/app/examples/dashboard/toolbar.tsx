"use client";

import { Segmented } from "../../components/kit/button";
import { Toggle } from "../../components/kit/switch";
import { ENVS, RANGES, type Env, type Range } from "./data";

type FilterProps = { range: Range; env: Env; onRange: (r: Range) => void; onEnv: (e: Env) => void };

const RANGE_OPTIONS = RANGES.map((r) => ({ value: r.v, label: r.label }));

// Item 12: the date range and environment. One set of values, drawn at the top of the page;
// when the item is unticked the same control moves into a single chart card.
export function Filters({ range, env, onRange, onEnv }: FilterProps) {
  return (
    <div className="db-filters">
      <Segmented label="Date range" options={RANGE_OPTIONS} value={range} onChange={(v) => onRange(v as Range)} />
      <Segmented label="Environment" options={ENVS} value={env} onChange={(v) => onEnv(v as Env)} />
    </div>
  );
}

// Item 20: refresh that can be paused.
export function LiveSwitch({ live, onLive }: { live: boolean; onLive: (v: boolean) => void }) {
  return (
    <span className="db-live">
      <Toggle label="Live updates" checked={live} onChange={onLive} />
      <span className="db-dot" data-on={live} aria-hidden="true" />
    </span>
  );
}

// Item 20 unticked: always on, no way to stop it.
export function LiveForced() {
  return (
    <p className="db-live">
      <span className="db-dot" data-on="true" aria-hidden="true" />
      Live, refreshing every 5 seconds
    </p>
  );
}
