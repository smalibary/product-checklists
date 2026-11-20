import type { ReactNode } from "react";

// A short message box inside the phone screen: info (accent) or bad (red).
export function Note({ tone = "info", icon, children }: { tone?: "info" | "bad"; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="ml-note" data-tone={tone} role={tone === "bad" ? "alert" : "status"}>
      <span aria-hidden="true">{icon}</span>
      <div>{children}</div>
    </div>
  );
}
