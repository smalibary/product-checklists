// Motion helpers. The numbers live in motion.css (tokens); script reads them from there.

export function isCalm(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.calm === "true"
  );
}

// A duration token in milliseconds, for example motionMs("--dur-base").
export function motionMs(token: string, fallback = 200): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}
