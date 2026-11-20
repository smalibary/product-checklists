"use client";

import { Button } from "@ui-sdk/react/button";

type Props = { met: number; total: number; onReset: () => void };

export function RailScore({ met, total, onReset }: Props) {
  const all = met === total;
  return (
    <div className="cl-score" data-all={all}>
      <p className="cl-score-text" role="status" aria-live="polite">
        <strong>
          {met} of {total}
        </strong>{" "}
        met
      </p>
      <Button type="button" className="cl-reset" onClick={onReset} disabled={all}>
        Reset
      </Button>
    </div>
  );
}
