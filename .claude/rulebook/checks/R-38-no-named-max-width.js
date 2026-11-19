// Our spacing roles (xs, sm, md, lg, xl) share names with Tailwind's widths, so max-w-md becomes 12px.
// Caught twice (2026-10-04 screens squeezed, 2026-10-05 QR drawn as a dot). Use exact widths like max-w-[28rem].
module.exports = {
  id: 'R-38',
  text: 'Never use max-w-xs/sm/md/lg/xl (or min-w-, w- with those names) in app code: they read our spacing tokens. Use an exact width like max-w-[28rem].',
  check(p, c) {
    if (!/^app\/src\/.*\.(tsx|ts|jsx|js|css)$/.test(p)) return null;
    const m = c.match(/(?<![\w-])(?:max-w|min-w|w)-(?:xs|sm|md|lg|xl)(?![\w-])/);
    return m ? `found "${m[0]}"` : null;
  },
};
