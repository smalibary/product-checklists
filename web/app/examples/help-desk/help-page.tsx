"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Articles, Confirmation, Contact, RequestForm } from "./parts-a";
import { Complaints, History, Privacy, Progress, Routing, Targets } from "./parts-b";

// One made-up help centre: contact options, top articles, the request form and its confirmation,
// targets by priority, one open ticket (routing, progress, history), a privacy note and complaints.
export function HelpPage() {
  return (
    <>
      <ExampleBar address="help.example.com" />
      <div className="hd-page">
        <SiteHeader variant="app" markCurrent={false} />
        <main id="main" className="hd-main">
          <header className="hd-title">
            <p className="hd-kicker">Help centre</p>
            <h1>How can we help?</h1>
          </header>
          <section className="hd-block" aria-labelledby="hd-con-h">
            <h2 id="hd-con-h">Talk to us</h2>
            <Contact />
          </section>
          <section className="hd-block" aria-labelledby="hd-art-h">
            <h2 id="hd-art-h">Top articles</h2>
            <Articles />
          </section>
          <section className="hd-block" data-roomy="true" aria-labelledby="hd-req-h">
            <h2 id="hd-req-h">Send a request</h2>
            <RequestForm />
            <Confirmation />
          </section>
          <section className="hd-block" aria-labelledby="hd-tgt-h">
            <h2 id="hd-tgt-h">How fast we answer</h2>
            <Targets />
          </section>
          <section className="hd-block" data-roomy="true" aria-labelledby="hd-tkt-h">
            <h2 id="hd-tkt-h">Your open request HD-48213</h2>
            <Routing />
            <Progress />
            <History />
          </section>
          <div className="hd-grid">
            <section className="hd-block" aria-labelledby="hd-prv-h">
              <h2 id="hd-prv-h">Your data</h2>
              <Privacy />
            </section>
            <section className="hd-block" aria-labelledby="hd-cmp-h">
              <h2 id="hd-cmp-h">Complaints</h2>
              <Complaints />
            </section>
          </div>
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
