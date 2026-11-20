// Made-up numbers for the dashboard example. Everything here is invented filler.

export type Range = "today" | "7d" | "30d";
export type Env = "prod" | "staging";

export const RANGES: { v: Range; label: string }[] = [
  { v: "today", label: "Today" },
  { v: "7d", label: "7 days" },
  { v: "30d", label: "30 days" },
];
export const ENVS: { value: Env; label: string }[] = [
  { value: "prod", label: "Production" },
  { value: "staging", label: "Staging" },
];

export const PERIOD: Record<Range, string> = { today: "today", "7d": "last 7 days", "30d": "last 30 days" };
export const PREVIOUS: Record<Range, string> = {
  today: "yesterday",
  "7d": "previous 7 days",
  "30d": "previous 30 days",
};

const ENV_FACTOR: Record<Env, number> = { prod: 1, staging: 0.12 };
const RANGE_FACTOR: Record<Range, number> = { today: 0.16, "7d": 1, "30d": 4.3 };

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const wobble = (tick: number, amp: number) => Math.round(Math.sin(tick * 1.7 + amp) * amp);

// Time of the first reading; each refresh adds 5 seconds. A fixed time keeps the page the same
// on the server and in the browser.
export function updatedAt(tick: number) {
  const s = 9 * 3600 + 42 * 60 + tick * 5;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600) % 24)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}

export type Kpi = {
  id: string;
  label: string;
  value: string;
  dir: "up" | "down";
  amount: string;
  good: boolean;
};

export function kpis(range: Range, env: Env, tick: number): Kpi[] {
  const per = ENV_FACTOR[env];
  const req = ({ today: 1310, "7d": 1240, "30d": 1180 }[range] ?? 1240) * per + wobble(tick, 17 * per);
  const err = ({ today: 0.51, "7d": 0.42, "30d": 0.38 }[range] ?? 0.42) + wobble(tick, 2) / 100;
  const ms = ({ today: 190, "7d": 182, "30d": 176 }[range] ?? 182) + wobble(tick, 3);
  return [
    { id: "req", label: "Requests per minute", value: fmt(req), dir: "up", amount: "8%", good: true },
    { id: "err", label: "Error rate", value: `${err.toFixed(2)}%`, dir: "down", amount: "0.1 pts", good: true },
    { id: "ms", label: "Median response time", value: `${ms} ms`, dir: "up", amount: "12 ms", good: false },
  ];
}

export type Series = { labels: string[]; values: number[]; unit: string };

const TREND: Record<Range, { labels: string[]; values: number[]; unit: string }> = {
  today: {
    labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    values: [620, 540, 480, 910, 1320, 1480, 1390, 1010],
    unit: "per 3 hours",
  },
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [1180, 1240, 1210, 1420, 1330, 980, 870],
    unit: "per day",
  },
  "30d": {
    labels: ["Day 3", "Day 6", "Day 9", "Day 12", "Day 15", "Day 18", "Day 21", "Day 24", "Day 27", "Day 30"],
    values: [1010, 1090, 1180, 1150, 1260, 1240, 1310, 1220, 1380, 1420],
    unit: "per 3 days",
  },
};

export function trend(range: Range, env: Env): Series {
  const t = TREND[range];
  return { labels: t.labels, unit: t.unit, values: t.values.map((v) => Math.round(v * ENV_FACTOR[env])) };
}

const SERVICES = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet"];
const SERVICE_BASE = [4210, 3180, 2260, 1540, 870];

export function services(range: Range, env: Env): Series {
  const f = RANGE_FACTOR[range] * ENV_FACTOR[env];
  return { labels: SERVICES, unit: "requests", values: SERVICE_BASE.map((v) => Math.round(v * f)) };
}

export function summary(s: Series, noun: string, what: string) {
  const max = Math.max(...s.values);
  const top = s.labels[s.values.indexOf(max)];
  return `${what}: highest is ${top} with ${fmt(max)} ${noun}; lowest is ${fmt(Math.min(...s.values))}.`;
}

export const ATTENTION = [
  { id: "a1", icon: "warning", state: "Failing", text: "Checkout errors are above the limit", since: "since 09:12" },
  { id: "a2", icon: "clock", state: "Waiting", text: "Payment queue has waited 14 minutes", since: "since 09:28" },
  { id: "a3", icon: "list", state: "Overdue", text: "2 reports are overdue", since: "due yesterday" },
] as const;
