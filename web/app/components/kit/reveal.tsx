import type { ReactNode } from "react";

// A panel that opens and closes by sliding to size (the "expand" motion pattern).
// Closed, it takes no room and nothing inside it can be reached.
export function Reveal({ open, id, children }: { open: boolean; id?: string; children: ReactNode }) {
  return (
    <div className="kit-reveal m-expand" id={id} data-open={open}>
      <div className="kit-reveal-inner" inert={!open}>
        {children}
      </div>
    </div>
  );
}
