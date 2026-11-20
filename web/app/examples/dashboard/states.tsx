"use client";

import { useEffect, useRef, useState } from "react";
import { ChartLineUp, Plugs, UserPlus, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@ui-sdk/react/button";

const bar = (w: string, h = 12) => <span className="db-sk" style={{ width: w, height: h }} />;

// Item 14: grey shapes in the real layout, one per card, each on its own.
export function SkeletonBody() {
  return (
    <div className="db-body" role="status" aria-label="Loading the dashboard">
      <div className="db-card db-sk-card">
        {bar("34%", 14)}
        {bar("82%")}
        {bar("68%")}
      </div>
      <div className="db-kpis">
        {[0, 1, 2].map((i) => (
          <div className="db-card db-sk-card" key={i}>
            {bar("60%", 12)}
            {bar("48%", 34)}
            {bar("74%", 12)}
          </div>
        ))}
      </div>
      {[0, 1].map((i) => (
        <div className="db-card db-sk-card" key={i}>
          {bar("40%", 14)}
          {bar("100%", 120)}
          {bar("70%", 12)}
        </div>
      ))}
    </div>
  );
}

// Item 14 unticked: nothing until everything is ready.
export function WholePageSpinner() {
  return (
    <div className="db-spin" role="status">
      <span className="db-spin-ring" aria-hidden="true" />
      Loading…
    </div>
  );
}

// Item 15: a new account has no data, so the page says what to do first.
export function EmptyBody() {
  return (
    <div className="db-body">
      <section className="db-card db-empty" aria-labelledby="db-empty-h">
        <ChartLineUp size={32} aria-hidden="true" />
        <h3 id="db-empty-h" className="db-title">Nothing to show yet</h3>
        <p>Your first numbers appear a few minutes after you connect a source. Start here:</p>
        <ol className="db-steps">
          <li>
            <Plugs size={18} aria-hidden="true" />
            <span>Connect a data source</span>
          </li>
          <li>
            <UserPlus size={18} aria-hidden="true" />
            <span>Invite a teammate</span>
          </li>
          <li>
            <ChartLineUp size={18} aria-hidden="true" />
            <span>Pick the numbers to watch</span>
          </li>
        </ol>
        <div className="db-empty-actions">
          <Button type="button" data-variant="solid">Connect a source</Button>
          <Button type="button">Use sample data</Button>
        </div>
      </section>
    </div>
  );
}

// Item 15 unticked: the same cards with zeros and empty plots, and no hint what to do.
export function ZeroBody() {
  return (
    <div className="db-body">
      <div className="db-kpis">
        {["Requests per minute", "Error rate", "Median response time"].map((l) => (
          <div className="db-card" key={l}>
            <div className="db-title">{l}</div>
            <div className="db-num">0</div>
          </div>
        ))}
      </div>
      {["Requests over time", "Requests by service"].map((l) => (
        <div className="db-card" key={l}>
          <div className="db-title">{l}</div>
          <div className="db-plot db-plot-empty">No data</div>
        </div>
      ))}
    </div>
  );
}

// Item 16: a card that fails says so inside itself and offers Retry; the rest keep working.
export function CardError() {
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState(0);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const retry = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      setTries((t) => t + 1);
    }, 900);
  };
  return (
    <div className="db-error" role="alert">
      <WarningCircle size={28} aria-hidden="true" />
      <p>
        {tries === 0 ? "This card could not load." : "Still could not load. This preview keeps it failing."}
      </p>
      <Button type="button" disabled={busy} onClick={retry}>
        {busy ? "Retrying…" : "Retry"}
      </Button>
    </div>
  );
}

// Item 16 unticked: it just keeps loading, forever.
export function CardForever() {
  return (
    <div className="db-error" role="status">
      <span className="db-spin-ring" aria-hidden="true" />
      <p>Loading…</p>
    </div>
  );
}
