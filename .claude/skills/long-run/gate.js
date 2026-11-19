// Long-run stop check. Prints CONTINUE, or STOP: <reason in plain words>. Run before every task of a long run.
//   node .claude/skills/long-run/gate.js
// Reads .claude/state/long-run.json (written when the run starts):
//   { startedAt, stopAt (ISO time or null), weekStopAt (weekly usage % to stop at, or null), stopped? }
// and ~/.claude/week-usage.json, which Salem's status line rewrites every few seconds with the weekly usage %.
const fs = require('fs'), path = require('path'), os = require('os');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const stateFile = path.join(root, '.claude', 'state', 'long-run.json');
const usageFile = path.join(os.homedir(), '.claude', 'week-usage.json');
const say = s => { console.log(s); process.exit(0); };

if (!fs.existsSync(stateFile)) say('STOP: no long run is set up (no limit was given).');
const run = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
if (run.stopped) say('STOP: the run was already stopped (' + run.stopped + ').');
if (!run.stopAt && run.weekStopAt == null) say('STOP: the run has no limit; ask Salem for one.');

const now = Date.now();
if (run.stopAt && now >= Date.parse(run.stopAt)) say('STOP: the time limit was reached (' + run.stopAt + ').');

if (run.weekStopAt != null) {
  let usage = null;
  try { usage = JSON.parse(fs.readFileSync(usageFile, 'utf8')); } catch {}
  const ageMin = usage ? (now - Date.parse(usage.at)) / 60000 : Infinity;
  // A stale figure means the status line has not redrawn lately; with no time limit as backup, stopping is safer.
  if (ageMin > 30 && !run.stopAt) say('STOP: the weekly usage figure is ' + Math.round(ageMin) + ' minutes old and there is no time limit to fall back on.');
  if (usage && ageMin <= 30 && usage.sevenDay >= run.weekStopAt) say('STOP: weekly usage reached ' + usage.sevenDay + '% (limit ' + run.weekStopAt + '%).');
}
say('CONTINUE');
