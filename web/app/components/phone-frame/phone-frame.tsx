import type { ReactNode } from "react";
import { BatteryFull, CellSignalFull, WifiHigh, WifiSlash } from "@phosphor-icons/react/dist/ssr";
import "./phone-frame.css";

// A phone, for any mobile example: a rounded device outline, a status bar (time, signal, wifi,
// battery) and no address bar. `offline` swaps the wifi icon for a crossed one. Several phones
// can sit side by side (the app, and the messages app that holds its text code).
export function PhoneFrame({
  label,
  time = "9:41",
  offline = false,
  children,
}: {
  label: string;
  time?: string;
  offline?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="pf" aria-label={label}>
      <div className="pf-status" aria-hidden="true">
        <span className="pf-time">{time}</span>
        <span className="pf-island" />
        <span className="pf-icons">
          <CellSignalFull size={14} weight="fill" />
          {offline ? <WifiSlash size={14} weight="bold" /> : <WifiHigh size={14} weight="bold" />}
          <BatteryFull size={16} weight="fill" />
        </span>
      </div>
      <div className="pf-screen">{children}</div>
      <span className="pf-home" aria-hidden="true" />
    </section>
  );
}
