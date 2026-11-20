"use client";

import { ExampleBar } from "../../components/example-frame/example-bar";
import { useMet } from "../../components/checklist-layer/met-context";
import { SiteFooter } from "../../components/kit/footer";
import { SiteHeader } from "../../components/kit/header";
import { Body, Byline, Head, Picture } from "./article";
import { ARTICLE } from "./data";
import { Comments, Feed, OldPost, Preview } from "./extras";
import { Listing, Related } from "./listing";

// Item 3: a block of data in the page that tells search engines what the article is. It cannot be
// seen, so its item has no spot; unticked, the block is simply not there.
function ArticleData() {
  const { isMet } = useMet();
  if (!isMet(3)) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE.title,
    author: { "@type": "Person", name: ARTICLE.author },
    datePublished: ARTICLE.publishedIso,
    dateModified: ARTICLE.updatedIso,
    image: "https://blog.example.com/images/changelog.png",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

// One article on a made-up blog, then what sits around it: sharing, comments, more posts by
// topic and an older post. Built from the shared header and footer.
export function BlogPage() {
  return (
    <>
      <ExampleBar address="blog.example.com/posts/changelog-people-read" />
      <div className="bl-page">
        <SiteHeader variant="site" markCurrent={false} />
        <main id="main" className="bl-main">
          <ArticleData />
          <article className="bl-article" aria-labelledby="bl-title">
            <Head />
            <Byline />
            <Picture />
            <Body />
            <Related />
          </article>

          <section className="bl-block bl-follow" aria-labelledby="bl-share-h">
            <h2 id="bl-share-h">Share and follow</h2>
            <Preview />
            <Feed />
          </section>

          <section className="bl-block" aria-labelledby="bl-com-h">
            <h2 id="bl-com-h">Comments</h2>
            <Comments />
          </section>

          <section className="bl-block" aria-labelledby="bl-more-h">
            <h2 id="bl-more-h">More posts</h2>
            <Listing />
          </section>

          <section className="bl-block" aria-labelledby="bl-old-h">
            <h2 id="bl-old-h">From the archive</h2>
            <OldPost />
          </section>
        </main>
        <SiteFooter variant="full" />
      </div>
    </>
  );
}
