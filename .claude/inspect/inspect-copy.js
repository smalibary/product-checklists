// Copy mode for inspect mode (used by the dev server hookups; the mockup page sends live instead).
// On Copy: the file name is chosen first so the text can name the screenshot, the text is copied while the tap still
// counts as the person's own action, then the screenshot is drawn and saved next to the pick in .claude/inbox/.
// The screenshot is the whole window as it looks, inspect mode's own layer left out, the picked piece boxed and the
// tapped point ringed. It is drawn by html-to-image, loaded only when a screenshot is taken.
// Clipboard: navigator.clipboard where the page is secure (localhost), with the picture too when allowed; on a plain
// http page (a phone on the Wi-Fi) the old hidden-box copy. If both refuse, the caller shows the text to copy by hand.
//   InspectCopy({ inbox: 'C:/project/.claude/inbox', lib: '/__inspect/html-to-image.js', save: async ({ name, text, png }) => {} })
// returns copy({ text: name => text, el, point }) -> { copied, image, saved, text, error }.
(function () {
  if (window.InspectCopy) return;
  const COLOUR = '#2563eb';

  function stamp(d = new Date()) {
    const p = n => String(n).padStart(2, '0');
    return `pick-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }

  let libLoad = null;
  function loadLib(src) {
    if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
    return libLoad || (libLoad = new Promise((done, fail) => {
      const s = document.createElement('script');
      s.src = src; s.setAttribute('data-inspect-ui', '');
      s.onload = () => (window.htmlToImage ? done(window.htmlToImage) : fail(new Error('screenshot tool missing')));
      s.onerror = () => { libLoad = null; fail(new Error('screenshot tool did not load')); };
      document.head.appendChild(s);
    }));
  }

  async function shot(lib, box, point) {
    const { toCanvas } = await loadLib(lib);
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const canvas = await toCanvas(document.body, {
      pixelRatio: ratio, width: innerWidth, height: innerHeight,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      // The page as it sits on screen, not from its top.
      style: { transform: `translate(${-scrollX}px, ${-scrollY}px)` },
      filter: n => !(n instanceof Element && n.hasAttribute('data-inspect-ui')),
    });
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = COLOUR; ctx.lineWidth = 3 * ratio;
    ctx.strokeRect(box.left * ratio, box.top * ratio, box.width * ratio, box.height * ratio);
    if (point) { ctx.beginPath(); ctx.arc(point.x * ratio, point.y * ratio, 14 * ratio, 0, Math.PI * 2); ctx.stroke(); }
    return new Promise((done, fail) => canvas.toBlob(b => (b ? done(b) : fail(new Error('screenshot not encoded'))), 'image/png'));
  }

  // The old way: works on plain http pages, but only inside the tap itself (before any wait).
  function oldCopy(text) {
    const t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.setAttribute('data-inspect-ui', '');
    Object.assign(t.style, { position: 'fixed', top: '0', left: '0', opacity: '0', pointerEvents: 'none' });
    document.body.appendChild(t); t.select(); t.setSelectionRange(0, text.length);
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    t.remove(); return ok;
  }

  window.InspectCopy = opts => async ({ text: build, el, point }) => {
    const name = stamp();
    const file = opts.inbox.replace(/[\\/]+$/, '') + '/' + name + '.png';
    const text = build(file);
    const box = el.getBoundingClientRect();
    const png = shot(opts.lib, box, point);
    png.catch(() => {});
    const out = { text, copied: false, image: false, saved: false, error: null };

    const cb = window.isSecureContext && navigator.clipboard;
    if (!cb) out.copied = oldCopy(text);
    else {
      // The text and the picture together where allowed; the picture is still being drawn, so it goes in as a promise.
      if (window.ClipboardItem && cb.write) {
        try {
          await cb.write([new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }), 'image/png': png })]);
          out.copied = out.image = true;
        } catch (e) {}
      }
      if (!out.copied) { try { await cb.writeText(text); out.copied = true; } catch (e) { out.copied = oldCopy(text); } }
    }

    let blob = null;
    try { blob = await png; } catch (e) { out.error = 'screenshot not taken (' + (e.message || e) + ')'; }
    try { await opts.save({ name, text, png: blob }); out.saved = !!blob; }
    catch (e) { out.error = 'not saved (' + (e.message || e) + ')'; }
    return out;
  };
})();
