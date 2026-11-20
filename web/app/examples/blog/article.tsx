"use client";

/* eslint-disable @next/next/no-img-element */
import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { ARTICLE, IMAGE, IMAGE_SIZE, WALL } from "./data";

// Item 1: a clear title with a summary under it.
export function Head() {
  return (
    <Swap
      item={1}
      good={
        <div className="bl-head">
          <h1 id="bl-title">{ARTICLE.title}</h1>
          <p className="bl-summary">{ARTICLE.summary}</p>
        </div>
      }
      broken={
        <div className="bl-head">
          <h1 id="bl-title">Notes, part 3</h1>
        </div>
      }
    />
  );
}

// Item 2: who wrote it, and when it was published and last updated.
export function Byline() {
  return (
    <Swap
      item={2}
      good={
        <p className="bl-byline">
          By <Link href="#author">{ARTICLE.author}</Link>
          <span aria-hidden="true"> · </span>
          Published <time dateTime={ARTICLE.publishedIso}>{ARTICLE.published}</time>
          <span aria-hidden="true"> · </span>
          Updated <time dateTime={ARTICLE.updatedIso}>{ARTICLE.updated}</time>
          <span aria-hidden="true"> · </span>
          {ARTICLE.read}
        </p>
      }
      broken={<p className="bl-byline">By the team</p>}
    />
  );
}

// Item 5: an image with a description, a caption and its size set, so the text never jumps.
export function Picture() {
  const good = (
    <figure className="bl-figure">
      <img src={IMAGE} alt={ARTICLE.imageAlt} width={IMAGE_SIZE.width} height={IMAGE_SIZE.height} />
      <figcaption>{ARTICLE.imageCaption}</figcaption>
    </figure>
  );
  const broken = (
    <div className="bl-figure bl-figure-bad">
      <span className="bl-missing">IMG_2041.jpg</span>
    </div>
  );
  return <Swap item={5} good={good} broken={broken} />;
}

// Item 4: headings, short paragraphs and a contents list. Unticked, one block of text.
export function Body() {
  const good = (
    <div className="bl-body">
      <nav className="bl-toc" aria-label="On this page">
        <h2>On this page</h2>
        <ul>
          {ARTICLE.sections.map((s) => (
            <li key={s.id}>
              <Link href={`#${s.id}`} standalone>{s.h}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {ARTICLE.sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <h2 id={s.id}>{s.h}</h2>
          {s.p.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </section>
      ))}
    </div>
  );
  const broken = (
    <div className="bl-body">
      <p className="bl-wall">{WALL}</p>
    </div>
  );
  return <Swap item={4} good={good} broken={broken} />;
}
