// Keeps Salem's own words and the live state on disk so compaction cannot lose them, and tells Claude about
// new files in .claude/inbox/ (screen picks from inspect mode, screenshots, anything he drops there).
//   node memory.js prompt   UserPromptSubmit: save his message; announce new files in .claude/inbox/.
//   node memory.js backstop PreCompact: re-scan the transcript for his messages (catches ones sent mid-turn).
//   node memory.js restore  SessionStart (startup, compact, clear, resume): re-inject state, his recent words, git status.
// Both prompt and restore also add one line when the weekly pattern sweep is due (R-41; prompt: at most once a day).
// State lives in .claude/state/: now.md (the orchestrator keeps it under 40 lines), words.md (last 30 messages).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const stateDir = path.join(root, '.claude', 'state');
const wordsFile = path.join(stateDir, 'words.md');
const KEEP = 30, MAX_CHARS = 800;

// Only what he typed: pasted blocks, system wrappers and command noise are removed, long text is trimmed.
function clean(text) {
  let t = String(text || '');
  t = t.replace(/<pasted_content[^>]*>[\s\S]*?<\/pasted_content[^>]*>/g, '[pasted text left out]');
  t = t.replace(/<(system-reminder|command-[a-z]+|local-command-[a-z]+|task-notification)[^>]*>[\s\S]*?<\/\1>/g, '');
  t = t.trim();
  return t.length > MAX_CHARS ? t.slice(0, MAX_CHARS) + ' [trimmed]' : t;
}

function readWords() {
  if (!fs.existsSync(wordsFile)) return [];
  return fs.readFileSync(wordsFile, 'utf8').split(/^### /m).slice(1).map(b => {
    const nl = b.indexOf('\n');
    return { at: b.slice(0, nl).trim(), text: b.slice(nl + 1).trim() };
  });
}

// Merge new messages in; the same text within 2 minutes is one message (logged live, then found again).
function saveWords(entries) {
  const all = readWords();
  for (const e of entries) {
    if (!e.text) continue;
    const dup = all.some(a => a.text === e.text && Math.abs(new Date(a.at) - new Date(e.at)) < 120000);
    if (!dup) all.push(e);
  }
  all.sort((a, b) => a.at.localeCompare(b.at));
  fs.mkdirSync(stateDir, { recursive: true });
  const body = all.slice(-KEEP).map(e => `### ${e.at}\n${e.text}\n`).join('\n');
  fs.writeFileSync(wordsFile, '# Salem\'s own words (last ' + KEEP + ', oldest first, written by a hook)\n\n' + body);
}

function newInboxFiles() {
  const inbox = path.join(root, '.claude', 'inbox'), seenFile = path.join(stateDir, 'inbox-seen');
  if (!fs.existsSync(inbox)) return [];
  const seen = fs.existsSync(seenFile) ? Number(fs.readFileSync(seenFile, 'utf8')) || 0 : 0;
  const fresh = fs.readdirSync(inbox).filter(f => !f.startsWith('.'))
    .map(f => ({ f, t: fs.statSync(path.join(inbox, f)).mtimeMs })).filter(x => x.t > seen);
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(seenFile, String(Date.now()));
  return fresh.sort((a, b) => b.t - a.t).map(x => '.claude/inbox/' + x.f);
}

// R-41: the last report in .claude/docs/sweeps/ is older than 7 days (or none exists yet and the lessons file has 5+ rows).
// Returns the line to add, or '' when nothing is due. Cheap: one directory listing, no git, no transcript.
function sweepNote() {
  const dir = path.join(root, '.claude', 'docs', 'sweeps');
  const dates = fs.existsSync(dir) ? fs.readdirSync(dir).map(f => (f.match(/^(\d{4}-\d{2}-\d{2})\.md$/) || [])[1]).filter(Boolean).sort() : [];
  const lessons = path.join(root, '.claude', 'docs', 'lessons.md');
  const rows = fs.existsSync(lessons) ? (fs.readFileSync(lessons, 'utf8').match(/^(\||- )\s*20\d\d-/gm) || []).length : 0;
  if (!dates.length && rows < 5) return '';
  const last = dates[dates.length - 1];
  if (last && Date.now() - new Date(last + 'T00:00:00').getTime() < 7 * 86400000) return '';
  return 'Pattern sweep due (last: ' + (last || 'never') + '): run the pattern-sweep skill after the current task.';
}

function out(event, context) {
  if (context) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: context } }));
}

function openAsks() {
  try {
    return JSON.parse(fs.readFileSync(path.join(stateDir, 'asks.json'), 'utf8')).asks
      .filter(a => ['new', 'doing', 'standing', 'waiting'].includes(a.status))
      .map(a => `- #${a.id} [${a.status}] ${a.text.slice(0, 200)}${a.note ? ' (' + a.note + ')' : ''}`).join('\n');
  } catch { return ''; }
}

function tail(file, n) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split(/\r?\n/).slice(-n).join('\n') : '';
}

let raw = '';
process.stdin.on('data', d => raw += d).on('end', () => {
  const input = JSON.parse(raw || '{}');
  const mode = process.argv[2];
  try {
    if (mode === 'prompt') {
      saveWords([{ at: new Date().toISOString(), text: clean(input.prompt) }]);
      const notes = [];
      const files = newInboxFiles();
      if (files.length) notes.push('New in .claude/inbox/ since the last message (newest first): ' + files.join(', ') +
        '. A file named pick-*.md is a screen pick from inspect mode: read it before answering, it says what Salem is pointing at.');
      // R-04: the board is checked first every turn; a request was once missed because this was left to memory.
      const claudeMd = path.join(root, 'CLAUDE.md');
      const md = fs.existsSync(claudeMd) ? fs.readFileSync(claudeMd, 'utf8') : '';
      const board = (md.match(/https:\/\/claude\.ai\/artifact\/[\w-]+/) || [])[0];
      if (board) notes.push('Before anything else: read the board (' + board + ') for requests with status new and newly answered questions; mark requests seen.');
      const mockups = (md.match(/Mockup page[^\n]*?(https:\/\/claude\.ai\/artifact\/[\w-]+)/) || [])[1];
      if (mockups) notes.push('Also read the mockup page (' + mockups + ') picks with status new (mockup skill, step 5).');
      const sweep = sweepNote(), nagFile = path.join(stateDir, 'sweep-nagged'), today = new Date().toISOString().slice(0, 10);
      if (sweep && (!fs.existsSync(nagFile) || fs.readFileSync(nagFile, 'utf8').trim() !== today)) {
        notes.push(sweep);
        fs.mkdirSync(stateDir, { recursive: true });
        fs.writeFileSync(nagFile, today);
      }
      out('UserPromptSubmit', notes.join('\n'));
    }
    if (mode === 'backstop' && input.transcript_path && fs.existsSync(input.transcript_path)) {
      const found = [];
      for (const line of fs.readFileSync(input.transcript_path, 'utf8').split('\n')) {
        let j; try { j = JSON.parse(line); } catch { continue; }
        if (j.type !== 'user' || j.isMeta || j.isSidechain || j.isCompactSummary || !j.message) continue;
        const c = j.message.content;
        const text = typeof c === 'string' ? c : Array.isArray(c) && !c.some(x => x.type === 'tool_result') ? c.filter(x => x.type === 'text').map(x => x.text).join('\n') : '';
        if (text && j.timestamp) found.push({ at: j.timestamp, text: clean(text) });
      }
      saveWords(found.slice(-KEEP));
    }
    if (mode === 'restore') {
      let git = '';
      try { git = execSync('git status --short --branch && git log --oneline -5', { cwd: root, encoding: 'utf8' }); } catch {}
      const words = readWords().slice(-10).map(e => `- [${e.at.slice(0, 16)}] ${e.text}`).join('\n');
      out('SessionStart', [
        'RESTORED FROM DISK after compaction, clear or resume. This beats any summary.',
        '## Live state (.claude/state/now.md)', tail(path.join(stateDir, 'now.md'), 40) || '(empty)',
        '## Salem\'s last 10 messages, his exact words', words || '(none saved)',
        "## Salem's open asks (.claude/state/asks.json; standing = an ongoing order, go back to it)", openAsks() || '(none)',
        '## Git', git.trim() || '(not available)',
        'Next: read the board (its address is in CLAUDE.md) for open requests and answered questions before acting.',
        sweepNote(),
      ].filter(Boolean).join('\n\n'));
    }
  } catch (e) {
    process.stderr.write('memory hook: ' + e.message + '\n');
  }
  process.exit(0); // never blocks Salem's message or a compaction
});
