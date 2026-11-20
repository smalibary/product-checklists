import type { Metadata } from "next";
import { ChecklistLayer } from "../../components/checklist-layer/checklist-layer";
import { checklist404 } from "./checklist";
import { SearchForm } from "./search-form";
import "./404.css";

export const metadata: Metadata = {
  title: "404 page example · Product Checklists",
};

const popular = [
  { label: "Home page", note: "Start from the shop's front page", href: "#home" },
  { label: "New in this week", note: "Fresh arrivals", href: "#new" },
  { label: "Arabic novels", note: "Hejazi and Arabic fiction", href: "#arabic" },
  { label: "Track your order", note: "Where is my order", href: "#orders" },
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

export default function Example404() {
  return (
    <ChecklistLayer
      data={checklist404}
      kicker="Example · 404 page"
      description="A made-up bookshop's 404 page, built to the 404 checklist. Turn on the layer to see which part meets which item."
    >
      <div className="ex-bar" aria-hidden="true">
        <span className="ex-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ex-address">qanatbooks.sa/novels/old-link</span>
      </div>
      <main className="ex-main">
        <div className="ex-message">
          <h1 data-item="1">We cannot find that page</h1>
          <p className="ex-lead" data-item="2 3">
            The address may have a typing mistake, or the page has moved since the link was
            made. Here are some ways to find what you were looking for.
          </p>
          <p className="ex-code">Error code 404</p>
        </div>

        <SearchForm />

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

        <p className="ex-report" data-item="7">
          Followed a link from our site? <a href="#contact">Tell us it is broken</a> and we
          will fix it.
        </p>
      </main>
    </ChecklistLayer>
  );
}
