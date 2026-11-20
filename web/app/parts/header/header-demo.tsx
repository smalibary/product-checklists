"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { SiteHeader } from "../../components/kit/header";

const WIDE = { logo: 1, menu: 2, current: 3, search: 4, utility: 5, action: 6, help: 8 };
const PHONE = { menubtn: 9, menulabel: 10 };
const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.";

// One header, three places to see it: wide, phone width, and sticky inside a scrolling frame.
export function HeaderDemo() {
  const { isMet } = useMet();
  return (
    <div className="pt">
      <div className="pt-box">
        <p className="pt-cap">On a wide screen</p>
        <div className="pt-frame pt-frame-wide">
          <div>
            <SiteHeader
              spots={WIDE}
              current="Pricing"
              markCurrent={isMet(3)}
              brokens={{
                logo: <span className="nv nv-logo">Lorem</span>,
                menu: <span className="nv nv-menu">Solutions&nbsp; Platforms&nbsp; Verticals&nbsp; Synergies&nbsp; Enablement</span>,
              }}
            />
            <p className="pt-note" style={{ padding: "16px 20px 40px" }}>
              Open Features: it opens with a click or Enter. {LOREM}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-grid">
        <div className="pt-box">
          <p className="pt-cap">On a 320 px phone</p>
          <div className="pt-frame pt-phone" style={{ overflowX: "auto" }}>
            <SiteHeader spots={PHONE} current="Pricing" fold={isMet(9)} menuButtonLabel={isMet(10)} />
            <p className="pt-note" style={{ padding: "12px 12px 24px" }}>
              Tap Menu to open the full list.
            </p>
          </div>
        </div>
        <div className="pt-box">
          <p className="pt-cap">Sticky, shown scrolling</p>
          <div className="pt-frame pt-scroll">
            <SiteHeader sticky shrink={isMet(12)} spots={{ sticky: 12 }} current="Docs" />
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i}>{LOREM}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-grid">
        <div className="pt-box">
          <p className="pt-cap">Sign-in pages: slim header</p>
          <div className="pt-frame">
            <SiteHeader variant="slim" />
          </div>
        </div>
        <div className="pt-box">
          <p className="pt-cap">Signed-in app: app header</p>
          <div className="pt-frame">
            <SiteHeader variant="app" current="Overview" />
          </div>
        </div>
      </div>
    </div>
  );
}
