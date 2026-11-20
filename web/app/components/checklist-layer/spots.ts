const BOX_PAD = 8;
const BADGE_H = 22;

export type Spot = {
  key: string;
  nums: number[];
  unmet: boolean;
  box: { left: number; top: number; width: number; height: number };
  badge: { left: number; top: number; width: number; label: string };
};

type BadgeRect = { left: number; top: number; width: number };

function overlaps(a: BadgeRect, b: BadgeRect) {
  return (
    a.left < b.left + b.width + 2 &&
    b.left < a.left + a.width + 2 &&
    a.top < b.top + BADGE_H + 2 &&
    b.top < a.top + BADGE_H + 2
  );
}

// Measures every [data-item] element relative to the stage. Reads only; never touches the page.
export function measureSpots(
  stage: HTMLElement,
  site: HTMLElement,
  shown: Set<number>,
  unmet: Set<number>,
): Spot[] {
  const sr = stage.getBoundingClientRect();
  const spots: Spot[] = [];
  site.querySelectorAll<HTMLElement>("[data-item]").forEach((el) => {
    const nums = (el.dataset.item ?? "")
      .split(/\s+/)
      .map(Number)
      .filter((n) => shown.has(n));
    if (nums.length === 0) return;
    const r = el.getBoundingClientRect();
    // A removed part leaves a zero-height marker: draw it as a thin line, not a padded box.
    const flat = r.height < 1;
    const pad = flat ? 0 : BOX_PAD;
    const left = Math.max(2, r.left - sr.left - BOX_PAD);
    const top = Math.max(2, r.top - sr.top - pad);
    const right = Math.min(sr.width - 2, r.right - sr.left + BOX_PAD);
    const label = nums.join(" · ");
    const width = Math.max(BADGE_H, Math.ceil(14 + label.length * 7.2));
    spots.push({
      key: nums.join("-"),
      nums,
      unmet: nums.some((n) => unmet.has(n)),
      box: {
        left,
        top,
        width: right - left,
        height: r.bottom - sr.top + pad - top,
      },
      badge: {
        left: Math.max(2, Math.min(right + 6, sr.width - 4) - width),
        top: Math.max(2, top - (flat ? 11 : 7)),
        width,
        label,
      },
    });
  });
  spots.sort((a, b) => a.badge.top - b.badge.top || a.badge.left - b.badge.left);
  fanOutLines(spots);
  spots.forEach((s, i) => {
    for (let tries = 0; tries < 12; tries++) {
      const hit = spots.slice(0, i).find((p) => overlaps(s.badge, p.badge));
      if (!hit) break;
      const left = hit.badge.left - s.badge.width - 2;
      if (left >= 2) s.badge.left = left;
      else s.badge.top = hit.badge.top + BADGE_H + 2;
    }
  });
  return spots;
}

const LINE_STEP = 9;

// Several removed parts can sit at one spot, so their lines would lie on top of each other.
// Fan each such group out around the spot, a few pixels apart, badge and all.
function fanOutLines(spots: Spot[]) {
  const lines = spots.filter((s) => s.box.height < 1);
  let group: Spot[] = [];
  const flush = () => {
    group.forEach((s, k) => {
      const shift = (k - (group.length - 1) / 2) * LINE_STEP;
      s.box.top += shift;
      s.badge.top += shift;
    });
    group = [];
  };
  lines.forEach((s) => {
    if (group.length && Math.abs(s.box.top - group[0].box.top) > 3) flush();
    group.push(s);
  });
  flush();
}
