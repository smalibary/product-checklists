"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { FIELDS } from "./data";
import { Response, Samples } from "./samples";

export function Title() {
  return (
    <header className="ad-title">
      <p className="ad-crumb">Reference</p>
      <h1>Orders</h1>
      <p className="ad-lead">Create, list and look up the orders of a customer. Every address below takes the same key and returns the same kinds of error.</p>
    </header>
  );
}

// A tutorial that reaches a first working call in minutes (item 2).
export function QuickStart() {
  const { isMet } = useMet();
  return (
    <Collapse n={2} open={isMet(2)}>
      <section className="ad-quick" aria-labelledby="quick-title">
        <h2 id="quick-title">Quick start</h2>
        <p>Make your first call in about 5 minutes.</p>
        <ol>
          <li>Create a test key in your dashboard.</li>
          <li>Send the example request below.</li>
          <li>Read your first order in the response.</li>
        </ol>
        <Link href="#quick-start">Start the tutorial</Link>
      </section>
    </Collapse>
  );
}

// Says where the reference comes from (item 3).
export function Source() {
  return (
    <Swap
      item={3}
      good={
        <p className="ad-stamp">
          Generated from <code>openapi.json</code>, version 2.4, on 20 November 2026. It matches the live API.
        </p>
      }
      broken={<p className="ad-stamp">Written by hand. Last checked 14 months ago, so it may not match the live API.</p>}
    />
  );
}

function FieldsTable({ full }: { full: boolean }) {
  return (
    <table className="ad-table">
      <caption className="sr">Fields of GET /v2/orders</caption>
      <thead>
        <tr>
          <th scope="col">Field</th>
          {full && <th scope="col">Type</th>}
          <th scope="col">What it does</th>
        </tr>
      </thead>
      <tbody>
        {FIELDS.map((f) => (
          <tr key={f.name}>
            <th scope="row">
              <code>{f.name}</code>
              {full && (
                <span className="ad-req" data-required={f.required || undefined}>
                  {f.required ? "required" : "optional"}
                </span>
              )}
            </th>
            {full && (
              <td>
                <code>{f.type}</code>
              </td>
            )}
            <td>{f.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// One address, in full: the method and path, the fields with their types and required marks, a
// request in several languages and the response.
export function Endpoint() {
  return (
    <section className="ad-endpoint" aria-labelledby="list-orders">
      <h2 id="list-orders">
        <span className="ad-method">GET</span> <code>/v2/orders</code>
      </h2>
      <p>Returns one page of the orders of a customer, newest first.</p>

      <h3>Fields</h3>
      <Swap item={4} good={<FieldsTable full />} broken={<FieldsTable full={false} />} />

      <h3>Example request</h3>
      <Samples />

      <h3>Example response</h3>
      <Response />
    </section>
  );
}
