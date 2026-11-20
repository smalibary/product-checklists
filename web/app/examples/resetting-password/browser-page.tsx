import type { ReactNode } from "react";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";

// One page of the made-up site as the browser shows it: the address bar, the slim header and
// footer the kit gives sign-in and reset pages, and the step between them.
export function BrowserPage({ address, children }: { address: string; children: ReactNode }) {
  return (
    <>
      <ExampleBar address={address} />
      <SiteHeader variant="slim" />
      <main id="main">{children}</main>
      <SiteFooter variant="slim" />
    </>
  );
}
