"use client";

import { Switch, SwitchThumb } from "@ui-sdk/react/switch";

// The one switch of the site: the thumb slides and the colour changes together, with the quick
// motion token. "snap" is the broken version (no motion), for the checklist pages only.
export function Toggle({
  label,
  hint,
  checked,
  onChange,
  snap = false,
}: {
  label: string;
  // A line under the label saying what it does.
  hint?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  snap?: boolean;
}) {
  return (
    <label className="kit-switch" data-snap={snap || undefined}>
      <span className="kit-switch-text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <Switch checked={checked} onCheckedChange={(next) => onChange(next)}>
        <SwitchThumb />
      </Switch>
    </label>
  );
}
