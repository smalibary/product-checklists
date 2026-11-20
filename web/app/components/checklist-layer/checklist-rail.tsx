"use client";

import { Button } from "@ui-sdk/react/button";
import type { ChecklistData } from "./types";

function CheckIcon() {
  return (
    <svg className="cl-check" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
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
  onReveal: (n: number) => void;
  onActive: (n: number | null) => void;
};

export function ChecklistRail({ data, onReveal, onActive }: Props) {
  return (
    <aside className="cl-rail" aria-label={data.title}>
      <h2 className="cl-rail-title">{data.title}</h2>
      <p className="cl-rail-note">{data.note}</p>
      {data.groups.map((group) => (
        <section key={group.title} className="cl-group">
          <h3>{group.title}</h3>
          <ol>
            {group.items.map((item) => {
              const body = (
                <>
                  <span className="cl-n" data-shown={item.shown}>
                    {item.n}
                  </span>
                  <span className="cl-text">
                    {item.text}
                    <span className="cl-where">
                      {item.met && <CheckIcon />}
                      {item.where}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={item.n}>
                  {item.shown ? (
                    <Button
                      type="button"
                      className="cl-item"
                      onClick={() => onReveal(item.n)}
                      onMouseEnter={() => onActive(item.n)}
                      onMouseLeave={() => onActive(null)}
                      onFocus={() => onActive(item.n)}
                      onBlur={() => onActive(null)}
                    >
                      {body}
                    </Button>
                  ) : (
                    <div className="cl-item" data-off="true">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </aside>
  );
}
