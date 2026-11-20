import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import "./home.css";

export default function Home() {
  return (
    <main className="home">
      <h1>Product Checklists, live examples</h1>
      <p className="home-lead">
        Each example is a small page built to one checklist, with a layer that shows which part
        meets which item.
      </p>
      <h2 className="home-sub" id="examples">Examples</h2>
      <div className="home-links">
        <Link className="home-link" href="/examples/404">
          404 page example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/resetting-password">
          Resetting password example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/dashboard">
          Dashboard example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/mobile-login">
          Mobile login example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/modal">
          Modal example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/api-docs">
          API docs example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/search">
          Search example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/readme-docs">
          README and docs example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/blog">
          Blog example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/legal-pages">
          Legal pages example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/micro-interactions">
          Micro-interactions example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/monitoring-alerts">
          Monitoring and alerts example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/release-announcements">
          Release announcements example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/examples/help-desk">
          Help desk example
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <h2 className="home-sub" id="parts">Shared parts</h2>
      <p className="home-lead">
        The standard header, footer, buttons, links, fields, code blocks and motion that every example above
        uses. Each is built to its own checklists.
      </p>
      <div className="home-links">
        <Link className="home-link" href="/parts/header">
          Header
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/footer">
          Footer
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/button">
          Button and segmented control
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/link">
          Link
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/field">
          Input field and form
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/motion">
          Motion
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/code">
          Code block and Copy
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/like">
          Like button
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link className="home-link" href="/parts/dialog">
          Dialog (modal)
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
