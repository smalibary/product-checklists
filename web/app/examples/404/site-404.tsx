"use client";

import { Ghost, useMet } from "../../components/checklist-layer/met-context";
import { SearchForm } from "./search-form";

const popular = [
  { label: "Home page", note: "Start from the front page", href: "#home" },
  { label: "Lorem ipsum", note: "Lorem ipsum dolor sit amet", href: "#lorem" },
  { label: "Dolor sit amet", note: "Consectetur adipiscing elit", href: "#dolor" },
  { label: "Help centre", note: "Sed do eiusmod tempor", href: "#help" },
];

function Arrow() {
  return (
    <svg className="ex-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const REASON =
  "The address may have a typing mistake, or the page has moved since the link was made.";
const BLAME = "You typed the address wrong, or followed a bad link.";
const WAYS = "Here are some ways to find what you were looking for.";

// Each item the visitor unticks swaps in a "broken" version of its part. Removed parts leave a
// <Ghost>, so the layer can still show where they used to sit.
export function Site404() {
  const { isMet } = useMet();
  const headline = isMet(1) ? "We cannot find that page" : "404 Not Found";
  const joking = !isMet(4);
  const lead = isMet(3)
    ? isMet(2)
      ? `${REASON} ${WAYS}`
      : WAYS
    : isMet(2)
      ? `${BLAME} ${WAYS}`
      : BLAME;

  return (
    <>
      <div className="ex-bar" aria-hidden="true">
        <span className="ex-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ex-address">example.com/old-page</span>
      </div>
      <main className="ex-main">
        <div className="ex-message">
          {joking ? (
            <>
              <h1 data-item="4">Whoops! This page wandered off</h1>
              <p className="ex-grey" data-item="1">
                {headline}
              </p>
            </>
          ) : (
            <h1 data-item="1 4">{headline}</h1>
          )}
          <p className="ex-lead" data-item="2 3">
            {lead}
          </p>
          <p className="ex-code">Error code 404</p>
        </div>

        {isMet(5) ? <SearchForm /> : <Ghost n={5} />}

        {isMet(6) ? (
          <section className="ex-go" data-item="6" aria-labelledby="popular-heading">
            <h2 id="popular-heading">Popular pages</h2>
            <ul>
              {popular.map((p) => (
                <li key={p.href}>
                  <a href={p.href}>
                    <span className="ex-card-text">
                      <span className="ex-card-title">{p.label}</span>
                      <span className="ex-card-note">{p.note}</span>
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <Ghost n={6} />
        )}

        {isMet(7) ? (
          <p className="ex-report" data-item="7">
            Followed a link from our site? <a href="#contact">Tell us it is broken</a> and we
            will fix it.
          </p>
        ) : (
          <Ghost n={7} />
        )}
      </main>
    </>
  );
}
