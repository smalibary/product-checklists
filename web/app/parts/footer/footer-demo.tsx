"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { SiteFooter } from "../../components/kit/footer";

const SPOTS = {
  groups: 1,
  contact: 2,
  company: 3,
  legal: 4,
  ccpa: 5,
  a11y: 6,
  copyright: 7,
  social: 8,
  language: 9,
  newsletter: 10,
  support: 11,
  top: 20,
};

export function FooterDemo() {
  const { isMet } = useMet();
  return (
    <div className="pt">
      <div className="pt-box">
        <p className="pt-cap">Full footer</p>
        <div className="pt-frame">
          <SiteFooter spots={SPOTS} socialNames={isMet(8)} />
        </div>
      </div>
      <div className="pt-box">
        <p className="pt-cap">Slim footer, for sign-in pages</p>
        <div className="pt-frame">
          <SiteFooter variant="slim" />
        </div>
      </div>
    </div>
  );
}
