import { MAX_QUERY, type Rec, type RecordType } from "./data";

// Which checklist items are met. Each one switches one behaviour of the search below.
export type Flags = {
  index: boolean; // 1: a full-text index, not a scan of every record
  arabic: boolean; // 2: letter forms and marks are made equal before comparing
  typos: boolean; // 4
  rank: boolean; // 5
  filterIndex: boolean; // 6
  authz: boolean; // 8
  limit: boolean; // 9
  param: boolean; // 10
};

export type Outcome = {
  hits: { rec: Rec; score: number }[];
  tokens: string[];
  used: string;
  corrected: string | null;
  shortened: boolean;
  error: string | null;
  ms: number;
};

const MARKS = /[ً-ٰٟـ]/g;
const SPLIT = /[^\p{L}\p{N}]+/u;

// Makes two spellings of the same word equal: lower case, no accents, no Arabic marks, one form
// of alef, ya and ta marbuta.
export function normalise(s: string, full: boolean): string {
  const t = s.toLowerCase();
  if (!full) return t;
  return t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(MARKS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}

export function search(raw: string, type: "all" | RecordType, f: Flags, records: Rec[]): Outcome {
  const used = f.limit ? raw.slice(0, MAX_QUERY) : raw;
  const shortened = f.limit && raw.length > MAX_QUERY;
  // Milliseconds: the index is a few; a scan of every record is seconds, an unindexed filter adds
  // to either, and a long query without a limit adds more.
  const extra = (type !== "all" && !f.filterIndex ? 900 : 0) + (f.limit ? 0 : Math.max(0, raw.length - MAX_QUERY) * 30);
  const slow = (f.index ? 6 : 1840) + extra;
  const base = { hits: [], tokens: [], used, corrected: null, shortened };
  if (!f.param && /['";]|--/.test(used)) {
    return { ...base, error: `syntax error at or near "${used.slice(0, 10)}"`, ms: slow };
  }

  const words = (s: string) => normalise(s, f.arabic).split(SPLIT).filter(Boolean);
  const pool = records.filter((r) => (f.authz ? !r.private : true));
  const vocab = new Set(pool.flatMap((r) => words(`${r.title} ${r.body}`)));
  let tokens = words(used);
  let corrected: string | null = null;

  if (f.typos) {
    const fixed = tokens.map((t) => {
      if ([...vocab].some((w) => w.startsWith(t))) return t;
      const room = t.length > 5 ? 2 : 1;
      let best: string | null = null;
      let bestD = room + 1;
      for (const w of vocab) {
        const d = distance(t, w.slice(0, t.length + 1));
        if (t.length >= 4 && d < bestD) {
          best = w;
          bestD = d;
        }
      }
      return best ?? t;
    });
    if (fixed.join(" ") !== tokens.join(" ")) {
      corrected = fixed.join(" ");
      tokens = fixed;
    }
  }

  const hits = pool
    .filter((r) => type === "all" || r.type === type)
    .map((rec) => {
      const t = words(rec.title);
      const b = words(rec.body);
      let score = 0;
      for (const k of tokens) {
        const inTitle = t.some((w) => w.startsWith(k));
        const inBody = b.some((w) => w.startsWith(k));
        if (!inTitle && !inBody) return { rec, score: 0 };
        score += (inTitle ? 3 : 0) + (inBody ? 1 : 0);
      }
      return { rec, score: tokens.length ? score : 0 };
    })
    .filter((h) => h.score > 0);

  hits.sort(f.rank ? (a, b) => b.score - a.score || b.rec.date.localeCompare(a.rec.date) : (a, b) => a.rec.id - b.rec.id);
  return { hits, tokens, used, corrected, shortened, error: null, ms: slow + hits.length * (f.index ? 2 : 40) };
}
