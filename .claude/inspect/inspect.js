// Inspect mode: point at anything on screen and Claude receives exactly what it is.
// Ctrl+Shift+Space (or the Point button) turns it on. Hover outlines an element; click or tap picks it
// (the click never reaches the page). Up/Down or the Wider/Narrower buttons move to the parent or child.
// Type a note, Enter or Send sends it (Copy in copy mode). Esc leaves.
// One file for both places: the design page (sends to Claude live) and the real app in development
// (copy mode, inspect-copy.js: the text goes to the clipboard, the dev server writes .claude/inbox/pick-*.md and .png).
//   Inspect.start({ send: async (text, el) => 'Sent to Claude.' /* or throw */, button: true })
//   Inspect.start({ copy: InspectCopy({ ... }), button: true })
// Optional: window.__inspectExtra = (el, x, y) => ({ ... }) adds facts only the app knows,
// such as the drawing or 3D object under the point and its key values.
(function () {
  if (window.Inspect) return;
  let opts = {}, busy = false, on = false, hover = null, picked = null, pt = null, root, $;

  const CSS = `
    :host { all: initial; }
    .box { position: fixed; pointer-events: none; z-index: 2147483646; border: 2px solid #2563eb;
      background: rgba(37, 99, 235, .10); border-radius: 2px; display: none; }
    .tag { position: fixed; pointer-events: none; z-index: 2147483647; display: none; font: 600 12px/1.4 system-ui, sans-serif;
      background: #1e3a8a; color: #fff; padding: 2px 6px; border-radius: 3px; white-space: nowrap; }
    .card { position: fixed; z-index: 2147483647; left: 12px; right: 12px; bottom: 12px; max-width: 420px; margin: 0 auto;
      background: #111827; color: #f9fafb; border-radius: 10px; padding: 12px; display: none;
      font: 14px/1.4 system-ui, sans-serif; box-shadow: 0 8px 30px rgba(0,0,0,.35); }
    .what { font-weight: 600; margin-bottom: 2px; overflow-wrap: anywhere; }
    .sub { color: #9ca3af; font-size: 12px; margin-bottom: 8px; overflow-wrap: anywhere; }
    input { width: 100%; box-sizing: border-box; font: inherit; padding: 8px; border-radius: 6px; border: 1px solid #374151;
      background: #1f2937; color: #f9fafb; margin-bottom: 8px; }
    .row { display: flex; gap: 6px; flex-wrap: wrap; }
    button { font: 600 13px/1 system-ui, sans-serif; padding: 9px 12px; border-radius: 6px; border: 1px solid #374151;
      background: #1f2937; color: #f9fafb; cursor: pointer; }
    button.go { background: #2563eb; border-color: #2563eb; margin-left: auto; }
    button:focus-visible, input:focus-visible { outline: 2px solid #93c5fd; outline-offset: 1px; }
    /* Top corner at the end of the screen's reading direction (top-left in Arabic, top-right in English), set by
       place(): bottom corners and the top start hold app buttons (send, photo, back). */
    .point { position: fixed; z-index: 2147483645; right: 8px; top: calc(8px + env(safe-area-inset-top, 0px));
      border-radius: 999px; padding: 7px 11px; font-size: 12px; background: #111827; border-color: #111827; opacity: .85; }
    .point.on { background: #2563eb; border-color: #2563eb; }
    .msg { font-size: 12px; color: #93c5fd; margin-top: 6px; min-height: 1em; direction: ltr; text-align: start; }
    textarea { display: none; width: 100%; box-sizing: border-box; height: 120px; margin-top: 6px; font: 12px/1.4 ui-monospace, monospace;
      background: #1f2937; color: #f9fafb; border: 1px solid #374151; border-radius: 6px; direction: ltr; }`;

  function mount() {
    const host = document.createElement('div');
    host.setAttribute('data-inspect-ui', '');
    root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${CSS}</style><div class="box"></div><div class="tag"></div>
      <div class="card" role="dialog" aria-label="${opts.copy ? 'Copy this for Claude' : 'Send this to Claude'}">
        <div class="what"></div><div class="sub"></div>
        <input id="note" placeholder="What should change? (optional)" autocomplete="off">
        <div class="row"><button id="wider">Wider</button><button id="narrower">Narrower</button>
          <button id="cancel">Cancel</button><button id="send" class="go">${opts.copy ? 'Copy' : 'Send'}</button></div>
        <div class="msg" role="status"></div><textarea readonly aria-label="Text to copy"></textarea></div>
      ${opts.button ? '<button class="point" id="point" aria-pressed="false">Point</button>' : ''}`;
    document.documentElement.appendChild(host);
    $ = s => root.querySelector(s);
    $('#wider').onclick = () => move(1);
    $('#narrower').onclick = () => move(-1);
    $('#cancel').onclick = () => { picked = null; $('.card').style.display = 'none'; show(null, '.box', '.tag'); };
    const go = () => (opts.copy ? copy() : send());
    $('#send').onclick = go;
    $('#note').onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); go(); }
      e.stopPropagation();
    };
    if (opts.button) { $('#point').onclick = () => toggle(); place(); setInterval(place, 800); }
  }

  // Screens can set their own direction (an Arabic owner, an English worker), so follow the main area's.
  function place() {
    const rtl = getComputedStyle(document.querySelector('main') || document.body).direction === 'rtl';
    Object.assign($('#point').style, { left: rtl ? '8px' : 'auto', right: rtl ? 'auto' : '8px' });
  }

  const isUi = el => el && el.closest && el.closest('[data-inspect-ui]');
  function under(x, y) { const el = document.elementFromPoint(x, y); return isUi(el) ? null : el; }

  // The name a person would use: a design component, a React component, or the element itself.
  function nameOf(el) {
    const d = el.closest('[data-component],[data-name]');
    if (d) return d.getAttribute('data-component') || d.getAttribute('data-name');
    const r = react(el); if (r.components[0]) return r.components[0];
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '');
  }

  function react(el) {
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
    const out = { components: [], source: null };
    for (let f = key ? el[key] : null; f && out.components.length < 3; f = f.return) {
      let t = f.type; if (t && typeof t === 'object') t = t.type || t.render;
      if (typeof t === 'function') {
        const n = t.displayName || t.name; if (n && !/^[a-z]/.test(n)) out.components.push(n);
        if (!out.source && f._debugSource) out.source = `${f._debugSource.fileName}:${f._debugSource.lineNumber}`;
      }
    }
    return out;
  }

  function selector(el) {
    const parts = [];
    for (let e = el; e && e.nodeType === 1 && parts.length < 5; e = e.parentElement) {
      if (e.id) { parts.unshift('#' + CSS_escape(e.id)); break; }
      let s = e.tagName.toLowerCase(), i = 1;
      for (let p = e.previousElementSibling; p; p = p.previousElementSibling) if (p.tagName === e.tagName) i++;
      parts.unshift(i > 1 ? `${s}:nth-of-type(${i})` : s);
    }
    return parts.join(' > ');
  }
  const CSS_escape = s => (window.CSS && CSS.escape ? CSS.escape(s) : s);

  function describe(el) {
    const b = el.getBoundingClientRect(), r = react(el), screen = el.closest('[data-screen]');
    const text = (el.innerText || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    let extra = null; try { extra = window.__inspectExtra ? window.__inspectExtra(el, pt && pt.x, pt && pt.y) : null; } catch (e) {}
    return {
      page: location.href, screen: screen && screen.getAttribute('data-screen'), name: nameOf(el),
      tag: el.tagName.toLowerCase(), text, label: el.getAttribute('aria-label') || el.getAttribute('title') || '',
      testId: el.getAttribute('data-testid') || '', components: r.components, source: r.source,
      selector: selector(el), box: `${Math.round(b.left)}, ${Math.round(b.top)}, ${Math.round(b.width)} x ${Math.round(b.height)} px`,
      extra,
    };
  }

  function format(d, note, shot) {
    const L = [`# Screen pick: ${d.name}`, '', `**Note:** ${note || '(none)'}`, ''];
    const add = (k, v) => { if (v) L.push(`- ${k}: ${v}`); };
    add('Page', d.page); add('Screen', d.screen); add('Element', d.tag); add('Text', d.text && `"${d.text}"`);
    add('Label', d.label); add('Test id', d.testId); add('Components (inner to outer)', d.components.join(' < '));
    add('Source', d.source); add('Selector', '`' + d.selector + '`'); add('Box', d.box);
    add('Screenshot', shot);
    if (d.extra) L.push('- Extra: `' + JSON.stringify(d.extra).slice(0, 600) + '`');
    return L.join('\n') + '\n';
  }

  function show(el, boxSel, tagSel) {
    const box = $(boxSel), tag = $(tagSel);
    if (!el) { box.style.display = tag.style.display = 'none'; return; }
    const b = el.getBoundingClientRect();
    Object.assign(box.style, { display: 'block', left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px' });
    tag.textContent = nameOf(el);
    Object.assign(tag.style, { display: 'block', left: Math.max(4, b.left) + 'px', top: Math.max(4, b.top - 22) + 'px' });
  }

  function move(dir) {
    const cur = picked || hover; if (!cur) return;
    const next = dir > 0 ? cur.parentElement : cur.firstElementChild;
    if (!next || next === document.documentElement) return;
    if (picked) { picked = next; openCard(); } else { hover = next; show(hover, '.box', '.tag'); }
  }

  function openCard() {
    show(picked, '.box', '.tag');
    const d = describe(picked);
    $('.what').textContent = d.name + (d.screen ? ` on ${d.screen}` : '');
    $('.sub').textContent = [d.tag, d.text && `"${d.text.slice(0, 60)}"`, d.box].filter(Boolean).join(' · ');
    $('.msg').textContent = '';
    $('textarea').style.display = 'none';
    $('.card').style.display = 'block';
  }

  async function send() {
    if (!picked) return;
    const text = format(describe(picked), $('#note').value.trim());
    $('.msg').textContent = 'Sending...';
    let msg;
    try { msg = await opts.send(text, picked); }
    catch (e) {
      try { await navigator.clipboard.writeText(text); msg = 'Not sent (' + (e.message || e) + '). Copied, paste it to Claude.'; }
      catch (_) { msg = 'Not sent (' + (e.message || e) + ').'; }
    }
    $('.msg').textContent = msg || 'Sent to Claude.';
    $('#note').value = '';
    setTimeout(() => { picked = null; $('.card').style.display = 'none'; show(null, '.box', '.tag'); }, 1600);
  }

  // Copy mode: called straight from the tap, so the clipboard still counts it as the person's own action.
  async function copy() {
    if (!picked || busy) return;
    busy = true;
    const d = describe(picked), note = $('#note').value.trim();
    $('.msg').textContent = 'Copying...';
    let r;
    try { r = await opts.copy({ text: file => format(d, note, file), el: picked, point: pt }); }
    catch (e) { r = { copied: false, error: e.message || String(e), text: format(d, note) }; }
    busy = false;
    const saved = r.saved ? ' Screenshot saved.' : r.error ? ' Screenshot ' + r.error + '.' : '';
    if (!r.copied) {
      $('.msg').textContent = 'Could not copy. Copy the text below by hand, then paste it to Claude.' + saved;
      const t = $('textarea'); t.value = r.text; t.style.display = 'block'; t.focus(); t.select();
      return;
    }
    $('.msg').textContent = 'Copied' + (r.image ? ' with the picture' : '') + '. Paste it to Claude.' + saved;
    $('#note').value = '';
    const was = picked;
    setTimeout(() => { if (busy || picked !== was) return; picked = null; $('.card').style.display = 'none'; show(null, '.box', '.tag'); }, 3500);
  }

  const block = e => { if (on && !isUi(e.target)) { e.preventDefault(); e.stopPropagation(); } };
  function onMove(e) { if (!on || picked || isUi(e.target)) return; pt = { x: e.clientX, y: e.clientY }; hover = under(e.clientX, e.clientY); show(hover, '.box', '.tag'); }
  function onClick(e) {
    if (!on || isUi(e.target)) return; block(e);
    pt = { x: e.clientX, y: e.clientY }; picked = under(e.clientX, e.clientY); if (picked) openCard();
  }
  function onKey(e) {
    if (e.ctrlKey && e.shiftKey && e.code === 'Space') { e.preventDefault(); toggle(); return; }
    // Esc works wherever focus is (after tapping Point, focus sits on our own button): first it closes an open
    // card, then it leaves pointing.
    if (on && e.key === 'Escape') { e.preventDefault(); escape(); return; }
    if (!on || isUi(e.target)) return;
    if (e.key === 'ArrowUp') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(-1); }
  }

  function escape() {
    if (picked) { picked = null; $('.card').style.display = 'none'; show(null, '.box', '.tag'); }
    else toggle(false);
  }

  function toggle(want) {
    on = typeof want === 'boolean' ? want : !on;
    document.documentElement.style.cursor = on ? 'crosshair' : '';
    if (!on) { hover = picked = null; show(null, '.box', '.tag'); $('.card').style.display = 'none'; }
    const p = $('#point'); if (p) { p.classList.toggle('on', on); p.setAttribute('aria-pressed', on); p.textContent = on ? 'Pointing (Esc)' : 'Point'; }
  }

  window.Inspect = {
    start(o) {
      opts = o || {}; mount();
      addEventListener('pointermove', onMove, true);
      addEventListener('click', onClick, true);
      for (const t of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'dblclick', 'submit']) addEventListener(t, block, true);
      addEventListener('keydown', onKey, true);
    },
    toggle, format, describe,
  };
})();
