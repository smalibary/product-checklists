"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type Section = "attention" | "kpis" | "trend" | "bars";
export const SECTIONS: { id: Section; label: string }[] = [
  { id: "attention", label: "Needs attention" },
  { id: "kpis", label: "Key numbers" },
  { id: "trend", label: "Requests over time" },
  { id: "bars", label: "Requests by service" },
];
export type Layout = { order: Section[]; hidden: Section[] };

const KEY = "dashboard-example-layout";
const DEFAULT: Layout = { order: SECTIONS.map((s) => s.id), hidden: [] };
const listeners = new Set<() => void>();
let memory = "";

// The choice is kept in this browser (the browser's storage may be blocked, so it falls back to memory).
function read() {
  try {
    return window.localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}
function subscribe(f: () => void) {
  listeners.add(f);
  return () => void listeners.delete(f);
}

function parse(raw: string): Layout {
  try {
    const v = JSON.parse(raw) as Layout;
    const ids = SECTIONS.map((s) => s.id);
    const order = v.order.filter((x) => ids.includes(x));
    const full = [...order, ...ids.filter((x) => !order.includes(x))];
    return { order: full, hidden: v.hidden.filter((x) => ids.includes(x)) };
  } catch {
    return DEFAULT;
  }
}

export function useLayout() {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  const layout = useMemo(() => (raw ? parse(raw) : DEFAULT), [raw]);
  const save = useCallback((next: Layout) => {
    memory = JSON.stringify(next);
    try {
      window.localStorage.setItem(KEY, memory);
    } catch {}
    listeners.forEach((f) => f());
  }, []);
  return { layout, save };
}
