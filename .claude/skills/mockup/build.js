// Builds a mockup page (the second artifact) from DESIGN.md plus one topic file.
// Run from the project folder: node .claude/skills/mockup/build.js .claude/mockups/<topic>.md
// Writes .claude/mockups/<topic>.html; publish it to the mockup page's address (CLAUDE.md has it once it exists).
// DESIGN.md is Google's format (github.com/google-labs-code/design.md): tokens in the front matter, and a
// "## Components" section with one ### per component holding an html block (and a css block), or naming a
// split-out file (`design/components.md`) that holds them.
// The topic file has a "# Title", one line of intro and "## Screens" (one ### per screen or option).
// A screen may start with "Design: <file>" to use another DESIGN.md (how the first look is chosen:
// three candidate design files, one per option). Inspect mode (.claude/inspect/inspect.js) is built in.
const fs = require('fs'), path = require('path');
const here = __dirname, root = process.cwd();
const read = f => fs.readFileSync(path.join(here, f), 'utf8');
const readRoot = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const warnings = [];

const topicFile = process.argv[2];
if (!topicFile) { console.log('Usage: node .claude/skills/mockup/build.js .claude/mockups/<topic>.md'); process.exit(1); }

function sectionsOf(text, fallback) {
  const md = text.replace(/^---\n[\s\S]*?\n---\n/, ''), out = {};
  out._title = (md.match(/^# (.+)$/m) || [])[1] || fallback;
  out._intro = (md.split(/^## /m)[0].split('\n').find(l => l.trim() && !l.startsWith('#')) || '').trim();
  for (const chunk of md.split(/^## /m).slice(1)) {
    const nl = chunk.indexOf('\n');
    out[chunk.slice(0, nl).trim().toLowerCase()] = chunk.slice(nl + 1);
  }
  return out;
}
const blocks = text => [...text.matchAll(/```(\w*)[^\n]*\n([\s\S]*?)```/g)].map(m => ({ lang: m[1], code: m[2].trim() }));
function items(text = '') {
  return text.split(/^### /m).slice(1).map(chunk => {
    const nl = chunk.indexOf('\n'), name = chunk.slice(0, nl).trim(), rest = chunk.slice(nl + 1);
    const design = (rest.match(/^Design:\s*(\S+)/m) || [])[1];
    const desc = (rest.split('\n').find(l => l.trim() && !l.startsWith('```') && !/^Design:/.test(l)) || '').trim();
    const bs = blocks(rest);
    return { name, desc, design, html: bs.filter(b => b.lang === 'html').map(b => b.code).join('\n'),
      css: bs.filter(b => b.lang === 'css').map(b => b.code).join('\n') };
  });
}

// Tokens from the front matter, as CSS variables: colors.x -> --color-x, typography.x -> --font-x (a whole
// font: weight size/line-height family), spacing.x -> --space-x, rounded.x -> --radius-x.
// Three tiers: a token whose value is "{colors.blue-600}" points at another token and becomes var(--color-blue-600).
// Tokens that others point at are primitives (tier 1); components use only the tiers above them.
function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/); if (!m) return {};
  const top = {}, stack = [{ indent: -1, obj: top }];
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.search(/\S/), kv = line.trim().match(/^([^:]+):\s*(.*)$/); if (!kv) continue;
    while (stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj, key = kv[1].trim(), val = kv[2].replace(/^["']|["']$/g, '');
    if (val === '') { parent[key] = {}; stack.push({ indent, obj: parent[key] }); } else parent[key] = val;
  }
  return top;
}
const family = f => f.split(',').map(x => x.trim()).map(x => /\s/.test(x) && !/^["']/.test(x) ? `"${x}"` : x).join(', ') + ', system-ui, sans-serif';

const designs = new Map();
function loadDesign(file) {
  if (designs.has(file)) return designs.get(file);
  if (!fs.existsSync(path.join(root, file))) { console.log(`No ${file}: write it first (see the mockup skill).`); process.exit(1); }
  const text = readRoot(file), fm = frontMatter(text), sec = sectionsOf(text, file);
  const tokens = [
    ...Object.entries(fm.colors || {}).map(([k, v]) => ({ name: '--color-' + k, value: v })),
    ...Object.entries(fm.typography || {}).map(([k, t]) => ({ name: '--font-' + k,
      value: `${t.fontWeight || 400} ${t.fontSize || '16px'}/${t.lineHeight || 1.4} ${family(t.fontFamily || 'system-ui')}` })),
    ...Object.entries(fm.spacing || {}).map(([k, v]) => ({ name: '--space-' + k, value: /^\d+$/.test(v) ? v + 'px' : v })),
    ...Object.entries(fm.rounded || {}).map(([k, v]) => ({ name: '--radius-' + k, value: v })),
  ];
  const prefix = { colors: '--color-', spacing: '--space-', rounded: '--radius-', typography: '--font-' }, primitives = new Set();
  for (const t of tokens) t.value = String(t.value).replace(/\{(\w+)\.([\w-]+)\}/g, (all, g, k) => {
    if (!prefix[g] || !(fm[g] || {})[k]) { warnings.push(`${file}: ${t.name} points at ${all}, which does not exist`); return all; }
    primitives.add(prefix[g] + k); return `var(${prefix[g] + k})`; });
  if (!tokens.length) warnings.push(`${file} has no tokens in its front matter`);
  if (!sec.components) warnings.push(`${file} has no "## Components" section`);
  // The components' HTML and CSS may live in a split-out file the section names, like `design/components.md`.
  const linkedPaths = [...new Set([...(sec.components || '').matchAll(/`([^`]+\.md)`/g)].map(m => path.join(path.dirname(file), m[1])))].filter(p => fs.existsSync(path.join(root, p)));
  const components = items((sec.components || '') + linkedPaths.map(p => '\n' + readRoot(p)).join(''));
  for (const c of components) {
    if (!/data-component=/.test(c.html)) warnings.push(`${file}, component "${c.name}": its html has no data-component, inspect mode cannot name it`);
    if (/#[0-9a-f]{3,8}\b|rgba?\(/i.test(c.css)) warnings.push(`${file}, component "${c.name}": uses a raw colour, use a colour token`);
    for (const v of new Set([...c.css.matchAll(/var\((--[\w-]+)/g)].map(m => m[1])))
      if (primitives.has(v)) warnings.push(`${file}, component "${c.name}": uses the primitive ${v}, use a role token that points at it`);
  }
  const d = { file, id: 'dz' + designs.size, label: fm.name || file, tokens, components, text,
    // Known = drawn components, plus every name in the Components table (| Name | Job | Notes |): the closed list.
    known: new Set([...components.map(c => (c.html.match(/data-component="([^"]+)"/) || [])[1]),
      ...[...(sec.components || '').matchAll(/^\|\s*([A-Z][A-Za-z]+)\s*\|/gm)].map(m => m[1])]) };
  designs.set(file, d); return d;
}

const topicText = readRoot(topicFile), topic = sectionsOf(topicText, path.basename(topicFile, '.md'));
if (!topic.screens) warnings.push(`${topicFile} has no "## Screens" section`);
const screens = items(topic.screens);
for (const s of screens) {
  s.d = loadDesign(s.design || 'DESIGN.md');
  if (!s.html) warnings.push(`Screen "${s.name}" has no html block`);
  // R-35: a screen uses only the components its design file lists.
  for (const m of s.html.matchAll(/data-component="([^"]+)"/g))
    if (!s.d.known.has(m[1])) warnings.push(`Screen "${s.name}" uses "${m[1]}", which is not in ${s.d.file}'s components (R-35)`);
}
if (!designs.size) loadDesign('DESIGN.md');
const all = [...designs.values()], several = all.length > 1;

// Each design's tokens and component styles are scoped to its own class, so options never mix.
// @keyframes blocks pass through untouched (their 0% / to steps are not selectors).
const scope = (css, sel) => css.replace(/(\s*@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\})|([^{}]+)\{/g, (m, kf, s) => kf ? kf : s.trim().startsWith('@') ? m
  : s.split(',').map(x => `${sel} ${x.trim()}`).join(', ') + ' {');
const css = all.map(d => `.${d.id} { ${d.tokens.map(t => `${t.name}: ${t.value};`).join(' ')} }\n` +
  scope(d.components.map(c => c.css).join('\n'), '.' + d.id)).join('\n');

// Web fonts: any Google Fonts address written in a design file or the topic file is loaded.
const fontUrls = [...new Set([...all.map(d => d.text), topicText].join('\n')
  .match(/https:\/\/fonts\.googleapis\.com\/css2\?[^\s)`"<>]+/g) || [])];

const screensHtml = screens.map(s => `<figure class="ui-phone"><figcaption>${esc(s.name)}<small>${esc(s.desc)}</small></figcaption>
<div class="dz ${s.d.id} ui-screen" data-screen="${esc(s.name)}">${s.html}</div></figure>`).join('\n') || '<p>No screens yet.</p>';

const tag = d => several ? `${d.label} · ` : '';
const componentsHtml = all.flatMap(d => d.components.map(c => `<article class="ui-comp"><h3>${esc(tag(d) + c.name)}</h3><p>${esc(c.desc)}</p>
<div class="dz ${d.id} ui-stage" data-screen="Component: ${esc(tag(d) + c.name)}">${c.html}</div></article>`)).join('\n') || '<p>No components yet.</p>';

function look(d) {
  const group = p => d.tokens.filter(t => t.name.startsWith(p)), parts = [];
  if (group('--color-').length) parts.push(`<div><h3>Colours</h3><div class="ui-swatches">${group('--color-').map(t =>
    `<div class="ui-swatch" data-name="Colour ${esc(t.name)}"><i style="background: var(${t.name})"></i><span>${esc(t.name)}<br>${esc(t.value)}</span></div>`).join('')}</div></div>`);
  if (group('--font-').length) parts.push(`<div><h3>Text styles</h3>${group('--font-').map(t =>
    `<div class="ui-row" data-name="Text style ${esc(t.name)}"><code>${esc(t.name)}</code><span style="font: var(${t.name})">Today's tasks · مهام اليوم ١٢٣</span></div>`).join('')}</div>`);
  if (group('--space-').length) parts.push(`<div><h3>Spacing</h3>${group('--space-').map(t =>
    `<div class="ui-row" data-name="Spacing ${esc(t.name)}"><code>${esc(t.name)} ${esc(t.value)}</code><div class="ui-bar" style="width: var(${t.name})"></div></div>`).join('')}</div>`);
  if (group('--radius-').length) parts.push(`<div><h3>Corners</h3>${group('--radius-').map(t =>
    `<div class="ui-row" data-name="Corner ${esc(t.name)}"><code>${esc(t.name)} ${esc(t.value)}</code><div class="ui-radius" style="border-radius: var(${t.name})"></div></div>`).join('')}</div>`);
  return `<div class="dz ${d.id} ui-look">${several ? `<h2>${esc(d.label)}</h2>` : ''}${parts.join('\n')}</div>`;
}

const project = path.basename(root);
const built = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const page = read('template.html')
  .split('__PROJECT__').join(esc(project))
  .replace('__TOPIC__', esc(topic._title))
  .replace('__INTRO__', esc(topic._intro))
  .replace('__BUILT__', built)
  .replace('/*DESIGN_CSS*/', () => css)
  .replace('<!--SCREENS-->', () => screensHtml)
  .replace('<!--COMPONENTS-->', () => componentsHtml)
  .replace('<!--LOOK-->', () => all.map(look).join('\n'))
  .replace('<!--FONTS-->', () => fontUrls.map(u => `<link rel="stylesheet" href="${esc(u)}">`).join('\n'))
  .replace('/*INSPECT_JS*/', () => fs.readFileSync(path.join(root, '.claude', 'inspect', 'inspect.js'), 'utf8'));

const out = topicFile.replace(/\.md$/, '') + '.html';
fs.writeFileSync(path.join(root, out), page);
console.log(`Mockup built: ${out} (${screens.length} screens, ${all.length} design file(s), ` +
  `${all.reduce((n, d) => n + d.components.length, 0)} components, ${all.reduce((n, d) => n + d.tokens.length, 0)} tokens).`);
for (const w of warnings) console.log('Warning: ' + w);
