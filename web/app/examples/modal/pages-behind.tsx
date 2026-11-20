"use client";

import { Button } from "../../components/kit/button";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";

const ROWS = [
  { name: "Lorem ipsum", meta: "12 files, edited today" },
  { name: "Dolor sit amet", meta: "4 files, edited last week" },
  { name: "Consectetur", meta: "9 files, edited last month" },
  { name: "Adipiscing elit", meta: "2 files, edited last year" },
  { name: "Sed do eiusmod", meta: "7 files, edited last year" },
];

// The made-up page behind a desktop modal: the signed-in header, a short list, the slim footer.
// The opener button is the one that gets the focus back when the modal closes.
export function DeskPage({ opener, onOpen }: { opener: string; onOpen: () => void }) {
  return (
    <div className="mx-page">
      <SiteHeader variant="app" markCurrent={false} />
      <main className="mx-main">
        <h1>Projects</h1>
        <ul className="mx-list">
          {ROWS.slice(0, 3).map((r, i) => (
            <li key={r.name} className="mx-row">
              <span>
                <strong>{r.name}</strong>
                <small>{r.meta}</small>
              </span>
              {i === 0 && (
                <Button kind="secondary" size="sm" data-opener onClick={onOpen}>
                  {opener}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter variant="slim" />
    </div>
  );
}

// The made-up app screen behind a phone modal.
export function PhonePage({ opener, onOpen }: { opener: string; onOpen: () => void }) {
  return (
    <div className="mx-page mx-phone-page">
      <div className="mx-appbar">
        <strong>Projects</strong>
      </div>
      <ul className="mx-list">
        {ROWS.slice(0, 4).map((r, i) => (
          <li key={r.name} className="mx-row">
            <span>
              <strong>{r.name}</strong>
              <small>{r.meta}</small>
            </span>
            {i === 0 && (
              <Button kind="secondary" size="sm" data-opener onClick={onOpen}>
                {opener}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
