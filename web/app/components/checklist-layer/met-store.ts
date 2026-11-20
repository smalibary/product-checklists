// Remembers which checklist items are unticked, per example, in localStorage.
// The snapshot is a JSON string of the unticked numbers so React can compare it by value.
const EMPTY = "[]";
const CHANGE_EVENT = "checklist-layer:met-change";
const memory = new Map<string, string>();

const keyFor = (id: string) => `checklist-layer:unmet:${id}`;

export function readUnmetRaw(id: string): string {
  try {
    const v = localStorage.getItem(keyFor(id));
    if (v !== null) return v;
  } catch {}
  return memory.get(id) ?? EMPTY;
}

export function writeUnmet(id: string, unmet: number[]) {
  const raw = JSON.stringify([...unmet].sort((a, b) => a - b));
  memory.set(id, raw);
  try {
    localStorage.setItem(keyFor(id), raw);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function parseUnmet(raw: string): Set<number> {
  try {
    const list: unknown = JSON.parse(raw);
    if (Array.isArray(list)) return new Set(list.filter((n) => Number.isInteger(n)));
  } catch {}
  return new Set();
}

export function subscribeMet(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export const EMPTY_UNMET = EMPTY;
