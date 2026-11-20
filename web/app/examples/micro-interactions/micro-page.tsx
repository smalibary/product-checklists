"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { CopyLink, Heart, Notifications, Press, Spec } from "./demos-a";
import { HoverCard, KeyboardRow, TaskList } from "./demos-b";

// One small screen with the everyday responses: press, switch, like, copy, hover, a repeated task
// and keyboard focus. Every timing is a motion token, so reduced motion makes each one instant.
export function MicroPage() {
  return (
    <>
      <ExampleBar address="example.com/post/lorem-ipsum" />
      <div className="mi-page">
        <SiteHeader variant="app" markCurrent={false} />
        <main id="main" className="mi-main">
          <header className="mi-title">
            <h1>Lorem ipsum dolor</h1>
            <p className="mi-meta">Press, toggle, like and copy. Each one answers straight away, in the shared motion time.</p>
          </header>
          <section className="mi-block" aria-labelledby="mi-spec-h">
            <h2 id="mi-spec-h">What the heart does</h2>
            <Spec />
          </section>
          <div className="mi-grid">
            <section className="mi-block" aria-labelledby="mi-press-h">
              <h2 id="mi-press-h">Press</h2>
              <Press />
            </section>
            <section className="mi-block" aria-labelledby="mi-switch-h">
              <h2 id="mi-switch-h">Switch</h2>
              <Notifications />
            </section>
            <section className="mi-block" aria-labelledby="mi-like-h">
              <h2 id="mi-like-h">Like</h2>
              <Heart />
            </section>
            <section className="mi-block" aria-labelledby="mi-copy-h">
              <h2 id="mi-copy-h">Copy link</h2>
              <CopyLink />
            </section>
          </div>
          <section className="mi-block" aria-labelledby="mi-hover-h">
            <h2 id="mi-hover-h">Hover and focus</h2>
            <HoverCard />
          </section>
          <section className="mi-block" aria-labelledby="mi-task-h">
            <h2 id="mi-task-h">Tasks</h2>
            <TaskList />
          </section>
          <section className="mi-block" aria-labelledby="mi-keys-h">
            <h2 id="mi-keys-h">Keyboard</h2>
            <p className="mi-meta">Both controls show their ring, even while the heart is growing.</p>
            <KeyboardRow />
          </section>
        </main>
        <SiteFooter variant="slim" />
      </div>
    </>
  );
}
