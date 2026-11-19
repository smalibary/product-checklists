module.exports = {
  id: 'R-02',
  text: 'No maintained file goes over 250 lines. Split it by topic and leave a pointer.',
  check(p, c) {
    if (!/\.(md|js|ts|tsx|json|ps1|sh)$/.test(p) || /(^|\/)(node_modules|\.next|dist|build)\//.test(p) || /lock\.json$/.test(p)) return null;
    const lines = c.split(/\r?\n/).length;
    return lines > 250 ? `${lines} lines, limit is 250` : null;
  },
};
