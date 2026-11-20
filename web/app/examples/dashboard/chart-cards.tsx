"use client";

import { useState, type ReactNode } from "react";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Variants } from "../../components/checklist-layer/swap";
import { Card, Foot } from "./card";
import { BarChart, LineChart, Pie } from "./charts";
import { fmt, services, summary, trend, type Env, type Range, type Series } from "./data";
import { CardError, CardForever } from "./states";

const HINT_POINT = "Hover over, or Tab to, a point for its exact value.";
const HINT_BAR = "Hover over, or Tab to, a bar for its exact value.";

// Item 19: a sentence for the picture, and the same numbers as a table.
function Summary({ s, noun, what, lead }: { s: Series; noun: string; what: string; lead: boolean }) {
  const { isMet } = useMet();
  return (
    <Collapse n={lead ? 19 : undefined} open={isMet(19)}>
      <div className="db-summary">
        <p>{summary(s, noun, what)}</p>
        <Collapsible>
          <CollapsibleTrigger className="db-more">
            View as table
            <CaretDown size={14} aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <table className="db-table">
              <caption className="sr">{what}</caption>
              <thead>
                <tr>
                  <th scope="col">{noun === "requests" && s.unit === "requests" ? "Service" : "Period"}</th>
                  <th scope="col">Requests</th>
                </tr>
              </thead>
              <tbody>
                {s.values.map((v, i) => (
                  <tr key={s.labels[i]}>
                    <th scope="row">{s.labels[i]}</th>
                    <td>{fmt(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsiblePanel>
        </Collapsible>
      </div>
    </Collapse>
  );
}

// Item 9: the exact value under the chart, shown on hover and on keyboard focus.
function Readout({ text, hint, lead }: { text: string | null; hint: string; lead: boolean }) {
  const { isMet } = useMet();
  return (
    <Collapse n={lead ? 9 : undefined} open={isMet(9)}>
      <output className="db-readout" data-live={text !== null}>
        {text ?? hint}
      </output>
    </Collapse>
  );
}

// "filters" is the range and environment control; it shows inside this card only while item 12 is unticked.
type TrendProps = { range: Range; env: Env; failed: boolean; filters: ReactNode; localFilters: boolean };

// The trend card carries the spots for items 7, 9, 16 and 19 (the bars card repeats the same parts).
export function TrendCard({ range, env, failed, filters, localFilters }: TrendProps) {
  const { isMet } = useMet();
  const [text, setText] = useState<string | null>(null);
  const s = trend(range, env);
  return (
    <Card title="Requests over time" className="db-chartcard">
      <Collapse open={localFilters}>{filters}</Collapse>
      <Variants
        item={failed ? 16 : undefined}
        active={failed ? (isMet(16) ? "error" : "forever") : "ok"}
        parts={{
          error: <CardError />,
          forever: <CardForever />,
          ok: (
            <div className="db-stack">
              <Variants
                item={7}
                active={isMet(7) ? "good" : "broken"}
                parts={{
                  good: <LineChart s={s} noun="requests" pointable={isMet(9)} onPick={setText} />,
                  broken: <Pie s={s} />,
                }}
              />
              <Readout text={text} hint={HINT_POINT} lead />
              <Summary s={s} noun="requests" what="Requests over time" lead />
            </div>
          ),
        }}
      />
      <Foot />
    </Card>
  );
}

export function BarsCard({ range, env }: { range: Range; env: Env }) {
  const { isMet } = useMet();
  const [text, setText] = useState<string | null>(null);
  const s = services(range, env);
  return (
    <Card title="Requests by service" className="db-chartcard db-alt">
      <Variants
        active={isMet(7) ? "good" : "broken"}
        parts={{
          good: <BarChart s={s} noun="requests" pointable={isMet(9)} onPick={setText} />,
          broken: <LineChart s={s} noun="requests" pointable={false} onPick={setText} />,
        }}
      />
      <Readout text={text} hint={HINT_BAR} lead={false} />
      <Summary s={s} noun="requests" what="Requests by service" lead={false} />
      <Foot />
    </Card>
  );
}
