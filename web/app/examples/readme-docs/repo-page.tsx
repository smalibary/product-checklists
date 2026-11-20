"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Comments, Commits, Decisions, Kinds, Reference } from "./docs";
import { Help, Install, Intro, Licence, Settings } from "./readme";

// A project's home page: the README as people first meet it, then the docs, the decisions and the
// latest commits. Made up, and built from the shared header and footer.
export function RepoPage() {
  return (
    <>
      <ExampleBar address="code.example.com/team/widget" />
      <div className="rd-page">
        <SiteHeader variant="app" current="Projects" />
        <main id="main" className="rd-main">
          <header className="rd-title">
            <h1>widget</h1>
            <Licence />
          </header>

          <article className="rd-readme" aria-labelledby="rd-readme-h">
            <h2 id="rd-readme-h">README</h2>
            <Intro />
            <Install />
            <Settings />
            <Help />
          </article>

          <section className="rd-section" aria-labelledby="rd-docs-h">
            <h2 id="rd-docs-h">Docs</h2>
            <Kinds />
            <Reference />
            <h3>In the code</h3>
            <Comments />
          </section>

          <section className="rd-section" aria-labelledby="rd-dec-h">
            <h2 id="rd-dec-h">Decisions</h2>
            <Decisions />
          </section>

          <section className="rd-section" aria-labelledby="rd-com-h">
            <h2 id="rd-com-h">Latest commits</h2>
            <Commits />
          </section>
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
