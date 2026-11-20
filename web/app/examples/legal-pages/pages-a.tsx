"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { COLLECTED, COMPANY, IMPRINT } from "./data";

// Item 1: what is collected, why, how long, and who gets it. Unticked, one vague sentence.
export function Privacy() {
  const good = (
    <ul className="lg-cards">
      {COLLECTED.map((c) => (
        <li key={c.what} className="lg-card">
          <h3>{c.what}</h3>
          <dl>
            <div><dt>Why</dt><dd>{c.why}</dd></div>
            <div><dt>Kept</dt><dd>{c.kept}</dd></div>
            <div><dt>Shared with</dt><dd>{c.shared}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  );
  const broken = <p>We may collect information about you and share it with our partners where needed.</p>;
  return (
    <section className="lg-block" aria-labelledby="lg-priv-h">
      <h2 id="lg-priv-h">Privacy policy</h2>
      <Swap item={1} good={good} broken={broken} />
    </section>
  );
}

// Item 2: the terms, with a plain summary and the full text one link away.
export function Terms() {
  const { isMet } = useMet();
  return (
    <Collapse n={2} open={isMet(2)}>
      <section className="lg-block" aria-labelledby="lg-terms-h">
        <h2 id="lg-terms-h">Terms of use</h2>
        <p>The short version: use {COMPANY} lawfully, keep your sign-in to yourself, and tell us if something looks wrong.</p>
        <p>
          <Link href="#terms" standalone>Read the full terms of use (version 3)</Link>
        </p>
      </section>
    </Collapse>
  );
}

// Item 4: what a refund is, and how to cancel.
export function Refunds() {
  const { isMet } = useMet();
  return (
    <Collapse n={4} open={isMet(4)}>
      <section className="lg-block" aria-labelledby="lg-ref-h">
        <h2 id="lg-ref-h">Refunds and cancelling</h2>
        <ul className="lg-points">
          <li>Cancel any time from Settings. It takes two taps, and you keep your plan until the end of the period.</li>
          <li>Ask for a refund within 14 days of paying and we send it back to the same card.</li>
          <li>Renewals are emailed 7 days before they charge.</li>
        </ul>
      </section>
    </Collapse>
  );
}

// Item 5: the accessibility statement, with a way to report a problem.
export function Accessibility() {
  const { isMet } = useMet();
  return (
    <Collapse n={5} open={isMet(5)}>
      <section className="lg-block" aria-labelledby="lg-a11y-h">
        <h2 id="lg-a11y-h">Accessibility</h2>
        <p>We aim to meet WCAG 2.2 level AA. Reviewed on 3 November 2026. One known gap: older PDFs are not yet tagged.</p>
        <p>
          Something does not work for you? <Link href="mailto:access@example.com">Write to access@example.com</Link> and we reply within 5 working days.
        </p>
      </section>
    </Collapse>
  );
}

// Item 6: who is behind the site.
export function Imprint() {
  const { isMet } = useMet();
  return (
    <Collapse n={6} open={isMet(6)}>
      <section className="lg-block" aria-labelledby="lg-imp-h">
        <h2 id="lg-imp-h">Company details</h2>
        <dl className="lg-imprint">
          {IMPRINT.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Collapse>
  );
}
