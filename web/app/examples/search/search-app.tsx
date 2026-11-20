"use client";

import { useState } from "react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react/dist/ssr";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { useMet } from "../../components/checklist-layer/met-context";
import { Button, Segmented } from "../../components/kit/button";
import { TextField } from "../../components/kit/field";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { RECORDS, TRIES, TYPES, type Rec, type RecordType } from "./data";
import { search, type Flags } from "./engine";
import { Hits, Pager, Status } from "./results";
import { TeamPanel, type Entry } from "./team-panel";
import { Swap } from "../../components/checklist-layer/swap";

type Kind = "all" | RecordType;
type Run = { q: string; type: Kind; page: number };

const NEW_RECORD: Rec = { id: 16, title: "Receipt for order 1042", body: "Added just now by you.", type: "Note", date: "2026-11-20" };
const SEED: Entry[] = [
  { q: "refund policy", ms: 5, none: true },
  { q: "annual summary", ms: 1210, none: false },
  { q: "holiday", ms: 7, none: false },
];
// The chip that shows each item at work: the item it belongs to, and the search it runs.
const TRY_ITEM = [4, 2, 10, 9, 11];

// A search page over made-up records, with the server's behaviour shown as it happens: what was
// searched, how long it took, what was hidden, and what the team behind it keeps.
export function SearchApp() {
  const { isMet } = useMet();
  const [run, setRun] = useState<Run>({ q: "receipt", type: "all", page: 1 });
  const [seed, setSeed] = useState(0);
  const [raw, setRaw] = useState("receipt");
  const [log, setLog] = useState<Entry[]>(SEED);
  const [added, setAdded] = useState(false);

  const flags: Flags = {
    index: isMet(1),
    arabic: isMet(2),
    typos: isMet(4),
    rank: isMet(5),
    filterIndex: isMet(6),
    authz: isMet(8),
    limit: isMet(9),
    param: isMet(10),
  };
  // The index only learns of the new record when item 3 is met.
  const records = added && isMet(3) ? [...RECORDS, NEW_RECORD] : RECORDS;
  const out = search(run.q, run.type, flags, records);

  function go(q: string, type: Kind) {
    const o = search(q, type, flags, records);
    setRun({ q, type, page: 1 });
    setLog((l) => [{ q: o.used, ms: o.ms, none: !o.error && o.hits.length === 0 }, ...l].slice(0, 30));
  }

  return (
    <>
      <ExampleBar address="app.example.com/search?q=receipt" />
      <div className="se-page">
        <SiteHeader variant="app" current="Reports" />
        <main id="main" className="se-main">
          <h1>Search</h1>
          <form
            className="se-form"
            role="search"
            aria-label="Search records"
            onSubmit={(e) => {
              e.preventDefault();
              go(String(new FormData(e.currentTarget).get("q") ?? ""), run.type);
            }}
          >
            <TextField key={seed} label="Search your records" name="q" type="search" defaultValue={raw} onValueChange={setRaw} />
            <Button type="submit" kind="primary" icon={<MagnifyingGlass size={18} aria-hidden="true" />}>
              Search
            </Button>
          </form>
          <div className="se-tries">
            <span>Try</span>
            {TRIES.map((t, i) => (
              <Button
                key={t.label}
                kind="quiet"
                size="sm"
                data-item={TRY_ITEM[i]}
                onClick={() => {
                  setRaw(t.q);
                  setSeed((s) => s + 1);
                  go(t.q, run.type);
                }}
              >
                {t.label}
              </Button>
            ))}
          </div>
          <div className="se-kinds" data-item="6">
            <Segmented label="Kind of record" options={TYPES} value={run.type} onChange={(v) => go(run.q, v as Kind)} />
          </div>
          <Swap
            item={8}
            good={<p className="se-who">Signed in as sam@example.com. You see only records you may open.</p>}
            broken={<p className="se-who se-who-bad">Signed in as sam@example.com. Every record is searched, including other people&rsquo;s private ones.</p>}
          />
          <Status out={out} raw={run.q} type={run.type} />
          <Hits out={out} page={run.page} />
          {out.hits.length > 0 && <Pager total={out.hits.length} page={run.page} onPage={(p) => setRun({ ...run, page: p })} />}
          <div className="se-add">
            <Button kind="secondary" size="sm" icon={<Plus size={16} aria-hidden="true" />} data-item="3" disabled={added} onClick={() => setAdded(true)}>
              Add a record
            </Button>
            <p role="status" className="se-note">
              {!added
                ? "Adds one called “Receipt for order 1042”."
                : isMet(3)
                  ? "Added. Search “receipt” and it is there straight away."
                  : "Added. It will not show in search until the index is rebuilt tonight."}
            </p>
          </div>
          <TeamPanel log={log} />
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
