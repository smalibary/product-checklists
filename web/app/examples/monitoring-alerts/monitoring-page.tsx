"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Checks, Notice, Objective, Signals, Title } from "./parts-a";
import { Noise, Routing, Rule, SampleAlert, Trace, Usage } from "./parts-b";

// One made-up on-call overview for a service: signals, objective, outside checks, alert rules and
// routing, a trace, a public notice and paid usage. Each block is one checklist item.
export function MonitoringPage() {
  return (
    <>
      <ExampleBar address="ops.example.com/lorem-api" />
      <div className="ma-page">
        <SiteHeader variant="app" markCurrent={false} />
        <main id="main" className="ma-main">
          <Title />
          <Notice />
          <section className="ma-block" aria-labelledby="ma-sig-h">
            <h2 id="ma-sig-h">Four signals</h2>
            <Signals />
          </section>
          <div className="ma-grid">
            <section className="ma-block" aria-labelledby="ma-slo-h">
              <h2 id="ma-slo-h">Objective</h2>
              <Objective />
            </section>
            <section className="ma-block" aria-labelledby="ma-chk-h">
              <h2 id="ma-chk-h">Checks from outside</h2>
              <Checks />
            </section>
          </div>
          <section className="ma-block" aria-labelledby="ma-trc-h">
            <h2 id="ma-trc-h">One request, four services</h2>
            <Trace />
          </section>
          <section className="ma-block" data-roomy="true" aria-labelledby="ma-rul-h">
            <h2 id="ma-rul-h">Alerts</h2>
            <Rule />
            <SampleAlert />
          </section>
          <div className="ma-grid">
            <section className="ma-block" aria-labelledby="ma-rte-h">
              <h2 id="ma-rte-h">Where alerts go</h2>
              <Routing />
            </section>
            <section className="ma-block" aria-labelledby="ma-noi-h">
              <h2 id="ma-noi-h">Alert health</h2>
              <Noise />
            </section>
          </div>
          <section className="ma-block" aria-labelledby="ma-use-h">
            <h2 id="ma-use-h">Paid usage</h2>
            <Usage />
          </section>
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
