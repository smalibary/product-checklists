"use client";

import { Warning } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";

const GROUPS = [
  { name: "Added", lines: ["Share a view: send a saved view to a colleague with one link.", "Dark mode follows your device setting."] },
  { name: "Changed", lines: ["Search now looks inside notes, so more results appear for short words.", "Exports finish in the background and arrive by notification."] },
  { name: "Fixed", lines: ["Lists no longer jump back to the top after you edit an item.", "Dates near midnight now show the right day."] },
  { name: "Removed", lines: ["The old print layout. Use Export to PDF instead."] },
];

const TICKETS = [
  "LOR-1204 refactor list cache",
  "LOR-1190 bump search lib",
  "LOR-1211 fix flaky export",
  "LOR-1177 remove print.css",
  "LOR-1230 share view api",
  "LOR-1219 notes index v2",
];

// Item 2: the version number and its date.
export function Title() {
  return (
    <Swap
      item={2}
      good={
        <header className="ra-title">
          <p className="ra-kicker">Release notes</p>
          <h1>Lorem 2.0.0</h1>
          <p className="ra-meta">
            <time dateTime="2026-03-12">12 March 2026</time> · Major release. The first number moves when something stops working the old way.
          </p>
        </header>
      }
      broken={
        <header className="ra-title">
          <p className="ra-kicker">Release notes</p>
          <h1>Lorem, the Spring update</h1>
          <p className="ra-meta">Out now. Nothing here says how big the change is or which release came first.</p>
        </header>
      }
    />
  );
}

// Item 3: the breaking change, first, with what to do.
export function Breaking() {
  return (
    <Swap
      item={3}
      good={
        <div className="ra-notice" role="note">
          <Warning size={20} weight="fill" aria-hidden="true" />
          <div className="ra-notice-text">
            <p className="ra-strong">The old print layout is gone.</p>
            <p>
              Saved print settings stop working. To keep printing, open a document, choose Export to PDF, then print the file.{" "}
              <Link href="https://example.com/docs/export-to-pdf" external>
                Read the steps
              </Link>
            </p>
          </div>
        </div>
      }
      broken={<p className="ra-meta">The print layout change is somewhere in the list below. No steps are given.</p>}
    />
  );
}

// Item 1: the changes, grouped for people.
export function Changes() {
  return (
    <Swap
      item={1}
      good={
        <div className="ra-groups">
          {GROUPS.map((g) => (
            <section key={g.name} className="ra-group" aria-label={g.name}>
              <h3>{g.name}</h3>
              <ul>
                {g.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      }
      broken={
        <ul className="ra-raw">
          {TICKETS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      }
    />
  );
}
