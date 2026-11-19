// Shared by the Vite and Next.js hookups: saves a pick (its text and screenshot) into .claude/inbox/ and builds the script
// the browser loads. Development only: both hookups refuse in production.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const MAX_BODY = 20 * 1024 * 1024;

function stamp(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `pick-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export const inboxOf = projectDir => path.join(projectDir, '.claude', 'inbox');

// The body is either the pick's text (older pages) or JSON { name, text, png } with the png as a data address.
export function savePick(projectDir, body) {
  let text = String(body || ''), name = stamp(), png = null;
  if (text.startsWith('{')) {
    const j = JSON.parse(text);
    text = String(j.text || '');
    if (/^pick-\d{8}-\d{6}$/.test(j.name || '')) name = j.name;
    if (typeof j.png === 'string' && j.png.startsWith('data:image/png;base64,')) png = Buffer.from(j.png.slice(22), 'base64');
  }
  text = text.slice(0, 20000);
  if (!text.startsWith('# Screen pick')) throw new Error('not a screen pick');
  const dir = inboxOf(projectDir);
  fs.mkdirSync(dir, { recursive: true });
  const rel = f => path.relative(projectDir, f).replace(/\\/g, '/');
  const md = path.join(dir, `${name}.md`);
  const out = {};
  // The screenshot first, so it is there when the hook announces the .md.
  if (png) { const f = path.join(dir, `${name}.png`); fs.writeFileSync(f, png); out.shot = rel(f); }
  fs.writeFileSync(md, text);
  out.saved = rel(md);
  return out;
}

// html-to-image's browser file, from the app's own packages (pnpm add -D html-to-image in the app).
export function shotLib(appDir) {
  const req = createRequire(path.join(appDir, 'package.json'));
  return fs.readFileSync(path.join(path.dirname(req.resolve('html-to-image/package.json')), 'dist', 'html-to-image.js'), 'utf8');
}

const asDataUrl = blob => new Promise((done, fail) => {
  const r = new FileReader(); r.onload = () => done(r.result); r.onerror = () => fail(r.error); r.readAsDataURL(blob);
});

// The overlay in copy mode: Copy puts the text on the clipboard and posts text and screenshot back to the dev
// server. The Point button is on, for phones.
export function devScript(endpoint, { projectDir, lib }) {
  const read = f => fs.readFileSync(path.join(here, f), 'utf8');
  const inbox = inboxOf(projectDir).replace(/\\/g, '/');
  return `${read('inspect.js')}
${read('inspect-copy.js')}
(function () {
  const asDataUrl = ${asDataUrl.toString()};
  Inspect.start({ button: true, copy: InspectCopy({ inbox: ${JSON.stringify(inbox)}, lib: ${JSON.stringify(lib)},
    save: async ({ name, text, png }) => {
      const body = JSON.stringify({ name, text, png: png ? await asDataUrl(png) : null });
      const r = await fetch(${JSON.stringify(endpoint)}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (!r.ok) throw new Error('dev server answered ' + r.status);
      return r.json();
    } }) });
})();\n`;
}
