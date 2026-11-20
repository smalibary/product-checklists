"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { COMMITS, DECISIONS, GOOD_CODE, KINDS, WEAK_CODE } from "./data";
import { Code } from "./readme";

const slug = (s: string) => `#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// Item 6: four kinds of page kept apart. Unticked, one flat list.
export function Kinds() {
  const good = (
    <div className="rd-kinds">
      {KINDS.map((k) => (
        <div key={k.title}>
          <p className="rd-kind-title">
            {k.title} <span>{k.note}</span>
          </p>
          <ul>
            {k.pages.map((p) => (
              <li key={p}>
                <Link href={slug(p)} standalone>{p}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  const flat = (
    <ul className="rd-flat">
      {KINDS.flatMap((k) => k.pages)
        .sort()
        .map((p) => (
          <li key={p}>
            <Link href={slug(p)} standalone>{p}</Link>
          </li>
        ))}
    </ul>
  );
  return <Swap item={6} good={good} broken={flat} />;
}

// Item 9: the reference is generated from the code. Unticked, it is written by hand and old.
export function Reference() {
  const good = (
    <p className="rd-meta">
      Generated from the source and the <code>openapi.yaml</code> file on each release. This page is for version 1.4.0.
    </p>
  );
  const broken = <p className="rd-meta rd-stale">Written by hand. Last checked 14 months ago, for version 1.1.0.</p>;
  return <Swap item={9} good={good} broken={broken} />;
}

// Item 8: comments say why. Unticked, they say what the code already says.
export function Comments() {
  return (
    <Swap
      item={8}
      good={<Code label="Code with a comment that says why" code={GOOD_CODE} />}
      broken={<Code label="Code with a comment that repeats the code" code={WEAK_CODE} />}
    />
  );
}

// Item 7: big decisions recorded with their reasons.
export function Decisions() {
  const good = (
    <ul className="rd-decisions">
      {DECISIONS.map((d) => (
        <li key={d.title}>
          <div className="rd-dec-top">
            <strong>{d.title}</strong>
            <span className="rd-tag">{d.status}</span>
            <small>{d.date}</small>
          </div>
          <p>{d.why}</p>
        </li>
      ))}
    </ul>
  );
  const broken = <p className="rd-meta">Nothing is written down. The reasons live in an old chat thread, and in the memory of whoever was there.</p>;
  return <Swap item={7} good={good} broken={broken} />;
}

// Item 10: the docs change in the same commit as the code.
export function Commits() {
  const row = (c: { id: string; text: string; files: string[] }) => (
    <li key={c.id}>
      <div>
        <code>{c.id}</code> <strong>{c.text}</strong>
      </div>
      <small>{c.files.join(", ")}</small>
    </li>
  );
  return (
    <Swap
      item={10}
      good={<ul className="rd-commits">{COMMITS.good.map(row)}</ul>}
      broken={<ul className="rd-commits">{COMMITS.broken.map(row)}</ul>}
    />
  );
}
