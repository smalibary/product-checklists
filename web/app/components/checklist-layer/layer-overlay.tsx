import type { Spot } from "./spots";

type Props = { spots: Spot[]; active: number | null };

// The dashed boxes and numbered badges drawn over the example's card.
export function LayerOverlay({ spots, active }: Props) {
  return (
    <div className="cl-overlay" aria-hidden="true">
      {spots.map((s) => {
        const state = active === null ? "idle" : s.nums.includes(active) ? "active" : "dim";
        return (
          <span key={s.key}>
            <span className="cl-box" data-state={state} data-unmet={s.unmet} style={s.box} />
            <span
              className="cl-badge"
              data-state={state}
              data-unmet={s.unmet}
              style={{ left: s.badge.left, top: s.badge.top, width: s.badge.width }}
            >
              {s.badge.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
