"use client";

import { Clock, ListChecks, WarningCircle } from "@phosphor-icons/react/dist/ssr";
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
              <a href="#details" onClick={(e) => e.preventDefault()}>
                <Icon size={18} aria-hidden="true" />
                <span className="db-attn-text">{a.text}</span>
                <span className="db-attn-state">{a.state}</span>
                <span className="db-attn-since">{a.since}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <Foot label="View all" />
    </Card>
  );
}
