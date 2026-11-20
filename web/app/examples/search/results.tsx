"use client";

import { CaretLeft, CaretRight, Lock, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Fit } from "../../components/checklist-layer/fit";
import { useMet } from "../../components/checklist-layer/met-context";
import { Swap } from "../../components/checklist-layer/swap";
import { Button } from "../../components/kit/button";
import { MAX_QUERY, PAGE_SIZE } from "./data";
import type { Outcome } from "./engine";

const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// The line above the results: what was searched for, how many were found, how long it took.
// Timing is shown so the index (1) and the indexed filter (6) can be seen.
export function Status({ out, raw, type }: { out: Outcome; raw: string; type: string }) {
  const { isMet } = useMet();
  const shownQuery = out.used.length > 40 ? `${out.used.slice(0, 40)}…` : out.used;
  const filterScan = type !== "all" && !isMet(6);
  const how = isMet(1)
    ? filterScan ? "using the index, but the filter scanned every record" : "using the index"
    : "scanning every record";
  const took = (
    <span className="se-took" data-item="1" data-slow={out.ms >= 500 || undefined}>
      {num(out.ms)} ms, {how}
    </span>
  );
  let line: React.ReactNode;
  if (out.error) {
    line = (
      <p className="se-error">
        <WarningCircle size={18} aria-hidden="true" /> Search failed: {out.error}
      </p>
    );
  } else if (out.hits.length === 0) {
    line = (
      <p>
        <strong>No results</strong> for “{shownQuery}”. Try fewer or different words.
      </p>
    );
  } else {
    line = (
      <p>
        <strong>{out.hits.length} {out.hits.length === 1 ? "result" : "results"}</strong> for “{shownQuery}”
      </p>
    );
  }
  return (
    <Fit>
      <div className="se-status" role="status">
        {line}
        {out.corrected && !out.error && (
          <p className="se-note">
            Showing results for “{out.corrected}”. You typed “{raw}”.
          </p>
        )}
        {out.shortened && <p className="se-note">Only the first {MAX_QUERY} characters of your search were used.</p>}
        {took}
      </div>
    </Fit>
  );
}

// The results, best match first. Unticked, the order is the order they were stored in (5).
export function Hits({ out, page }: { out: Outcome; page: number }) {
  const { isMet } = useMet();
  const start = isMet(7) ? (page - 1) * PAGE_SIZE : 0;
  const shown = isMet(7) ? out.hits.slice(start, start + PAGE_SIZE) : out.hits;
  if (shown.length === 0) return null;
  return (
    <ol className="se-hits" data-item="5" aria-label="Search results" start={start + 1}>
      {shown.map(({ rec }) => (
        <li key={rec.id} className="se-hit">
          <div className="se-hit-top">
            <strong lang={/[؀-ۿ]/.test(rec.title) ? "ar" : undefined}>{rec.title}</strong>
            <span className="se-tag">{rec.type}</span>
            {rec.private && (
              <span className="se-tag se-priv">
                <Lock size={12} aria-hidden="true" /> Another person&rsquo;s private record
              </span>
            )}
          </div>
          <p lang={/[؀-ۿ]/.test(rec.body) ? "ar" : undefined}>{rec.body}</p>
          <small>{rec.date}</small>
        </li>
      ))}
    </ol>
  );
}

// Paging, at most five to a page. Unticked, every result comes in one long list.
export function Pager({ total, page, onPage }: { total: number; page: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, page * PAGE_SIZE);
  const good =
    total > PAGE_SIZE ? (
      <nav className="se-pager" aria-label="Result pages">
        <span>
          {from} to {to} of {total}
        </span>
        <div className="kit-bgroup">
          <Button kind="secondary" size="sm" icon={<CaretLeft size={16} aria-hidden="true" />} disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </Button>
          <Button kind="secondary" size="sm" icon={<CaretRight size={16} aria-hidden="true" />} disabled={page >= pages} onClick={() => onPage(page + 1)}>
            Next
          </Button>
        </div>
      </nav>
    ) : (
      <p className="se-pager se-pager-one">At most {PAGE_SIZE} results come back at a time.</p>
    );
  const broken = <p className="se-pager se-pager-one">All {total} results are sent at once, however many there are.</p>;
  return <Swap item={7} good={good} broken={broken} />;
}
