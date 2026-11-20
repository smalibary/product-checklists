"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "./kit/footer";
import { SiteHeader, type NavLink } from "./kit/header";

// The path Next does not add by itself to plain links (set in next.config.ts; empty locally).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const LINKS: NavLink[] = [
  { label: "Examples", href: `${BASE}/#examples` },
  { label: "Shared parts", href: `${BASE}/#parts` },
  { label: "Checklists", href: `${BASE}/checklists/` },
  { label: "GitHub", href: "https://github.com/smalibary/product-checklists", outside: true },
];

type Edges = { start: string; end: string };

// Before the page is measured: the home column (44rem, 16px padding) or the example column
// (78rem, 24px padding), both centred. Close enough that only narrow examples move afterwards.
function guess(home: boolean): Edges {
  const edge = home ? "max(12px, calc((100% - 44rem) / 2 + 16px))" : "max(12px, calc((100% - 78rem) / 2 + 24px))";
  return { start: edge, end: edge };
}

// The page's own content box (its first block, minus padding), so the header and footer content
// line up with it on every page, whatever width that page settled on.
function measure(): Edges | null {
  const el = document.querySelector("#site-main > :not(script):not(style)");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const start = r.left + parseFloat(cs.paddingLeft);
  const end = document.documentElement.clientWidth - r.right + parseFloat(cs.paddingRight);
  return { start: `${Math.max(12, Math.round(start))}px`, end: `${Math.max(12, Math.round(end))}px` };
}

// This site's own header and footer, around every page. The made-up Lorem ones inside each
// example frame are separate: they are the thing being shown, not the site.
export function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "/";
  const current = path.startsWith("/examples") ? "Examples" : path.startsWith("/parts") ? "Shared parts" : undefined;
  const [edges, setEdges] = useState<Edges | null>(null);

  useEffect(() => {
    const update = () => {
      const m = measure();
      if (m) setEdges((o) => (o && o.start === m.start && o.end === m.end ? o : m));
    };
    update();
    const el = document.querySelector("#site-main > :not(script):not(style)");
    const ro = new ResizeObserver(update);
    if (el) ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [path]);

  const use = edges ?? guess(path === "/");
  return (
    <>
      <SiteHeader variant="product" brand={{ name: "Product Checklists", href: `${BASE}/` }} links={LINKS} current={current} skipTarget="#site-main" edges={use} />
      <div id="site-main" tabIndex={-1} className="site-main">
        {children}
      </div>
      <SiteFooter
        variant="product"
        edges={use}
        about={{
          line: "Product Checklists: small pages, each built to one sourced checklist, with a layer that shows which part meets which item.",
          links: LINKS,
          note: "Built to its own checklists.",
        }}
      />
    </>
  );
}
