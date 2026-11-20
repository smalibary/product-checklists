"use client";

import { Swap } from "../../components/checklist-layer/swap";
import { Link } from "../../components/kit/link";

const bare = (t: string, k: string) => (
  <a className="nv nv-link" href="#x" {...{ [`data-${k}`]: "" }}>
    {t}
  </a>
);

// The kit link, one demo per checklist item.
export function LinkDemo() {
  return (
    <div className="pt">
      <div className="pt-grid">
        <div className="pt-card">
          <p className="pt-cap">Looks like a link</p>
          <Swap
            item={1}
            good={
              <p className="pt-note">
                Compare plans on the <Link href="#plans">plans page</Link> before you decide.
              </p>
            }
            broken={
              <p className="pt-note">
                Compare plans on the {bare("plans page", "bare")} before you decide.
              </p>
            }
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Visited</p>
          <Swap
            item={2}
            good={
              <p className="pt-note">
                <Link href="#a">Not visited yet</Link> and <Link href="#b" data-force="visited">visited before</Link>
              </p>
            }
            broken={
              <p className="pt-note">
                {bare("Not visited yet", "")} and {bare("visited before", "")}
              </p>
            }
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Focus</p>
          <Swap
            item={3}
            good={<Link href="#focus" data-force="focus">Focused link</Link>}
            broken={<span className="nv nv-link">Focused link</span>}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Words</p>
          <Swap item={4} good={<Link href="#pricing">Read the pricing guide</Link>} broken={<Link href="#pricing">click here</Link>} />
          <Swap
            item={5}
            good={<Link href="#report" file={{ type: "PDF", size: "2.4 MB" }}>Annual report</Link>}
            broken={<Link href="#report">Annual report</Link>}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">New tab</p>
          <Swap
            item={6}
            good={<Link href="https://example.com" external>Example site</Link>}
            broken={
              <a className="kit-link" href="https://example.com" target="_blank" rel="noopener noreferrer">
                Example site
              </a>
            }
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Contrast</p>
          <Swap
            item={8}
            good={<Link href="#contrast">A link with strong contrast</Link>}
            broken={bare("A link with weak contrast", "faint")}
          />
        </div>
        <div className="pt-card">
          <p className="pt-cap">Tap size, in a list</p>
          <Swap
            item={9}
            good={
              <ul className="pt-list">
                <li><Link href="#one" standalone>First stand-alone link</Link></li>
                <li><Link href="#two" standalone>Second stand-alone link</Link></li>
              </ul>
            }
            broken={
              <ul className="pt-list">
                <li>{bare("First stand-alone link", "tiny")}</li>
                <li>{bare("Second stand-alone link", "tiny")}</li>
              </ul>
            }
          />
        </div>
      </div>
    </div>
  );
}
