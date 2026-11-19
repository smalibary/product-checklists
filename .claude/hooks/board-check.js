// Stop hook: Claude may not end a turn that changed files without updating the board's tasks (rule R-04).
// Salem saw ten pieces of work land with no task moving (2026-10-04); this makes forgetting impossible.
// Reads the transcript from Salem's last message onward. Blocks (decision "block") when the turn used
// Write/Edit/MultiEdit/NotebookEdit or a git commit but no ArtifactData write to tasks, versions or meta.
// Never blocks twice in a row (stop_hook_active), and does nothing in projects without a board.
const fs = require('fs'), path = require('path');

let raw = '';
process.stdin.on('data', d => raw += d).on('end', () => {
  try {
    const input = JSON.parse(raw || '{}');
    if (input.stop_hook_active || !input.transcript_path || !fs.existsSync(input.transcript_path)) process.exit(0);
    const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
    const claudeMd = path.join(root, 'CLAUDE.md');
    if (!fs.existsSync(claudeMd) || !/claude\.ai\/artifact\//.test(fs.readFileSync(claudeMd, 'utf8'))) process.exit(0);

    const lines = fs.readFileSync(input.transcript_path, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } });
    let start = 0; // index after Salem's last real message
    lines.forEach((j, i) => {
      if (j.type !== 'user' || j.isMeta || j.isSidechain || !j.message) return;
      const c = j.message.content;
      if (typeof c === 'string' || (Array.isArray(c) && !c.some(x => x.type === 'tool_result'))) start = i;
    });
    const uses = lines.slice(start).flatMap(j => j.type === 'assistant' && Array.isArray(j.message?.content) ? j.message.content.filter(c => c.type === 'tool_use') : []);
    const changed = uses.some(u => /^(Write|Edit|MultiEdit|NotebookEdit)$/.test(u.name) || (/^(Bash|PowerShell)$/.test(u.name) && /git\s+commit/.test(u.input?.command || '')));
    // Every collection a board write touched this turn (single writes and batches).
    const touched = new Set(uses.filter(u => u.name === 'ArtifactData').flatMap(u => u.input?.action === 'batch'
      ? (u.input.writes || []).map(w => w.collection) : ['set', 'update', 'delete', 'str_replace'].includes(u.input?.action) ? [u.input.collection] : []));
    // Both are needed: a task moved, and the headline (meta/now) matches it. Test B showed tasks alone leave it stale.
    const updated = (touched.has('tasks') || touched.has('versions')) && touched.has('meta');
    if (changed && !updated) {
      process.stdout.write(JSON.stringify({ decision: 'block', reason: 'Files changed this turn but the board\'s tasks did not (R-04). Before finishing: add or update the task(s) for this work on the board (status doing, checking or done), update the board headline (meta/now) to match, and update the Status line in .claude/state/now.md.' }));
    }
  } catch (e) { process.stderr.write('board-check: ' + e.message + '\n'); }
  process.exit(0);
});
