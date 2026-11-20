"use client";

import type { ReactNode } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { CHANGES, COMMON, ERRORS } from "./data";

// Authentication, paging, rate limits and versioning are explained once, on their own pages, and
// linked from every address (item 6). Unticked, each address repeats them in full.
export function Common() {
  const links = (
    <ul className="ad-common">
      {COMMON.map((c) => (
        <li key={c.href}>
          <Link href={c.href}>{c.label}</Link>
          <span>{c.note}</span>
        </li>
      ))}
    </ul>
  );
  const repeated = (
    <div className="ad-repeat">
      {COMMON.map((c) => (
        <p key={c.href}>
          <strong>{c.label}.</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      ))}
    </div>
  );
  return (
    <section aria-labelledby="common-title">
      <h2 id="common-title">Works the same on every address</h2>
      <Swap item={6} good={links} broken={repeated} />
    </section>
  );
}

// Every error code, with what it means and what to do (item 5).
export function Errors() {
  const { isMet } = useMet();
  return (
    <Collapse n={5} open={isMet(5)}>
      <section aria-labelledby="errors-title">
        <h2 id="errors-title">Errors</h2>
        <table className="ad-table">
          <caption className="sr">Error codes of this address</caption>
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">What it means</th>
              <th scope="col">What to do</th>
            </tr>
          </thead>
          <tbody>
            {ERRORS.map((e) => (
              <tr key={e.status}>
                <th scope="row">
                  <code>{e.status}</code> <code>{e.code}</code>
                </th>
                <td>{e.meaning}</td>
                <td>{e.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Collapse>
  );
}

function Address({ method, path, children }: { method: string; path: string; children?: ReactNode }) {
  return (
    <li className="ad-addr">
      <span className="ad-method">{method}</span> <code>{path}</code>
      {children}
    </li>
  );
}

// The older address is marked with the day it stops working and what replaces it (item 10).
export function Others() {
  const marked = (
    <Address method="GET" path="/v1/orders">
      <span className="ad-dep">Deprecated, retires 1 March 2027</span>
      <span className="ad-use">
        Use <Link href="#list-orders">GET /v2/orders</Link> instead.
      </span>
    </Address>
  );
  const plain = <Address method="GET" path="/v1/orders" />;
  return (
    <section className="ad-others" aria-labelledby="others-title">
      <h2 id="others-title">Other addresses</h2>
      <ul className="ad-addrs">
        <Address method="POST" path="/v2/orders" />
        <Address method="GET" path="/v2/orders/{id}" />
      </ul>
      <Swap item={10} good={<ul className="ad-addrs">{marked}</ul>} broken={<ul className="ad-addrs">{plain}</ul>} />
    </section>
  );
}

// A changelog with dates and what callers must do (item 9).
export function Changelog() {
  const good = (
    <ol className="ad-log">
      {CHANGES.map((c) => (
        <li key={c.date}>
          <time dateTime={c.date}>{c.date}</time>
          <span>{c.text}</span>
          <span className="ad-do">What to do: {c.action}</span>
        </li>
      ))}
    </ol>
  );
  const broken = <p className="ad-stamp">Recent updates: various improvements and fixes.</p>;
  return (
    <section aria-labelledby="log-title">
      <h2 id="log-title">Changelog</h2>
      <Swap item={9} good={good} broken={broken} />
    </section>
  );
}

// A status page and a support contact (item 12).
export function Help() {
  const { isMet } = useMet();
  return (
    <Collapse n={12} open={isMet(12)}>
      <section className="ad-help" aria-labelledby="help-title">
        <h2 id="help-title">Something not working?</h2>
        <p>
          <Link href="#status">Check the status page</Link> to see if the API is having a problem, or{" "}
          <Link href="mailto:support@example.com">email support@example.com</Link>.
        </p>
      </section>
    </Collapse>
  );
}
