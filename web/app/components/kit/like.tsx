"use client";

import { useState } from "react";
import { Heart } from "@phosphor-icons/react/dist/ssr";

// The one like (favourite) button of the site: press it and the heart fills red and grows a
// little with the quick motion token; the count goes up by one; press again to take it back.
// "pop={false}" is the broken version, for the checklist pages only: it keeps its state for
// screen readers but looks the same either way. "force" holds a look still for the Shared parts page.
export function LikeButton({
  label = "favourites",
  count,
  defaultOn = false,
  pop = true,
  force,
}: {
  // What is being liked, used in the button's name ("Add to favourites").
  label?: string;
  // A starting count shown beside the heart. Leave out for a heart alone.
  count?: number;
  defaultOn?: boolean;
  pop?: boolean;
  force?: "on" | "focus";
}) {
  const [on, setOn] = useState(defaultOn);
  const shown = on || force === "on";
  const total = count === undefined ? undefined : count + (shown ? 1 : 0) - (defaultOn ? 1 : 0);
  return (
    <button
      type="button"
      className="kit-like"
      data-on={shown}
      data-pop={pop}
      data-force={force === "focus" ? "focus" : undefined}
      aria-pressed={shown}
      aria-label={shown ? `Remove from ${label}` : `Add to ${label}`}
      onClick={() => setOn(!on)}
    >
      <Heart size={22} weight={shown && pop ? "fill" : "regular"} aria-hidden="true" />
      {total !== undefined && <span className="kit-like-count">{total}</span>}
    </button>
  );
}
