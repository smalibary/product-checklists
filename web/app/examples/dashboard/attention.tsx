"use client";

import { Clock, ListChecks, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Link } from "../../components/kit/link";
import { Card, Foot } from "./card";
import { ATTENTION } from "./data";

const ICONS = { warning: WarningCircle, clock: Clock, list: ListChecks };

// Item 3: what needs a person now, in words as well as icons, each row a link to its detail.
export function Attention() {
  return (
    <Card title="Needs attention" className="db-attn">
      <ul className="db-attn-list">
        {ATTENTION.map((a) => {
          const Icon = ICONS[a.icon];
          return (
            <li key={a.id}>
              <Icon size={18} aria-hidden="true" />
              <Link className="db-attn-text" href="#details" onClick={(e) => e.preventDefault()}>
                {a.text}
              </Link>
              <span className="db-attn-state">{a.state}</span>
              <span className="db-attn-since">{a.since}</span>
            </li>
          );
        })}
      </ul>
      <Foot label="View all" />
    </Card>
  );
}
