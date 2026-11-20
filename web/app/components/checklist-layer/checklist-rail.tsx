"use client";

import { Button } from "@ui-sdk/react/button";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { RailScore } from "./rail-score";
import type { ChecklistData, ChecklistItem } from "./types";
import "./checklist-rail.css";

function Mark({ met }: { met: boolean }) {
  return (
    <svg className="cl-check" data-met={met} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={met ? "m3.5 8.5 3 3 6-7" : "m4.5 4.5 7 7m0-7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  data: ChecklistData;
  unmet: Set<number>;
  onReveal: (n: number) => void;
  onActive: (n: number | null) => void;
  onToggle: (n: number, met: boolean) => void;
  onReset: () => void;
};

function Row({ item, met, ...rest }: { item: ChecklistItem; met: boolean } & Pick<Props, "onReveal" | "onToggle">) {
  const body = (
    <>
      <span className="cl-n" data-shown={item.shown} data-met={met}>
        {item.n}
      </span>
      <span className="cl-text">
        {item.text}
        <span className="cl-where" data-met={met}>
          <Mark met={met} />
          {met || !item.broken ? item.where : `Visitors would see: ${item.broken}`}
        </span>
      </span>
    </>
  );
  return (
    <>
      <Checkbox
        className="cl-tick"
        checked={met}
        onCheckedChange={(next) => rest.onToggle(item.n, next === true)}
        aria-label={`Item ${item.n} met: ${item.text}`}
      >
        <CheckboxIndicator />
      </Checkbox>
      {item.shown ? (
        <Button type="button" className="cl-item" onClick={() => rest.onReveal(item.n)}>
          {body}
        </Button>
      ) : (
        <div className="cl-item" data-off="true">
          {body}
        </div>
      )}
    </>
  );
}

export function ChecklistRail({ data, unmet, onReveal, onActive, onToggle, onReset }: Props) {
  const total = data.groups.reduce((sum, g) => sum + g.items.length, 0);
  return (
    <aside className="cl-rail" aria-label={data.title}>
      <RailScore met={total - unmet.size} total={total} onReset={onReset} />
      <h2 className="cl-rail-title">{data.title}</h2>
      <p className="cl-rail-note">{data.note}</p>
      {data.groups.map((group) => (
        <section key={group.title} className="cl-group">
          <h3>{group.title}</h3>
          <ol>
            {group.items.map((item) => (
              <li
                key={item.n}
                className="cl-row"
                data-met={!unmet.has(item.n)}
                onMouseEnter={() => item.shown && onActive(item.n)}
                onMouseLeave={() => onActive(null)}
                onFocus={() => item.shown && onActive(item.n)}
                onBlur={() => onActive(null)}
              >
                <Row item={item} met={!unmet.has(item.n)} onReveal={onReveal} onToggle={onToggle} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </aside>
  );
}
