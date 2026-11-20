import Link from "next/link";
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
      <Link className="home-link" href="/examples/404">
        404 page example
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
