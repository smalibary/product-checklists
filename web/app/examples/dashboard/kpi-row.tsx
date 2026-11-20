"use client";

import { ArrowDown, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Variants } from "../../components/checklist-layer/swap";
import { Card, Foot } from "./card";
import { kpis, PREVIOUS, type Env, type Kpi, type Range } from "./data";

// Items 5 and 6 share one spot: the comparison words (5) and the arrow with "Up" or "Down" (6).
function Delta({ k, range, lead }: { k: Kpi; range: Range; lead: boolean }) {
  const { isMet } = useMet();
  const Arrow = k.dir === "up" ? ArrowUp : ArrowDown;
  const word = k.dir === "up" ? "Up" : "Down";
  const vs = <span className="db-vs">vs {PREVIOUS[range]}</span>;
  const cls = { className: "db-delta", "data-good": k.good } as const;
  const parts = {
    "11": (
      <p {...cls}>
        <Arrow size={14} aria-hidden="true" />
        {word} {k.amount} {vs}
      </p>
    ),
    "10": (
      <p {...cls}>
        {k.amount} {vs}
      </p>
    ),
    "01": (
      <p {...cls}>
        <Arrow size={14} aria-hidden="true" />
        {word} {k.amount}
      </p>
    ),
    "00": <p {...cls}>{k.amount}</p>,
  };
  const key = `${isMet(5) ? 1 : 0}${isMet(6) ? 1 : 0}` as keyof typeof parts;
  return <Variants item={lead ? "5 6" : undefined} active={key} parts={parts} />;
}

type Props = { range: Range; env: Env; tick: number; fresh: boolean };

export function KpiRow({ range, env, tick, fresh }: Props) {
  const { isMet } = useMet();
  return (
    <div className="db-kpis" data-steady={isMet(17)}>
      {kpis(range, env, tick).map((k, i) => {
        const value = (
          <Variants
            item={i === 0 ? 2 : undefined}
            active={isMet(2) ? "big" : "small"}
            parts={{
              big: <p className="db-num">{k.value}</p>,
              small: <p className="db-num db-num--small">{k.value}</p>,
            }}
          />
        );
        return (
          <Card key={k.id} title={k.label} className="db-kpi">
            <Collapse open={fresh && !isMet(17)}>
              <span className="db-fresh">Just updated</span>
            </Collapse>
            {i === 1 ? <div data-item="17">{value}</div> : value}
            <Delta k={k} range={range} lead={i === 0} />
            <Foot lead={i === 0} />
          </Card>
        );
      })}
    </div>
  );
}
