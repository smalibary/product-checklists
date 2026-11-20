"use client";

import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Variants } from "../../components/checklist-layer/swap";
import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Link } from "../../components/kit/link";
import { SearchForm } from "./search-form";

const popular = [
  { label: "Home page", note: "Start from the front page", href: "#home" },
  { label: "Lorem ipsum", note: "Lorem ipsum dolor sit amet", href: "#lorem" },
  { label: "Dolor sit amet", note: "Consectetur adipiscing elit", href: "#dolor" },
  { label: "Help centre", note: "Sed do eiusmod tempor", href: "#help" },
];

const REASON =
  "The address may have a typing mistake, or the page has moved since the link was made.";
const BLAME = "You typed the address wrong, or followed a bad link.";
const WAYS = "Here are some ways to find what you were looking for.";

// Unticking an item swaps in a "broken" version of its part. All versions are drawn at once in
// one spot (Variants), so nothing moves; removed parts fold shut (Collapse).
export function Site404() {
  const { isMet } = useMet();
  const headline = (good: boolean) => (good ? "We cannot find that page" : "404 Not Found");
  const plain = (good: boolean) => <h1>{headline(good)}</h1>;
  const joke = (good: boolean) => (
    <div className="ex-stack">
      <h1>Whoops! This page wandered off</h1>
      <p className="ex-grey">{headline(good)}</p>
    </div>
  );
  const lead = (reason: string) => <p className="ex-lead">{reason}</p>;
  const leadKey = `${isMet(2) ? 1 : 0}${isMet(3) ? 1 : 0}`;

  return (
    <>
      <ExampleBar address="example.com/old-page" />
      <div className="ex-page">
        <Collapse n={8} open={isMet(8)}>
          <SiteHeader variant="site" markCurrent={false} />
        </Collapse>
      <main id="main" className="ex-main">
        <div className="ex-message">
          <Variants
            item="1 4"
            active={`${isMet(1) ? 1 : 0}${isMet(4) ? 1 : 0}`}
            parts={{ "11": plain(true), "01": plain(false), "10": joke(true), "00": joke(false) }}
          />
          <Variants
            item="2 3"
            active={leadKey}
            parts={{
              "11": lead(`${REASON} ${WAYS}`),
              "10": lead(WAYS),
              "01": lead(`${BLAME} ${WAYS}`),
              "00": lead(BLAME),
            }}
          />
          <p className="ex-code">Error code 404</p>
        </div>

        <Collapse n={5} open={isMet(5)}>
          <SearchForm />
        </Collapse>

        <Collapse n={6} open={isMet(6)}>
          <section className="ex-go" aria-labelledby="popular-heading">
            <h2 id="popular-heading">Popular pages</h2>
            <ul>
              {popular.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                  <span className="ex-card-note">{p.note}</span>
                </li>
              ))}
            </ul>
          </section>
        </Collapse>

        <Collapse n={7} open={isMet(7)}>
          <p className="ex-report">
            Followed a link from our site? <Link href="#contact">Tell us it is broken</Link> and we
            will fix it.
          </p>
        </Collapse>
      </main>
        <Collapse n={8} open={isMet(8)}>
          <SiteFooter variant="full" />
        </Collapse>
      </div>
    </>
  );
}
