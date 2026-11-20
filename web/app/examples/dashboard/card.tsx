"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "../../components/kit/link";
import { useMet } from "../../components/checklist-layer/met-context";
import { Collapse } from "../../components/checklist-layer/swap";

// One card style for everything on the page (item 11). Its title is a real heading (item 18).
export function Card({
  title,
  extra,
  className,
  children,
}: {
  title: string;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { isMet } = useMet();
  const Title = isMet(18) ? "h3" : "div";
  return (
    <article className={className ? `db-card ${className}` : "db-card"}>
      <header className="db-card-head">
        <Title className="db-title">{title}</Title>
        {extra}
      </header>
      {children}
    </article>
  );
}

// "View details" at the foot of a card (item 4). Only the first card carries the spot; every
// card folds its link away together when the item is unticked.
export function Foot({ lead, label = "View details" }: { lead?: boolean; label?: string }) {
  const { isMet } = useMet();
  return (
    <Collapse n={lead ? 4 : undefined} open={isMet(4)}>
      <Link className="db-detail" href="#details" onClick={(e) => e.preventDefault()}>
        {label}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </Collapse>
  );
}
