"use client";

import { createContext, useContext } from "react";

type MetValue = { isMet: (n: number) => boolean };

export const MetContext = createContext<MetValue>({ isMet: () => true });

// Examples call this to decide whether to draw the good or the broken version of a part.
export function useMet() {
  return useContext(MetContext);
}

// A zero-height marker with no size of its own. It keeps a spot in the page for a part that
// was removed (because its item is unticked), so the layer can still put its red badge there.
// It cancels out one gap (set --cl-gap on a flex-column parent; a grid clamps negative margins),
// so removing the part and adding the marker moves nothing.
export function Ghost({ n }: { n: number }) {
  return <div className="cl-ghost" data-item={n} aria-hidden="true" />;
}
