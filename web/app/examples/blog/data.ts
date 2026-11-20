export const TAGS = [
  { value: "all", label: "All" },
  { value: "design", label: "Design" },
  { value: "code", label: "Code" },
  { value: "notes", label: "Notes" },
];
export type Topic = "design" | "code" | "notes";

export const PAGE_SIZE = 3;

export type Post = { id: string; title: string; topic: Topic; date: string; summary: string };

export const POSTS: Post[] = [
  { id: "p1", title: "Keep a changelog people actually read", topic: "notes", date: "12 Oct 2026", summary: "Short entries, grouped by what changed for the reader." },
  { id: "p2", title: "Spacing that holds up on small screens", topic: "design", date: "29 Sep 2026", summary: "One scale of gaps, used everywhere, beats a hundred tweaks." },
  { id: "p3", title: "Why we stopped nesting menus", topic: "design", date: "15 Sep 2026", summary: "Two levels was one too many for our visitors." },
  { id: "p4", title: "Small functions, clear names", topic: "code", date: "02 Sep 2026", summary: "What a good name saves you in six months." },
  { id: "p5", title: "A week without meetings", topic: "notes", date: "18 Aug 2026", summary: "What we kept, what we dropped, and what we missed." },
  { id: "p6", title: "Testing the slow path", topic: "code", date: "04 Aug 2026", summary: "The failures that only show up when a request is late." },
  { id: "p7", title: "Colour that works in the dark", topic: "design", date: "21 Jul 2026", summary: "Checking contrast on both themes before shipping." },
  { id: "p8", title: "Notes from a quiet release", topic: "notes", date: "07 Jul 2026", summary: "A release nobody noticed, and why that is the goal." },
];

export const ARTICLE = {
  title: "Keep a changelog people actually read",
  summary: "A changelog is only useful if readers open it. Here is a simple shape that gets read: short entries, grouped by what changed for the reader, with the date first.",
  author: "Jo Example",
  published: "12 October 2026",
  publishedIso: "2026-10-12",
  updated: "3 November 2026",
  updatedIso: "2026-11-03",
  read: "6 min read",
  url: "https://blog.example.com/posts/changelog-people-read",
  imageAlt: "A bar chart where each release has a short bar for fixes and a taller bar for new things",
  imageCaption: "Fixes are many and small; new things are few and large. Group them that way.",
  sections: [
    { id: "bl-why", h: "Why most changelogs are skipped", p: ["They list every change in the order it was made. Readers want to know what is different for them.", "So start from the reader, not from the commit list."] },
    { id: "bl-shape", h: "A shape that works", p: ["Put the date first, then a one-line headline. Group entries under New, Better and Fixed.", "Keep each entry to one sentence. Link to the longer story when there is one."] },
    { id: "bl-keep", h: "Keeping it up", p: ["Write the entry in the same change that makes it. A changelog written later is a changelog guessed.", "Once a quarter, read the last four entries aloud. If one is hard to follow, rewrite it."] },
  ],
};

export const WALL =
  "They list every change in the order it was made and readers want to know what is different for them so start from the reader and not from the commit list and then put the date first and a one line headline and group entries under new and better and fixed and keep each entry to one sentence and link to the longer story when there is one and write the entry in the same change that makes it because a changelog written later is a changelog guessed and once a quarter read the last four entries aloud and if one is hard to follow rewrite it.";

// An abstract picture for the article: two groups of bars on a plain ground.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect width="640" height="320" fill="#e8f1ef"/><g fill="#0f766e"><rect x="60" y="200" width="36" height="60"/><rect x="116" y="170" width="36" height="90"/><rect x="172" y="215" width="36" height="45"/><rect x="228" y="150" width="36" height="110"/></g><g fill="#b45309"><rect x="360" y="110" width="60" height="150"/><rect x="450" y="60" width="60" height="200"/></g><rect x="40" y="262" width="560" height="4" fill="#334155"/></svg>`;
export const IMAGE = `data:image/svg+xml,${encodeURIComponent(SVG)}`;
export const IMAGE_SIZE = { width: 640, height: 320 };

export const RELATED: Post[] = [POSTS[4], POSTS[7], POSTS[3]];

export const OLD_POST = {
  title: "Setting up the tools (2022)",
  steps: ["Install version 1 of the tool.", "Run the old setup command.", "Restart your machine."],
  checked: "3 November 2026",
  newer: "Setting up the tools, the current way",
};

export const COMMENTS = [
  { id: "c1", name: "Sam Reader", date: "13 Oct 2026", text: "We did this last quarter and support questions dropped. Mine is at", link: "example.org/changelog" },
  { id: "c2", name: "Lee Example", date: "14 Oct 2026", text: "Do you split fixes by area, or keep them in one list?", link: "" },
];
export const SPAM = { id: "c3", name: "Best Deals", date: "14 Oct 2026", text: "Cheap watches, click to buy now:", link: "deals.example.net" };
