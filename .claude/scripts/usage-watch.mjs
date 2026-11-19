#!/usr/bin/env node
// Usage watch (rule L-7 in .claude/rules/service-limits.md): for each service in .claude/docs/services.json,
// runs its probe (a command that prints how much is used so far), compares it with how much of the period has
// gone, appends a row to the "Usage checks" table in .claude/docs/services.md, and warns Salem at 50% / 80%
// (only when ahead of pace) and at 100%, once per level per period. Warnings go to his phone through ntfy when
// the key NTFY_TOPIC is set (environment or .env.local), else they are printed for the session.
//   node .claude/scripts/usage-watch.mjs            check now (before a heavy run)
//   node .claude/scripts/usage-watch.mjs --if-due   at most once a day (the SessionStart hook uses this)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const cfgPath = path.join(root, '.claude/docs/services.json');
const mdPath = path.join(root, '.claude/docs/services.md');
const statePath = path.join(root, '.claude/state/usage-watch.json');
const ifDue = process.argv.includes('--if-due');

if (!fs.existsSync(cfgPath)) process.exit(0); // project has no metered services listed yet
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
let state = {};
try { state = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch {}

const now = new Date();
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = ymd(now); // Salem's local date, not world time
if (ifDue && state.lastRun === today) process.exit(0);

function readKey(name) {
  if (process.env[name]) return process.env[name];
  for (const f of ['.env.local', '.env']) {
    try {
      const m = fs.readFileSync(path.join(root, f), 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return '';
}

// Where we are in the current period (monthly from resetDay, or daily).
function periodInfo(s) {
  if (s.period === 'daily') {
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    return { key: today, frac: (now - start) / 86400000 };
  }
  const day = s.resetDay || 1;
  let start = new Date(now.getFullYear(), now.getMonth(), day);
  if (start > now) start = new Date(now.getFullYear(), now.getMonth() - 1, day);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, day);
  return { key: ymd(start), frac: (now - start) / (end - start) };
}

const pct = (x) => `${Math.round(x * 100)}%`;
const rows = [], warnings = [], notes = [], aheadNow = [];
state.alerts = state.alerts || {};

for (const s of cfg.services || []) {
  if (s.noLimit) { notes.push(`${s.name}: no limit (Salem said so)`); continue; }
  if (!s.probe) { notes.push(`${s.name}: no probe, check its dashboard by hand`); continue; }
  let used;
  try {
    const out = execSync(s.probe, { cwd: root, timeout: 20000, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    used = Number((out.match(/-?\d+(\.\d+)?/) || [])[0]);
  } catch { used = NaN; }
  if (!Number.isFinite(used)) { notes.push(`${s.name}: probe failed, check by hand`); continue; }

  const { key, frac } = periodInfo(s);
  const share = used / s.limit;
  const ahead = share > frac;
  let level = 0;
  if (share >= 1) level = 100; else if (share >= 0.8 && ahead) level = 80; else if (share >= 0.5 && ahead) level = 50;
  if (ahead) aheadNow.push(`${s.name} ${pct(share)} used, ${pct(frac)} of period gone`);
  const status = share >= 1 ? 'OVER LIMIT' : ahead ? 'ahead of pace' : 'on pace';
  rows.push(`| ${today} | ${s.name} | ${used} ${s.unit || ''} | ${pct(share)} | ${pct(frac)} | ${ahead ? 'yes' : 'no'} | ${status} |`);

  const aKey = `${s.name}|${key}`;
  if (level && (state.alerts[aKey] || 0) < level) {
    warnings.push(`${s.name}: ${pct(share)} of the ${s.period || 'monthly'} limit used with ${pct(frac)} of the period gone (${status}).`);
    state.alerts[aKey] = level;
  }
}

if (rows.length && fs.existsSync(mdPath)) fs.appendFileSync(mdPath, rows.join('\n') + '\n');

const topic = readKey('NTFY_TOPIC');
for (const w of warnings) {
  if (!topic) continue;
  try {
    await fetch(`${readKey('NTFY_URL') || 'https://ntfy.sh'}/${encodeURIComponent(topic)}`, {
      method: 'POST', body: w, headers: { Title: `Usage warning: ${path.basename(root)}`, Priority: 'high' },
    });
  } catch { notes.push('phone alert could not be sent'); }
}

state.lastRun = today;
fs.mkdirSync(path.dirname(statePath), { recursive: true });
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

const lines = [];
if (warnings.length) lines.push('USAGE WARNING (tell Salem first, find the cause, rule L-7):', ...warnings.map((w) => '- ' + w));
if (rows.length && !warnings.length) lines.push(aheadNow.length
  ? `Usage watch: ahead of pace (already reported): ${aheadNow.join('; ')}.`
  : `Usage watch: ${rows.length} service(s) checked, all on pace.`);
if (notes.length) lines.push(...notes.map((n) => 'Usage watch: ' + n));
if (lines.length) console.log(lines.join('\n'));
