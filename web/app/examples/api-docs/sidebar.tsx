"use client";

import { useState } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { TextField } from "../../components/kit/field";
import { Link } from "../../components/kit/link";
import { KINDS } from "./data";

const CURRENT = "Orders";
const slug = (s: string) => `#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function PageLink({ page }: { page: string }) {
  return (
    <li className="ad-page" aria-current={page === CURRENT ? "page" : undefined}>
      <Link href={slug(page)} standalone aria-current={page === CURRENT ? "page" : undefined}>
        {page}
      </Link>
    </li>
  );
}

// The sidebar: a search box, then the pages kept in four kinds. Typing narrows the list.
export function Sidebar() {
  const { isMet } = useMet();
  const [query, setQuery] = useState("");
  const q = isMet(11) ? query.trim().toLowerCase() : "";
  const kinds = KINDS.map((k) => ({ ...k, pages: k.pages.filter((p) => p.toLowerCase().includes(q)) })).filter((k) => k.pages.length > 0);
  const all = kinds.flatMap((k) => k.pages).sort();
  const none = kinds.length === 0 && <p className="ad-none" role="status">No page matches “{query.trim()}”.</p>;

  const grouped = (
    <nav aria-label="Documentation" className="ad-kinds">
      {none}
      {kinds.map((k) => (
        <div key={k.title} className="ad-kind">
          <p id={`kind-${slug(k.title).slice(1)}`} className="ad-kind-title">
            {k.title}
          </p>
          <ul aria-labelledby={`kind-${slug(k.title).slice(1)}`}>
            {k.pages.map((p) => (
              <PageLink key={p} page={p} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
  const flat = (
    <nav aria-label="Documentation" className="ad-kinds">
      {none}
      {all.length > 0 && (
        <ul>
          {all.map((p) => (
            <PageLink key={p} page={p} />
          ))}
        </ul>
      )}
    </nav>
  );

  return (
    <div className="ad-side">
      <Collapse n={11} open={isMet(11)}>
        <div role="search" className="ad-search">
          <TextField label="Search the docs" name="q" type="search" placeholder="Search all pages" onValueChange={setQuery} />
        </div>
      </Collapse>
      <Swap item={1} good={grouped} broken={flat} />
    </div>
  );
}
