"use client";

import { Swap } from "../../components/checklist-layer/swap";

export type Entry = { q: string; ms: number; none: boolean };

const short = (q: string) => (q.length > 28 ? `${q.slice(0, 28)}…` : q);
const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// What the team behind the server sees. Two lists the server keeps about searches: the ones that
// found nothing (11) and the slowest ones (12). Newest first; people searching never see this.
export function TeamPanel({ log }: { log: Entry[] }) {
  const empty = [...new Set(log.filter((e) => e.none).map((e) => e.q))].slice(0, 4);
  const slow = [...log].sort((a, b) => b.ms - a.ms).slice(0, 3);

  const noneGood = (
    <ul className="se-list">
      {empty.map((q) => (
        <li key={q}>
          <span>{short(q)}</span>
        </li>
      ))}
      {empty.length === 0 && <li className="se-quiet">None yet.</li>}
    </ul>
  );
  const noneBroken = <p className="se-quiet">Not kept, so the same gaps in the index stay.</p>;
  const slowGood = (
    <ul className="se-list">
      {slow.map((e, i) => (
        <li key={`${e.q}-${i}`}>
          <span>{short(e.q)}</span>
          <span className="se-ms" data-slow={e.ms >= 500 || undefined}>
            {num(e.ms)} ms
          </span>
        </li>
      ))}
    </ul>
  );
  const slowBroken = <p className="se-quiet">Not measured, so a slow search is only noticed when someone complains.</p>;

  return (
    <section className="se-team" aria-labelledby="se-team-h">
      <h2 id="se-team-h">What the team sees</h2>
      <p className="se-sub">Kept by the server. The people searching never see this.</p>
      <div className="se-team-grid">
        <div>
          <h3>Searches with no results</h3>
          <Swap item={11} good={noneGood} broken={noneBroken} />
        </div>
        <div>
          <h3>Slowest searches</h3>
          <Swap item={12} good={slowGood} broken={slowBroken} />
        </div>
      </div>
    </section>
  );
}
