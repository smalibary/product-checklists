module.exports = {
  id: 'R-01',
  text: 'CLAUDE.md only points to other files. Move rules, status or decisions into .claude/rulebook/.',
  check(p, c) {
    if (!/(^|\/)CLAUDE\.md$/.test(p)) return null;
    const lines = c.split(/\r?\n/).length;
    return lines > 20 ? `CLAUDE.md is ${lines} lines, limit is 20` : null;
  },
};
