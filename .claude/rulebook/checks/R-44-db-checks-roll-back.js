// Every database check runs on one local database shared by all checkouts and helpers. A check that does not
// roll back leaves rows behind that break the next run (2026-10-05 and 2026-10-06: Maria moved, read marks left,
// cache rows counted). Each check file opens with begin; and ends with rollback;.
module.exports = {
  id: 'R-44',
  text: 'A database check file (app/supabase/tests/database/*.test.sql) must contain begin; and end with rollback; so it leaves the shared database as it found it.',
  check(p, c) {
    if (!/^app\/supabase\/tests\/database\/[^/]+\.test\.sql$/.test(p)) return null;
    const code = c.replace(/--[^\n]*/g, '').trim();
    if (!/^begin\s*;/im.test(code.split(/\r?\n/).filter(l => l.trim())[0] || '')) return 'the first statement is not begin;';
    return /rollback\s*;\s*$/i.test(code) ? null : 'the file does not end with rollback;';
  },
};
