// Direction-keeping marks (left-to-right / right-to-left marks, embeds, isolates) must never sit inside app code as
// invisible characters: pasted or escaped through a shell they got in 3 times (2026-10-05, t28 and t32).
// Typed text goes through own() in app/src/lib/shopping.ts, which builds the marks with String.fromCharCode.
module.exports = {
  id: 'R-42',
  text: 'No invisible direction marks (U+200E, U+200F, U+202A-202E, U+2066-2069) inside app code. Build them with String.fromCharCode (own() in app/src/lib/shopping.ts).',
  check(p, c) {
    if (!/^app\/src\/.*\.(tsx|ts|jsx|js)$/.test(p)) return null;
    const m = c.match(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/);
    return m ? `found U+${m[0].charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')} at character ${m.index}` : null;
  },
};
