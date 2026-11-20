"use client";

import type { CSSProperties } from "react";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";

export type StepInfo = { n: number; label: string };

type Props = { steps: StepInfo[]; step: number; onStep: (n: number) => void };

// The row of steps above a flow example's card.
export function StepBar({ steps, step, onStep }: Props) {
  return (
    <SegmentedControl
      className="cl-steps"
      aria-label="Steps of this flow"
      style={{ "--cl-steps": steps.length } as CSSProperties}
      value={String(step)}
      onValueChange={(v) => onStep(Number(v))}
    >
      <SegmentedControlIndicator />
      {steps.map((s) => (
        <SegmentedControlItem key={s.n} value={String(s.n)}>
          <span className="cl-steps-n">{s.n}</span>
          <span className="cl-steps-label">{s.label}</span>
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
