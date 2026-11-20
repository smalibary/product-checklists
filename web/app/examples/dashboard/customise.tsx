"use client";

import { ArrowDown, ArrowUp, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { Button } from "../../components/kit/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";
import { SECTIONS, type Layout, type Section } from "./use-layout";

type Props = { layout: Layout; onChange: (l: Layout) => void };

// Item 13: choose, hide and reorder the cards; the choice is remembered (use-layout.ts).
export function Customise({ layout, onChange }: Props) {
  const label = (id: Section) => SECTIONS.find((s) => s.id === id)?.label ?? id;
  const move = (i: number, by: number) => {
    const order = [...layout.order];
    [order[i], order[i + by]] = [order[i + by], order[i]];
    onChange({ ...layout, order });
  };
  const toggle = (id: Section) =>
    onChange({
      ...layout,
      hidden: layout.hidden.includes(id) ? layout.hidden.filter((x) => x !== id) : [...layout.hidden, id],
    });
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button icon={<SlidersHorizontal size={16} aria-hidden="true" />}>
            Customise
          </Button>
        }
      />
      <PopoverContent className="db-pop">
        <PopoverTitle>Customise cards</PopoverTitle>
        <PopoverDescription>Show, hide and move cards. Remembered on this device.</PopoverDescription>
        <ul className="db-pop-list">
          {layout.order.map((id, i) => (
            <li key={id}>
              <label data-slot="label">
                <Checkbox checked={!layout.hidden.includes(id)} onCheckedChange={() => toggle(id)}>
                  <CheckboxIndicator />
                </Checkbox>
                {label(id)}
              </label>
              <span className="db-pop-move">
                <Button
                  kind="quiet"
                  size="sm"
                  label={`Move ${label(id)} up`}
                  icon={<ArrowUp size={16} aria-hidden="true" />}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                />
                <Button
                  kind="quiet"
                  size="sm"
                  label={`Move ${label(id)} down`}
                  icon={<ArrowDown size={16} aria-hidden="true" />}
                  disabled={i === layout.order.length - 1}
                  onClick={() => move(i, 1)}
                />
              </span>
            </li>
          ))}
        </ul>
        <PopoverClose render={<Button kind="primary">Done</Button>} />
      </PopoverContent>
    </Popover>
  );
}
