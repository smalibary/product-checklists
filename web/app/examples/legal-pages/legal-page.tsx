"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Accessibility, Imprint, Privacy, Refunds, Terms } from "./pages-a";
import { Assistant, Community, Cookies, Security } from "./pages-b";
import { Dated, Signup } from "./pages-c";

// The legal pack of a made-up company, on one page: the pages a product publishes before it goes
// live, the sign-up that links to them, and the shared footer. Made-up text, not legal advice.
export function LegalPage() {
  return (
    <>
      <ExampleBar address="example.com/legal" />
      <div className="lg-page">
        <SiteHeader variant="site" markCurrent={false} />
        <main id="main" className="lg-main">
          <header className="lg-title">
            <h1>Legal</h1>
            <p className="lg-meta">Made-up text for a made-up company. It is not legal advice.</p>
            <Dated />
          </header>
          <Privacy />
          <Terms />
          <Cookies />
          <Refunds />
          <Accessibility />
          <Imprint />
          <Security />
          <Community />
          <Assistant />
          <Signup />
        </main>
        <SiteFooter variant="full" />
      </div>
    </>
  );
}
