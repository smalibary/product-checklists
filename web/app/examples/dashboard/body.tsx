"use client";

import type { ReactNode } from "react";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse } from "../../components/checklist-layer/swap";
import { Attention } from "./attention";
import { BarsCard, TrendCard } from "./chart-cards";
import type { Env, Range } from "./data";
import { KpiRow } from "./kpi-row";
import type { Layout, Section } from "./use-layout";

type Props = {
  range: Range;
  env: Env;
  tick: number;
  fresh: boolean;
  layout: Layout;
  failed: boolean;
  filters: ReactNode;
};

// The four cards. Each sits in a folding wrapper so hiding one (Customise, or item 3) slides.
export function Body({ range, env, tick, fresh, layout, failed, filters }: Props) {
  const { isMet } = useMet();
  const shown = (id: Section) => !layout.hidden.includes(id);
  // With item 12 unticked only the trend card follows the filters; the others keep the defaults.
  const all = isMet(12);
  const at = (id: Section) => ({ order: layout.order.indexOf(id) });
  return (
    <div className="db-body">
      <Collapse n={3} open={isMet(3) && shown("attention")} style={at("attention")}>
        <Attention />
      </Collapse>
      <Collapse open={shown("kpis")} style={at("kpis")}>
        <KpiRow range={all ? range : "7d"} env={all ? env : "prod"} tick={tick} fresh={fresh} />
      </Collapse>
      <Collapse open={shown("trend")} style={at("trend")}>
        <TrendCard
          range={range}
          env={env}
          failed={failed}
          filters={filters}
          localFilters={!isMet(12)}
        />
      </Collapse>
      <Collapse open={shown("bars")} style={at("bars")}>
        <BarsCard range={all ? range : "7d"} env={all ? env : "prod"} />
      </Collapse>
    </div>
  );
}
