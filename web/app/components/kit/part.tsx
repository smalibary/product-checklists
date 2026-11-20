"use client";

import type { ReactNode } from "react";
import { useMet } from "../checklist-layer/met-context";
import { Collapse, CollapseX } from "../checklist-layer/swap";

// Which checklist item each named part of a kit component answers to. Only the example pages
// pass this; on a real page the parts are simply drawn.
export type Spots = Record<string, number | undefined>;

// One optional part of a kit component. With no item for it, it is drawn as is. With an item,
// it carries that item's spot, and when the item is unticked it folds shut (down or across) or,
// if a broken version is given, is replaced by it.
export function Part({
  name,
  spots,
  axis = "x",
  broken,
  children,
}: {
  name: string;
  spots?: Spots;
  axis?: "x" | "y";
  broken?: ReactNode;
  children: ReactNode;
}) {
  const { isMet } = useMet();
  const n = spots?.[name];
  if (n === undefined) return <>{children}</>;
  const open = isMet(n);
  if (broken !== undefined) {
    return (
      <div className="kit-part" data-item={n}>
        {open ? children : broken}
      </div>
    );
  }
  const Fold = axis === "x" ? CollapseX : Collapse;
  return (
    <Fold n={n} open={open}>
      {children}
    </Fold>
  );
}
