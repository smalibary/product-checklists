"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Breaking, Changes, Title } from "./parts-a";
import { Email, Rollout, Store, Strip, Tip } from "./parts-b";

// One made-up What's new post: version and date, breaking changes, the grouped changes, the
// in-product tip and app strip, the opt-in email, store text and the rollout. Each block is one item.
export function ReleasePage() {
  return (
    <>
      <ExampleBar address="lorem.example.com/whats-new" />
      <div className="ra-page">
        <SiteHeader variant="app" markCurrent={false} />
        <main id="main" className="ra-main">
          <Title />
          <section className="ra-block" aria-labelledby="ra-brk-h">
            <h2 id="ra-brk-h">Before you update</h2>
            <Breaking />
          </section>
          <section className="ra-block" aria-labelledby="ra-chg-h">
            <h2 id="ra-chg-h">What changed</h2>
            <Changes />
          </section>
          <section className="ra-block" data-roomy="true" aria-labelledby="ra-app-h">
            <h2 id="ra-app-h">In the app</h2>
            <Tip />
            <Strip />
          </section>
          <div className="ra-grid">
            <section className="ra-block" aria-labelledby="ra-eml-h">
              <h2 id="ra-eml-h">Get release notes by email</h2>
              <Email />
            </section>
            <section className="ra-block" aria-labelledby="ra-sto-h">
              <h2 id="ra-sto-h">Store text</h2>
              <Store />
            </section>
          </div>
          <section className="ra-block" aria-labelledby="ra-rol-h">
            <h2 id="ra-rol-h">Rollout</h2>
            <Rollout />
          </section>
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
