"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";

const TILES = [
  { label: "Traffic", value: "1,240", note: "requests a second" },
  { label: "Errors", value: "0.4%", note: "of requests failed" },
  { label: "Time taken", value: "310 ms", note: "slowest 5% of requests" },
  { label: "How full", value: "62%", note: "of capacity in use" },
];

// Item 8: one overview page for one service.
export function Title() {
  return (
    <Swap
      item={8}
      good={
        <header className="ma-title">
          <p className="ma-kicker">Service overview</p>
          <h1>Lorem API</h1>
          <p className="ma-meta">Signals, objective, checks, alerts, traces and usage for this service, on one page. Updated 2 minutes ago.</p>
        </header>
      }
      broken={
        <header className="ma-title">
          <h1>Lorem API</h1>
          <p className="ma-meta">The charts live in separate tools. Ask a colleague which one to open.</p>
        </header>
      }
    />
  );
}

// Item 10: the public notice while something is slow.
export function Notice() {
  return (
    <Swap
      item={10}
      good={
        <div className="ma-notice" role="status">
          <WarningCircle size={20} weight="fill" aria-hidden="true" />
          <p>
            Some searches are slower than usual. We are working on it. Next update by 14:30.{" "}
            <Link href="https://status.example.com" external>
              Status page
            </Link>
          </p>
        </div>
      }
      broken={<p className="ma-meta">No public notice. Customers find out from each other.</p>}
    />
  );
}

// Item 1: the four golden signals.
export function Signals() {
  return (
    <Swap
      item={1}
      good={
        <div className="ma-tiles">
          {TILES.map((t) => (
            <div key={t.label} className="ma-tile">
              <span className="ma-tile-label">{t.label}</span>
              <span className="ma-tile-value">{t.value}</span>
              <span className="ma-tile-note">{t.note}</span>
            </div>
          ))}
        </div>
      }
      broken={
        <div className="ma-tiles" data-one="true">
          <div className="ma-tile">
            <span className="ma-tile-label">Processor</span>
            <span className="ma-tile-value">91%</span>
            <span className="ma-tile-note">one number, nothing about users</span>
          </div>
        </div>
      }
    />
  );
}

// Item 2: the service level objective.
export function Objective() {
  return (
    <Swap
      item={2}
      good={
        <dl className="ma-facts">
          <div><dt>Objective</dt><dd>99.9% of requests succeed</dd></div>
          <div><dt>Over</dt><dd>The last 30 days</dd></div>
          <div><dt>Written in</dt><dd>The service agreement</dd></div>
          <div><dt>Budget left</dt><dd>38% of the allowed failures</dd></div>
        </dl>
      }
      broken={<p className="ma-box">No objective agreed. Nobody can say what good enough means.</p>}
    />
  );
}

// Item 3: checks that act like a user, from outside.
export function Checks() {
  const rows = [
    ["Open the home page", "Three places, every minute"],
    ["Sign in", "Three places, every minute"],
    ["Search for a word", "Three places, every minute"],
  ];
  return (
    <Swap
      item={3}
      good={
        <ul className="ma-list">
          {rows.map(([name, how]) => (
            <li key={name}>
              <CheckCircle size={18} weight="fill" className="ma-ok" aria-hidden="true" />
              <span>
                {name}
                <span className="ma-tile-note"> {how}, passing</span>
              </span>
            </li>
          ))}
        </ul>
      }
      broken={<p className="ma-box">No checks from outside. The first sign of trouble is a customer message.</p>}
    />
  );
}
