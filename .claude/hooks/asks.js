// Salem's asks: every message he sends is written down as an ask, and Claude may not end a turn while one is still
// unsorted or an ongoing order is unfinished (Salem, 2026-11-14: "before you send me the ending msg you check all
// comments if they addressed or not"; he said "keep working on all screens", pointed at one issue, and Claude stopped
// after fixing it instead of going back to the screens, twice).
//   node asks.js prompt          UserPromptSubmit: record his message; remind Claude of every open ask.
//   node asks.js stop            Stop: also record messages he sent mid-turn (they skip UserPromptSubmit); block the
//                                stop while an ask is new, doing or standing.
//   node asks.js list            Show the open asks.
//   node asks.js set <ids> <status> "<note>"   ids like 4 or 4,5. Status: doing, standing, waiting, done, noted, dropped.
//   node asks.js parts <id> "A|B|C"   An ask about many things ("every screen", "all pages") gets its parts, listed from
//                                the project itself (files, the board), never from memory.
//   node asks.js tick <id> "A|B"      Parts finished. "done" is refused while a part is unticked, and for a many-things
//                                ask that has no parts (Salem, 2026-11-14: "polish every screen" was marked done after
//                                12 of 19 screens; the note said "every screen polished").
// Ledger: .claude/state/asks.json (open asks and the last 40 closed); older closed ones go to .claude/state/asks-archive/.
const fs = require('fs'), path = require('path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const stateDir = path.join(root, '.claude', 'state');
const file = path.join(stateDir, 'asks.json'), guardFile = path.join(stateDir, 'asks-stop.json');
const OPEN = ['new', 'doing', 'standing'], ALL = [...OPEN, 'waiting', 'done', 'noted', 'dropped'];
const KEEP_CLOSED = 40, MAX_CHARS = 600, MAX_BLOCKS = 40;

const MEANS = {
  new: 'not sorted yet', doing: 'being done now', standing: 'an ongoing order: fixing other things does not end it',
  waiting: 'needs Salem; a question is on the board', done: 'finished', noted: 'nothing to do', dropped: 'Salem cancelled or replaced it',
};

// Only what he typed. A slash command keeps its name and what he wrote after it.
function clean(text) {
  let t = String(text || '');
  const cmd = t.match(/<command-name>([^<]*)<\/command-name>/), args = t.match(/<command-args>([\s\S]*?)<\/command-args>/);
  if (cmd) t = cmd[1].trim() + (args && args[1].trim() ? ': ' + args[1].trim() : '');
  // A helper's report arrives in the user slot but is not Salem's message.
  t = t.replace(/<agent-message[^>]*>[\s\S]*?<\/agent-message>/g, '');
  t = t.replace(/<pasted_content[^>]*>[\s\S]*?<\/pasted_content[^>]*>/g, '[pasted text]');
  t = t.replace(/<(system-reminder|command-[a-z]+|local-command-[a-z]+|task-notification|bash-[a-z]+)[^>]*>[\s\S]*?<\/\1>/g, '').trim();
  return t.length > MAX_CHARS ? t.slice(0, MAX_CHARS) + ' [trimmed]' : t;
}

function load() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return { since: new Date().toISOString(), next: 1, asks: [] }; }
}

function save(l) {
  const closed = l.asks.filter(a => !OPEN.includes(a.status) && a.status !== 'waiting');
  const old = closed.slice(0, Math.max(0, closed.length - KEEP_CLOSED));
  if (old.length) {
    const dir = path.join(stateDir, 'asks-archive');
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, new Date().toISOString().slice(0, 7) + '.jsonl'), old.map(a => JSON.stringify(a)).join('\n') + '\n');
    l.asks = l.asks.filter(a => !old.includes(a));
  }
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(l, null, 1));
}

// Adds a message unless it is already there (the same words within 3 minutes are one message).
function add(l, at, text) {
  if (!text || at < l.since) return null;
  const t = new Date(at).getTime();
  if (l.asks.some(a => a.text === text && Math.abs(new Date(a.at).getTime() - t) < 180000)) return null;
  const a = { id: l.next++, at, text, status: 'new' };
  l.asks.push(a);
  return a;
}

// Words that make an ask about many things; English, Arabic and his usual spellings.
const MANY = /\b(every|all|each|rest|remaining|whole|everything|everywhere)\b|كل|جميع|باقي/i;
const many = a => MANY.test(a.text);
const partsLeft = a => (a.parts || []).filter(p => !p.done);
const split = s => String(s || '').split('|').map(x => x.trim()).filter(Boolean);

const short = s => s.length > 140 ? s.slice(0, 140) + '...' : s;
const partsNote = a => a.parts ? ` {${a.parts.length - partsLeft(a).length} of ${a.parts.length} parts done` +
  (partsLeft(a).length ? '; left: ' + partsLeft(a).map(p => p.name).join(', ') : '') + '}' : '';
const line = a => `#${a.id} [${a.status}] ${short(a.text)}${a.note ? ' (' + short(a.note) + ')' : ''}${partsNote(a)}`;
const open = l => l.asks.filter(a => OPEN.includes(a.status));

// His real messages in the transcript (not tool results, not system or compaction text).
function fromTranscript(p) {
  if (!p || !fs.existsSync(p)) return [];
  const found = [];
  for (const raw of fs.readFileSync(p, 'utf8').split('\n')) {
    let j; try { j = JSON.parse(raw); } catch { continue; }
    if (j.type !== 'user' || j.isMeta || j.isSidechain || j.isCompactSummary || !j.message || !j.timestamp) continue;
    const c = j.message.content;
    const text = typeof c === 'string' ? c : Array.isArray(c) && !c.some(x => x.type === 'tool_result') ? c.filter(x => x.type === 'text').map(x => x.text).join('\n') : '';
    const t = clean(text);
    if (t && !/^\[Request interrupted/.test(t)) found.push({ at: j.timestamp, text: t });
  }
  return found;
}

function toolCount(p) {
  try { return (fs.readFileSync(p, 'utf8').match(/"type":"tool_use"/g) || []).length; } catch { return 0; }
}

const HOW = 'Mark each with: node .claude/hooks/asks.js set <ids> <status> "<one line: what was done or why>". Statuses: ' +
  ALL.map(s => s + ' = ' + MEANS[s]).join('; ') + '.';

function run(mode, input) {
  const l = load();
  if (mode === 'prompt') {
    const a = add(l, new Date().toISOString(), clean(input.prompt));
    save(l);
    const rest = open(l).filter(x => !a || x.id !== a.id);
    const notes = [];
    if (a) notes.push(`Salem's message is recorded as ask #${a.id}. Sort it (doing, standing or noted) before you finish.`);
    if (a && many(a)) notes.push(`Ask #${a.id} is about many things. Before starting, list every part from the project itself ` +
      `(files, the board): node .claude/hooks/asks.js parts ${a.id} "A|B|C". Tick parts as they finish; it cannot be done until all are.`);
    if (rest.length) notes.push('His other open asks, still to finish: ' + rest.map(line).join(' | ') +
      '. A standing ask is an ongoing order: after this message is handled, go back to it.');
    return notes.length ? { hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: notes.join('\n') } } : null;
  }
  if (mode === 'stop') {
    for (const m of fromTranscript(input.transcript_path)) add(l, m.at, m.text);
    save(l);
    const left = open(l);
    let g = {}; try { g = JSON.parse(fs.readFileSync(guardFile, 'utf8')); } catch {}
    if (!left.length) { fs.writeFileSync(guardFile, '{}'); return null; }
    const tools = toolCount(input.transcript_path);
    // Never trap Claude: a second stop with no work in between, or too many blocks in a row, lets the turn end.
    if (input.stop_hook_active && (tools === g.tools || (g.blocks || 0) >= MAX_BLOCKS)) {
      fs.writeFileSync(guardFile, '{}');
      process.stderr.write('asks: stopping with open asks ' + left.map(a => '#' + a.id).join(', ') + '\n');
      return null;
    }
    fs.writeFileSync(guardFile, JSON.stringify({ tools, blocks: input.stop_hook_active ? (g.blocks || 0) + 1 : 1 }));
    return { decision: 'block', reason: "Before your final message, check Salem's asks. Still open:\n" + left.map(line).join('\n') +
      '\nFor each: do it now, or mark it. A standing ask means keep working: start its next part instead of ending the turn; ' +
      'only finishing it, Salem ending it, or needing his answer (waiting, with the question on the board) ends it. ' + HOW +
      ' Your final message then says in one line which of his asks are done and which wait on him.' };
  }
}

const mode = process.argv[2];
if (mode === 'parts' || mode === 'tick') {
  const l = load(), [id, names] = process.argv.slice(3), a = l.asks.find(x => x.id === Number(id));
  if (!a) { console.error('no ask #' + id); process.exit(1); }
  if (mode === 'parts') {
    const kept = new Map((a.parts || []).map(p => [p.name, p.done]));
    a.parts = split(names).map(name => ({ name, done: !!kept.get(name) }));
  } else {
    for (const n of split(names)) {
      const p = (a.parts || []).find(x => x.name.toLowerCase() === n.toLowerCase());
      if (!p) { console.error(`#${id} has no part "${n}". Its parts: ${(a.parts || []).map(x => x.name).join(', ') || 'none yet'}`); process.exit(1); }
      p.done = true;
    }
  }
  save(l);
  console.log(line(a));
} else if (mode === 'list' || mode === 'set') {
  const l = load();
  if (mode === 'set') {
    const [ids, status, ...note] = process.argv.slice(3);
    if (!ALL.includes(status)) { console.error('status must be one of: ' + ALL.join(', ')); process.exit(1); }
    for (const id of String(ids).split(',').map(Number)) {
      const a = l.asks.find(x => x.id === id);
      if (!a) { console.error('no ask #' + id); process.exit(1); }
      if (status === 'done' && partsLeft(a).length) {
        console.error(`#${id} is not done: ${partsLeft(a).length} of ${a.parts.length} parts left (${partsLeft(a).map(p => p.name).join(', ')}). Finish them, or mark it waiting with the question on the board.`); process.exit(1);
      }
      if (status === 'done' && many(a) && !a.parts) {
        console.error(`#${id} is about many things ("${short(a.text)}"). List its parts from the project first: node .claude/hooks/asks.js parts ${id} "A|B|C", then tick them.`); process.exit(1);
      }
      Object.assign(a, { status, note: note.join(' ') || a.note, updated: new Date().toISOString() });
    }
    save(l);
  }
  const o = l.asks.filter(a => OPEN.includes(a.status) || a.status === 'waiting');
  console.log(o.length ? o.map(line).join('\n') : 'No open asks.');
} else {
  let raw = '';
  process.stdin.on('data', d => raw += d).on('end', () => {
    try {
      const out = run(mode, JSON.parse(raw || '{}'));
      if (out) process.stdout.write(JSON.stringify(out));
    } catch (e) { process.stderr.write('asks hook: ' + e.message + '\n'); }
    process.exit(0);
  });
}
