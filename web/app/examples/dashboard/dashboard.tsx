"use client";

import { useEffect, useRef, useState } from "react";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteHeader } from "../../components/kit/header";
import { useMet } from "../../components/checklist-layer/met-context";
import { useStep } from "../../components/checklist-layer/step-context";
import { Collapse, Variants } from "../../components/checklist-layer/swap";
import { Body } from "./body";
import { Customise } from "./customise";
import { ENVS, PERIOD, updatedAt, type Env, type Range } from "./data";
import { EmptyBody, SkeletonBody, WholePageSpinner, ZeroBody } from "./states";
import { Filters, LiveForced, LiveSwitch } from "./toolbar";
import { useLayout } from "./use-layout";

const EVERY = 5000;

export function Dashboard() {
  const { isMet } = useMet();
  const { step } = useStep();
  const [range, setRange] = useState<Range>("7d");
  const [env, setEnv] = useState<Env>("prod");
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [fresh, setFresh] = useState(false);
  const { layout, save } = useLayout();
  const flash = useRef(0);

  // Item 20: the refresh can be paused. Unticked, it is forced on.
  const running = isMet(20) ? live : true;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setTick((t) => t + 1);
      setFresh(true);
      window.clearTimeout(flash.current);
      flash.current = window.setTimeout(() => setFresh(false), 1400);
    }, EVERY);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(flash.current);
    };
  }, [running]);

  const all = isMet(12);
  const shownRange = all ? range : "7d";
  const shownEnv = all ? env : "prod";
  const envLabel = ENVS.find((e) => e.value === shownEnv)?.label;
  const period = PERIOD[shownRange].replace(/^./, (c) => c.toUpperCase());
  const filters = <Filters range={range} env={env} onRange={setRange} onEnv={setEnv} />;

  return (
    <>
      <ExampleBar address="example.com/dashboard" />
      <SiteHeader variant="app" current="Overview" />
      <main id="main" className="db" data-uniform={isMet(11)} data-reflow={isMet(10)}>
        <Variants
          item={1}
          active={isMet(1) ? "good" : "broken"}
          parts={{
            good: (
              <div className="db-head">
                <h2>Operations overview</h2>
                <p>For the on-call operator: is everything healthy, and what needs me now?</p>
              </div>
            ),
            broken: (
              <div className="db-head">
                <h2>Dashboard</h2>
              </div>
            ),
          }}
        />

        <Collapse n={12} open={isMet(12)}>
          {filters}
        </Collapse>

        <Collapse n={8} open={isMet(8)}>
          <p className="db-status">
            {period} · {envLabel} · All times UTC · Requests per minute, response time in ms ·
            Updated {updatedAt(tick)} UTC
          </p>
        </Collapse>

        <div className="db-tools">
          <Variants
            item={20}
            active={isMet(20) ? "good" : "broken"}
            parts={{ good: <LiveSwitch live={live} onLive={setLive} />, broken: <LiveForced /> }}
          />
          <span className="db-slot" data-item="13" data-met={isMet(13)} inert={!isMet(13)}>
            <Customise layout={layout} onChange={save} />
          </span>
        </div>

        {step === 2 && (
          <Variants
            item={14}
            active={isMet(14) ? "good" : "broken"}
            parts={{ good: <SkeletonBody />, broken: <WholePageSpinner /> }}
          />
        )}
        {step === 3 && (
          <Variants
            item={15}
            active={isMet(15) ? "good" : "broken"}
            parts={{ good: <EmptyBody />, broken: <ZeroBody /> }}
          />
        )}
        {(step === 1 || step === 4) && (
          <Body
            range={range}
            env={env}
            tick={tick}
            fresh={fresh}
            layout={layout}
            failed={step === 4}
            filters={filters}
          />
        )}
      </main>
    </>
  );
}
