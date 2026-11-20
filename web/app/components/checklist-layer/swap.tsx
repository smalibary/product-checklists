"use client";

import type { ReactNode } from "react";
import { Fit } from "./fit";
import { useMet } from "./met-context";
import "./swap.css";

// Only the active version of a part is drawn. The spot's height glides between versions (Fit),
// so ticking or unticking never snaps and never leaves blank room. Put no data-item inside a
// version: the wrapper carries it.
export function Variants({
  item,
  active,
  parts,
}: {
  item: number | string;
  active: string;
  parts: Record<string, ReactNode>;
}) {
  return (
    <Fit item={item}>
      <div key={active}>{parts[active]}</div>
    </Fit>
  );
}

// A part with a good and a broken version of the same thing.
export function Swap({ item, good, broken }: { item: number; good: ReactNode; broken: ReactNode }) {
  const { isMet } = useMet();
  return <Variants item={item} active={isMet(item) ? "good" : "broken"} parts={{ good, broken }} />;
}

// A part that is simply missing when its item is unticked. It folds shut instead of snapping.
// Needs a flex-column parent that sets --cl-gap (same rule as Ghost). Put no data-item inside.
export function Collapse({ n, open, children }: { n: number; open: boolean; children: ReactNode }) {
  return (
    <div className="cl-collapse" data-open={open} data-item={n}>
      <div className="cl-collapse-inner" aria-hidden={open ? undefined : true} inert={!open}>
        {children}
      </div>
    </div>
  );
}
