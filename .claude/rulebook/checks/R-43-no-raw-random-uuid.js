// crypto.randomUUID only exists on secure addresses (https or localhost). The Wi-Fi demo on plain http showed a blank
// Home for a day (2026-10-05, t53). Every new id comes from app/src/lib/id.ts, which works everywhere.
module.exports = {
  id: 'R-43',
  text: 'Never call crypto.randomUUID in app code: it is missing on plain-http addresses (the Wi-Fi demo). Import the id helper from app/src/lib/id.ts.',
  check(p, c) {
    if (!/^app\/src\/.*\.(tsx|ts|jsx|js)$/.test(p) || p === 'app/src/lib/id.ts') return null;
    return /\brandomUUID\s*\(/.test(c) ? 'found randomUUID(' : null;
  },
};
