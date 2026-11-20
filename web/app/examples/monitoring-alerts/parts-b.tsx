"use client";

import { BellRinging, Ticket } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";

// Item 4: the rule watches user pain, not a high number.
export function Rule() {
  return (
    <Swap
      item={4}
      good={
        <div className="ma-box">
          <p className="ma-strong">Fire when errors use the monthly budget 14 times too fast, for 5 minutes.</p>
          <p className="ma-meta">Why: people are failing right now. A busy afternoon on its own does not fire it.</p>
        </div>
      }
      broken={
        <div className="ma-box">
          <p className="ma-strong">Fire when the processor is above 70%.</p>
          <p className="ma-meta">Fires on every busy afternoon, even when nobody is affected.</p>
        </div>
      }
    />
  );
}

// Item 5: one alert, with an owner, a first step and a runbook.
export function SampleAlert() {
  return (
    <Swap
      item={5}
      good={
        <article className="ma-alert" aria-label="Sample alert">
          <p className="ma-badge" data-level="urgent">Urgent</p>
          <h3>Search errors are using the budget too fast</h3>
          <dl className="ma-facts">
            <div><dt>Owner</dt><dd>The search team</dd></div>
            <div><dt>First step</dt><dd>Check the last release, and roll it back if errors began after it</dd></div>
            <div><dt>Runbook</dt><dd><Link href="https://example.com/runbooks/search-errors" external>Open the runbook</Link></dd></div>
          </dl>
        </article>
      }
      broken={
        <article className="ma-alert" aria-label="Sample alert">
          <p className="ma-badge" data-level="urgent">Urgent</p>
          <h3>Something is wrong</h3>
          <p className="ma-meta">Check the logs.</p>
        </article>
      }
    />
  );
}

// Item 6: where each kind of alert goes.
export function Routing() {
  return (
    <Swap
      item={6}
      good={
        <ul className="ma-list">
          <li>
            <BellRinging size={18} aria-hidden="true" />
            <span>
              <strong>Urgent</strong>: people are affected now
              <span className="ma-tile-note"> Pages the on-call person</span>
            </span>
          </li>
          <li>
            <Ticket size={18} aria-hidden="true" />
            <span>
              <strong>Everything else</strong>
              <span className="ma-tile-note"> A ticket for the next working day</span>
            </span>
          </li>
        </ul>
      }
      broken={
        <ul className="ma-list">
          <li>
            <BellRinging size={18} aria-hidden="true" />
            <span>
              <strong>Every alert</strong>
              <span className="ma-tile-note"> Pages the on-call person, day and night</span>
            </span>
          </li>
        </ul>
      }
    />
  );
}

// Item 7: noisy alerts are fixed or removed.
export function Noise() {
  return (
    <Swap
      item={7}
      good={
        <div className="ma-box">
          <p className="ma-strong">This week: 38 alerts fired, 36 needed action.</p>
          <p className="ma-meta">The 2 noisy ones were fixed or removed in the weekly review.</p>
        </div>
      }
      broken={
        <div className="ma-box">
          <p className="ma-strong">This week: 212 alerts fired, 9 needed action.</p>
          <p className="ma-meta">People have muted most of them.</p>
        </div>
      }
    />
  );
}

const SPANS = [
  ["Gateway", 0, 100, "420 ms"],
  ["Sign-in", 4, 14, "60 ms"],
  ["Search", 22, 68, "290 ms"],
  ["Database", 40, 46, "190 ms"],
] as const;

// Item 9: one request followed across services.
export function Trace() {
  return (
    <Swap
      item={9}
      good={
        <ol className="ma-trace" aria-label="One request across four services">
          {SPANS.map(([name, from, span, ms]) => (
            <li key={name} style={{ "--from": `${from}%`, "--span": `${span}%` } as CSSProperties}>
              <span className="ma-trace-name">{name}</span>
              <span className="ma-trace-bar" aria-hidden="true" />
              <span className="ma-tile-note">{ms}</span>
            </li>
          ))}
        </ol>
      }
      broken={<p className="ma-box">Separate logs for each service. A slow request cannot be followed across them.</p>}
    />
  );
}

const USAGE = [
  ["Hosting", 46, "46% of 1,000 hours"],
  ["Email sending", 83, "83% of 10,000 messages"],
  ["Maps", 12, "12% of 50,000 loads"],
] as const;

// Item 11: paid usage against its limit, with marks at 50% and 80%.
export function Usage() {
  return (
    <Swap
      item={11}
      good={
        <ul className="ma-usage">
          {USAGE.map(([name, pct, text]) => (
            <li key={name}>
              <span>
                {name} <span className="ma-tile-note">{text}</span>
              </span>
              <span className="ma-meter" role="img" aria-label={`${name}: ${text}`} style={{ "--used": `${pct}%` } as CSSProperties}>
                <span className="ma-meter-fill" data-high={pct >= 80} />
              </span>
            </li>
          ))}
          <li>
            <span className="ma-tile-note">Alerts go out at 50% and 80%. Email sending sent its 80% alert today.</span>
          </li>
        </ul>
      }
      broken={<p className="ma-box">Usage is read once a month from the invoice, after the limit was hit.</p>}
    />
  );
}
