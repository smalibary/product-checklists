"use client";

import { Button } from "@ui-sdk/react/button";
import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Fit } from "./fit";
import { RailScore } from "./rail-score";
import type { ChecklistData, ChecklistItem } from "./types";
import "./checklist-rail.css";

function Mark({ met }: { met: boolean }) {
  const Icon = met ? Check : X;
  return <Icon className="cl-check" data-met={met} size={14} aria-hidden="true" />;
}

type Props = {
  data: ChecklistData;
  step: number;
  unmet: Set<number>;
  onReveal: (n: number) => void;
  onActive: (n: number | null) => void;
  onToggle: (n: number, met: boolean) => void;
  onReset: () => void;
};

function Row({ item, met, step, ...rest }: { item: ChecklistItem; met: boolean } & Pick<Props, "step" | "onReveal" | "onToggle">) {
  const body = (
    <>
      <span className="cl-n" data-shown={item.shown} data-met={met}>
        {item.n}
      </span>
      <span className="cl-text">
        {item.text}
        {item.shown && item.step && item.step !== step && (
          <span className="cl-step-tag">Step {item.step}</span>
        )}
        <Fit tag="span" className="cl-where-fit">
          {met || !item.broken ? (
            <span className="cl-where" data-met={met}>
              <Mark met={met} />
              {item.where}
            </span>
          ) : (
            <span className="cl-where" data-met="false">
              <Mark met={false} />
              Visitors would see: {item.broken}
            </span>
          )}
        </Fit>
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

export function ChecklistRail({ data, step, unmet, onReveal, onActive, onToggle, onReset }: Props) {
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
                <Row item={item} met={!unmet.has(item.n)} step={step} onReveal={onReveal} onToggle={onToggle} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </aside>
  );
}
