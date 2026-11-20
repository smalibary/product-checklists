"use client";

import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-sdk/react/select";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { ENVS, RANGES, type Env, type Range } from "./data";

type FilterProps = { range: Range; env: Env; onRange: (r: Range) => void; onEnv: (e: Env) => void };

// Item 12: the date range and environment. One set of values, drawn at the top of the page;
// when the item is unticked the same control moves into a single chart card.
export function Filters({ range, env, onRange, onEnv }: FilterProps) {
  return (
    <div className="db-filters">
      <SegmentedControl aria-label="Date range" value={range} onValueChange={(v) => onRange(v as Range)}>
        <SegmentedControlIndicator />
        {RANGES.map((r) => (
          <SegmentedControlItem key={r.v} value={r.v}>
            {r.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <Select items={ENVS} value={env} onValueChange={(v) => onEnv(v as Env)}>
        <SelectLabel className="sr">Environment</SelectLabel>
        <SelectTrigger className="db-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ENVS.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Item 20: refresh that can be paused.
export function LiveSwitch({ live, onLive }: { live: boolean; onLive: (v: boolean) => void }) {
  return (
    <label data-slot="label" className="db-live">
      <Switch checked={live} onCheckedChange={(v) => onLive(Boolean(v))}>
        <SwitchThumb />
      </Switch>
      <span>Live updates</span>
      <span className="db-dot" data-on={live} aria-hidden="true" />
    </label>
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
