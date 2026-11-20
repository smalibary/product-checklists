"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Fit } from "../../components/checklist-layer/fit";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse, Swap } from "../../components/checklist-layer/swap";
import { Button, Segmented } from "../../components/kit/button";
import { Link } from "../../components/kit/link";
import { PAGE_SIZE, POSTS, RELATED, TAGS, type Post } from "./data";

const topicLabel = (t: string) => TAGS.find((x) => x.value === t)?.label ?? t;

function Row({ post }: { post: Post }) {
  return (
    <li className="bl-row">
      <div className="bl-row-top">
        <Link href={`#${post.id}`} standalone>{post.title}</Link>
      </div>
      <p className="bl-row-meta">
        <span className="bl-tag">{topicLabel(post.topic)}</span>
        <time>{post.date}</time>
      </p>
      <p className="bl-row-sum">{post.summary}</p>
    </li>
  );
}

// Item 6: posts by topic, a few at a time. Unticked, every post in one long list, no topics.
export function Listing() {
  const [topic, setTopic] = useState("all");
  const [page, setPage] = useState(1);
  const list = topic === "all" ? POSTS : POSTS.filter((p) => p.topic === topic);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const shown = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const good = (
    <div className="bl-list">
      <Segmented
        label="Topic"
        options={TAGS}
        value={topic}
        onChange={(v) => {
          setTopic(v);
          setPage(1);
        }}
      />
      <Fit>
        <ul className="bl-rows" aria-label={`${topicLabel(topic)} posts`}>
          {shown.map((p) => (
            <Row key={p.id} post={p} />
          ))}
        </ul>
      </Fit>
      <nav className="bl-pager" aria-label="Pages of posts">
        <span>
          Page {page} of {pages}
        </span>
        <div className="kit-bgroup">
          <Button kind="secondary" size="sm" icon={<CaretLeft size={16} aria-hidden="true" />} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button kind="secondary" size="sm" icon={<CaretRight size={16} aria-hidden="true" />} disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </nav>
    </div>
  );
  const broken = (
    <ul className="bl-rows" aria-label="All posts">
      {POSTS.map((p) => (
        <Row key={p.id} post={p} />
      ))}
    </ul>
  );
  return <Swap item={6} good={good} broken={broken} />;
}

// Item 7: related posts at the end of the article. Unticked, the article just stops.
export function Related() {
  const { isMet } = useMet();
  return (
    <Collapse n={7} open={isMet(7)}>
      <aside className="bl-related" aria-labelledby="bl-rel-h">
        <h2 id="bl-rel-h">Related posts</h2>
        <ul className="bl-rows">
          {RELATED.map((p) => (
            <Row key={p.id} post={p} />
          ))}
        </ul>
      </aside>
    </Collapse>
  );
}
