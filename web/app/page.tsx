import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import "./home.css";

export default function Home() {
  return (
    <main className="home">
      <p className="home-kicker">Product Checklists</p>
      <h1>Product Checklists, live examples</h1>
      <p className="home-lead">
        Each example is a small page built to one checklist, with a layer that shows which part
        meets which item.
      </p>
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
      </div>
      <h2 className="home-sub">Shared parts</h2>
      <p className="home-lead">
        The standard header, footer, buttons, links, fields and motion that every example above
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
      </div>
    </main>
  );
}
