// After every Write/Edit, runs each check in .claude/rulebook/checks/ against the file just written.
// Exit code 2 sends the failures back to Claude so it fixes them before moving on.
const fs = require('fs'), path = require('path');

let raw = '';
process.stdin.on('data', d => raw += d).on('end', () => {
  const input = JSON.parse(raw || '{}');
  let file = input.tool_input && input.tool_input.file_path;
  if (file) file = file.replace(/^\/([a-z])\//i, (m, d) => d.toUpperCase() + ':/'); // Git Bash style /c/... path
  if (!file || !fs.existsSync(file)) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel.startsWith('../') || path.isAbsolute(rel)) process.exit(0); // outside this project: its rules don't apply
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.join(root, '.claude', 'rulebook', 'checks');
  if (!fs.existsSync(dir)) process.exit(0);

  const fails = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const rule = require(path.join(dir, f));
    const error = rule.check(rel, content);
    if (error) fails.push(`${rule.id} (${error}): ${rule.text}`);
  }
  if (fails.length) {
    console.error(`Rule check failed for ${rel}:\n${fails.join('\n')}`);
    process.exit(2);
  }
});
