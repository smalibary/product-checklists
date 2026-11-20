// Made-up project: a small library called widget. Generic on purpose.

export const COMMANDS = `npm install widget
npm run dev
npm test`;

export const SETTINGS = [
  { name: "WIDGET_API_URL", meaning: "Where requests are sent", fallback: "https://api.example.com", required: false },
  { name: "WIDGET_TOKEN", meaning: "Your access token. Never commit it", fallback: "none", required: true },
  { name: "WIDGET_TIMEOUT_MS", meaning: "How long to wait for a reply", fallback: "5000", required: false },
  { name: "WIDGET_LOG_LEVEL", meaning: "How much is written to the log", fallback: "info", required: false },
];

export const KINDS = [
  { title: "Tutorials", note: "Learn by doing", pages: ["Your first widget"] },
  { title: "How-to guides", note: "Solve one problem", pages: ["Retry a failed request", "Run behind a proxy"] },
  { title: "Reference", note: "Look something up", pages: ["Settings", "Functions"] },
  { title: "Explanations", note: "Understand why", pages: ["How retries work"] },
];

export const DECISIONS = [
  { title: "Use plain functions, not classes", status: "Accepted", date: "2026-03-12", why: "Plain functions are easier to test and to combine. Classes added state nobody needed." },
  { title: "Retry only safe requests", status: "Accepted", date: "2026-05-02", why: "Repeating a request that changes data can charge or send twice. Reads are safe to repeat." },
  { title: "Drop support for version 1", status: "Replaced", date: "2026-08-19", why: "Replaced by the decision to keep version 1 fixes for six more months." },
];

export const GOOD_CODE = `// Wait before each retry, longer every time, so a struggling
// server is not hit again straight away.
const wait = base * 2 ** attempt;`;

export const WEAK_CODE = `// multiply base by 2 to the power attempt
const wait = base * 2 ** attempt;`;

export const COMMITS = {
  good: [
    { id: "a1b2c3d", text: "Retry reads only", files: ["src/retry.ts", "docs/retry.md"] },
    { id: "e4f5a6b", text: "Add a timeout setting", files: ["src/config.ts", "README.md"] },
  ],
  broken: [
    { id: "a1b2c3d", text: "Retry reads only", files: ["src/retry.ts"] },
    { id: "e4f5a6b", text: "Add a timeout setting", files: ["src/config.ts"] },
    { id: "9c8d7e6", text: "Update docs (three weeks later)", files: ["docs/retry.md"] },
  ],
};
