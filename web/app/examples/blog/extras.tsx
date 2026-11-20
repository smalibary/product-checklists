"use client";

/* eslint-disable @next/next/no-img-element */
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";
import { ARTICLE, COMMENTS, IMAGE, OLD_POST, SPAM } from "./data";

// Item 8: the card other sites and chat apps show when the link is shared. Unticked, a bare address.
export function Preview() {
  const good = (
    <div className="bl-card" aria-label="How the link looks when shared">
      <img src={IMAGE} alt="" width={160} height={80} />
      <div className="bl-card-text">
        <small>blog.example.com</small>
        <strong>{ARTICLE.title}</strong>
        <span>{ARTICLE.summary}</span>
      </div>
    </div>
  );
  const broken = <p className="bl-bare">{ARTICLE.url}</p>;
  return <Swap item={8} good={good} broken={broken} />;
}

// Item 9: a feed readers can subscribe to. Unticked, no way to follow except coming back.
export function Feed() {
  const { isMet } = useMet();
  return (
    <Collapse n={9} open={isMet(9)}>
      <p className="bl-feed">
        <Link href="#feed" file={{ type: "RSS", size: "all posts" }}>Subscribe with a feed reader</Link>
        <small>blog.example.com/feed.xml</small>
      </p>
    </Collapse>
  );
}

// Item 10: an old post that has been looked at again: dated, checked, and pointing to the newer one.
export function OldPost() {
  const steps = (
    <ol className="bl-steps">
      {OLD_POST.steps.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  );
  const good = (
    <article className="bl-old">
      <p className="bl-note" role="note">
        This post is from 2022. We checked it on {OLD_POST.checked}: the steps still work, but there is a newer way.{" "}
        <Link href="#new-setup">{OLD_POST.newer}</Link>.
      </p>
      <h3>{OLD_POST.title}</h3>
      {steps}
    </article>
  );
  const broken = (
    <article className="bl-old">
      <h3>{OLD_POST.title}</h3>
      {steps}
      <p className="bl-row-meta">The first command was removed two releases ago. Nothing on this page says so.</p>
    </article>
  );
  return <Swap item={10} good={good} broken={broken} />;
}

function Comment({ c, ugc }: { c: (typeof COMMENTS)[number]; ugc: boolean }) {
  return (
    <li className="bl-comment">
      <p className="bl-row-meta">
        <strong>{c.name}</strong>
        <time>{c.date}</time>
      </p>
      <p>
        {c.text}
        {c.link && (
          <>
            {" "}
            <Link href={`https://${c.link}`} external rel={ugc ? "ugc nofollow" : undefined}>{c.link}</Link>
          </>
        )}
      </p>
    </li>
  );
}

// Item 11: comments are checked before they show, and links in them are marked as the reader's own.
export function Comments() {
  const good = (
    <div className="bl-comments">
      <p className="bl-note" role="note">
        Comments are checked before they show. 1 comment is waiting. Links in comments are marked as written by readers.
      </p>
      <ul className="bl-rows">
        {COMMENTS.map((c) => (
          <Comment key={c.id} c={c} ugc />
        ))}
      </ul>
    </div>
  );
  const broken = (
    <div className="bl-comments">
      <ul className="bl-rows">
        {[...COMMENTS, SPAM].map((c) => (
          <Comment key={c.id} c={c} ugc={false} />
        ))}
      </ul>
    </div>
  );
  return <Swap item={11} good={good} broken={broken} />;
}
