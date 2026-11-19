// Runs inside the recorded page. Reads how components are built and how they look, so the
// recorder can make a component card for each. Exposes window.__as with three helpers.
(() => {
  const PROPS = [
    "display", "width", "height", "padding", "gap", "background-color", "background-image", "color",
    "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-transform",
    "text-decoration-line", "border-top-width", "border-top-style", "border-top-color", "border-radius",
    "box-shadow", "outline-width", "outline-style", "outline-color", "outline-offset", "opacity",
    "transform", "cursor", "filter",
  ];
  const opaque = (c) => c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
  const backdrop = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = getComputedStyle(e).backgroundColor;
      if (opaque(c)) return c;
    }
    return "rgb(255, 255, 255)";
  };
  const style = (el) => {
    const st = getComputedStyle(el);
    const out = {};
    for (const p of PROPS) out[p] = st.getPropertyValue(p);
    out["background-image"] = out["background-image"].slice(0, 200);
    out["font-family"] = out["font-family"].split(",")[0].replace(/["']/g, "").trim();
    out["backdrop"] = backdrop(el.parentElement);
    const r = el.getBoundingClientRect();
    out["width"] = Math.round(r.width) + "px";
    out["height"] = Math.round(r.height) + "px";
    return out;
  };
  const parts = (el) => {
    const icon = !!el.querySelector("svg,img,i[class*=icon],span[class*=icon]") || /^(svg|img)$/i.test(el.tagName);
    const text = (el.innerText || "").trim().length > 0;
    return icon && text ? "icon + label" : icon ? "icon only" : text ? "label only" : "empty";
  };
  const kindOf = (el) => {
    const tag = el.tagName.toLowerCase(), role = el.getAttribute("role"), type = (el.type || "").toLowerCase();
    if (role === "tab") return "tab";
    if (role === "menuitem") return "menu item";
    if (tag === "select") return "select";
    if (tag === "textarea" || (tag === "input" && !["submit", "button", "reset", "checkbox", "radio"].includes(type))) return "text field";
    if (tag === "input" && (type === "checkbox" || type === "radio")) return type;
    if (tag === "a") return "link";
    return "button";
  };
  const family = (el, s, kind) => {
    if (kind !== "button" && kind !== "link") return kind;
    const p = parts(el);
    const filled = opaque(s["background-color"]) && s["background-color"] !== s.backdrop || s["background-image"] !== "none";
    const bordered = parseFloat(s["border-top-width"]) > 0 && s["border-top-style"] !== "none";
    if (p === "icon only") return kind === "link" ? "icon link" : "icon button";
    if (filled) return kind === "link" ? "button-style link" : "filled button";
    if (bordered) return kind === "link" ? "outlined link" : "outlined button";
    return kind === "link" ? "text link" : "ghost button";
  };
  const html = (el) => {
    const c = el.cloneNode(true);
    c.removeAttribute("data-as-i");
    c.querySelectorAll("[data-as-i]").forEach((x) => x.removeAttribute("data-as-i"));
    c.querySelectorAll("svg").forEach((x) => { x.innerHTML = "…"; });
    return c.outerHTML.replace(/\s+/g, " ").slice(0, 1200);
  };
  // ---- live copy: every part of the component with the styles needed to rebuild it elsewhere ----
  const FULL = [
    "display", "position", "box-sizing", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding-top", "padding-right", "padding-bottom", "padding-left", "flex-direction", "flex-wrap",
    "justify-content", "align-items", "align-self", "flex-grow", "flex-shrink", "flex-basis", "gap", "order",
    "grid-template-columns", "grid-template-rows", "overflow-x", "overflow-y", "white-space", "text-overflow",
    "text-align", "vertical-align", "font-family", "font-size", "font-weight", "font-style", "line-height",
    "letter-spacing", "text-transform", "text-decoration-line", "text-decoration-color", "text-underline-offset",
    "color", "background-color", "background-image", "background-size", "background-position", "background-repeat",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-style",
    "border-right-style", "border-bottom-style", "border-left-style", "border-top-color", "border-right-color",
    "border-bottom-color", "border-left-color", "border-top-left-radius", "border-top-right-radius",
    "border-bottom-right-radius", "border-bottom-left-radius", "box-shadow", "outline-width", "outline-style",
    "outline-color", "outline-offset", "opacity", "transform", "transform-origin", "transition", "filter",
    "backdrop-filter", "cursor", "fill", "stroke", "stroke-width", "visibility", "object-fit", "-webkit-font-smoothing",
  ];
  const SIZED = (el) => el === el.__asRoot || /^(svg|img|video|canvas|input|select|textarea)$/i.test(el.tagName) ||
    (el.namespaceURI === "http://www.w3.org/2000/svg") || !(el.textContent || "").trim();
  const nodes = (root) => [root, ...root.querySelectorAll("*")].slice(0, 150);
  const full = (root) => nodes(root).map((el) => {
    const st = getComputedStyle(el), o = {};
    for (const p of FULL) o[p] = st.getPropertyValue(p);
    if (SIZED(el)) {
      const r = el.getBoundingClientRect();
      o.width = r.width + "px";
      o.height = r.height + "px";
    }
    // decorations drawn by CSS before or after the content (arrows, underlines, dots)
    for (const pe of ["before", "after"]) {
      const ps = getComputedStyle(el, "::" + pe);
      const content = ps.getPropertyValue("content");
      if (!content || content === "none" || content === "normal") continue;
      const m = { content, position: ps.position, top: ps.top, right: ps.right, bottom: ps.bottom, left: ps.left, width: ps.width, height: ps.height };
      for (const p of FULL) m[p] = ps.getPropertyValue(p);
      o["::" + pe] = JSON.stringify(m);
    }
    return o;
  });
  const fontFaces = (families) => {
    const out = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of rules) {
        if (r.type !== 5) continue;
        const fam = r.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
        if (!families.has(fam)) continue;
        const base = sheet.href || location.href;
        out.push(r.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, (_, q, u) => `url("${new URL(u, base).href}")`));
      }
    }
    return out.slice(0, 12);
  };
  const clone = (root) => {
    const c = root.cloneNode(true);
    const src = nodes(root), dst = nodes(c);
    dst.forEach((el, k) => {
      el.setAttribute("data-as-n", String(k));
      el.removeAttribute("data-as-i");
      for (const a of [...el.attributes]) {
        if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value) || a.name === "class" || a.name === "style") el.removeAttribute(a.name);
      }
      if (el.tagName === "A" && src[k].href) el.setAttribute("href", src[k].href);
      if (el.tagName === "IMG" && src[k].currentSrc) { el.setAttribute("src", src[k].currentSrc); el.removeAttribute("srcset"); }
    });
    c.querySelectorAll("script,noscript,iframe,object,embed").forEach((x) => x.remove());
    // parts past the first 150 are dropped so every remaining part has its styles
    c.querySelectorAll(":not([data-as-n])").forEach((x) => x.remove());
    return c.outerHTML;
  };

  window.__as = {
    copy(i) {
      const el = document.querySelector(`[data-as-i="${i}"]`);
      if (!el) return "null";
      el.__asRoot = el;
      const styles = full(el);
      const families = new Set(styles.map((s) => s["font-family"].split(",")[0].replace(/["']/g, "").trim()));
      return JSON.stringify({ html: clone(el), styles, fonts: fontFaces(families), backdrop: backdrop(el.parentElement) });
    },
    // the same styles, read again in the current state (hover, focus or pressed)
    full(i) {
      const el = document.querySelector(`[data-as-i="${i}"]`);
      return el ? JSON.stringify(full(el)) : "null";
    },
    // one representative per group of identical-looking controls, most noticeable first
    groups(limit) {
      const groups = new Map();
      for (const el of document.querySelectorAll("[data-as-i]")) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const s = style(el), kind = kindOf(el);
        const key = [kind, family(el, s, kind), s["background-color"], s.color, s["font-size"], s["font-weight"],
          s["border-radius"], s["border-top-width"], s.padding, parts(el)].join("|");
        const g = groups.get(key);
        if (g) g.used++;
        else groups.set(key, { index: Number(el.getAttribute("data-as-i")), used: 1, area: r.width * r.height, kind });
      }
      const rank = { button: 0, "text field": 1, select: 1, tab: 2, checkbox: 2, radio: 2, "menu item": 2, link: 3 };
      return JSON.stringify([...groups.values()]
        .sort((a, b) => (rank[a.kind] ?? 4) - (rank[b.kind] ?? 4) || b.area - a.area)
        .slice(0, limit));
    },
    // build + look of one control, after scrolling it to the middle of the view
    read(i) {
      const el = document.querySelector(`[data-as-i="${i}"]`);
      if (!el) return "null";
      el.scrollIntoView({ block: "center", inline: "center" });
      const s = style(el), kind = kindOf(el);
      return JSON.stringify({
        kind, family: family(el, s, kind), parts: parts(el), tag: el.tagName.toLowerCase(),
        role: el.getAttribute("role") || "", html: html(el),
        name: (el.innerText || el.getAttribute("aria-label") || el.value || el.placeholder || el.title || "").replace(/\s+/g, " ").trim().slice(0, 60),
        style: s,
      });
    },
    // where it sits now (for cropping a picture) and how it looks now
    now(i) {
      const el = document.querySelector(`[data-as-i="${i}"]`);
      if (!el) return "null";
      const r = el.getBoundingClientRect();
      return JSON.stringify({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, style: style(el) });
    },
    // what is moving on it right now (transitions and animations), with timings
    motion(i) {
      const el = document.querySelector(`[data-as-i="${i}"]`);
      if (!el || !el.getAnimations) return "[]";
      return JSON.stringify(el.getAnimations({ subtree: true }).map((a) => {
        const t = a.effect.getComputedTiming(), tm = a.effect.getTiming();
        // CSS keeps the transition's curve on the keyframes, not on the timing
        const kf = (a.effect.getKeyframes && a.effect.getKeyframes()[0]) || {};
        const easing = kf.easing && kf.easing !== "linear" ? kf.easing : tm.easing || "linear";
        return {
          what: a.transitionProperty || a.animationName || "animation",
          ms: Math.round(Number(t.duration) || 0), delay_ms: Math.round(tm.delay || 0), easing,
          on_child: a.effect.target !== el,
        };
      }));
    },
  };
  return "ok";
})()
