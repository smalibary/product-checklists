"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Changelog, Common, Errors, Help, Others } from "./extras";
import { Endpoint, QuickStart, Source, Title } from "./reference";
import { Sidebar } from "./sidebar";

// An API reference page for a made-up service: the site header and footer around a sidebar of
// docs pages and one address explained in full.
export function ApiDocs() {
  return (
    <>
      <ExampleBar address="docs.example.com/reference/orders" />
      <div className="ad-page">
        <SiteHeader variant="site" current="Docs" />
        <div className="ad-wrap">
          <div className="ad-body">
            <Sidebar />
            <main id="main" className="ad-main">
              <Title />
              <QuickStart />
              <Source />
              <Endpoint />
              <Common />
              <Errors />
              <Others />
              <Changelog />
              <Help />
            </main>
          </div>
        </div>
        <SiteFooter variant="full" />
      </div>
    </>
  );
}
