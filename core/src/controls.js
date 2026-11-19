// Lists every visible link, button and field on the page, marking each with data-as-i so the
// recorder can act on it. Search boxes are flagged so the recorder types a search into them.
(() => {
  document.querySelectorAll("[data-as-i]").forEach((e) => e.removeAttribute("data-as-i"));
  const els = [...document.querySelectorAll(
    "a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=menuitem],[role=menuitemradio],[role=option],[role=switch],[role=checkbox],[role=link],[role=combobox],[role=searchbox],summary,[aria-haspopup],[onclick]"
  )];
  const out = [];
  const seen = new Set();
  let i = 0;
  for (const e of els) {
    if (seen.has(e)) continue;
    seen.add(e);
    // a control inside another control (an icon inside a button) is the same control
    if (e.parentElement && e.parentElement.closest("a[href],button,[role=button]") && !/^(input|select|textarea)$/i.test(e.tagName)) continue;
    const r = e.getBoundingClientRect();
    const st = getComputedStyle(e);
    if (r.width < 2 || r.height < 2 || st.visibility === "hidden" || st.display === "none" || st.opacity === "0") continue;
    e.setAttribute("data-as-i", String(i));
    const tag = e.tagName.toLowerCase(), role = e.getAttribute("role") || "", type = (e.type || "").toLowerCase();
    const field = tag === "textarea" || (tag === "input" && !["submit", "button", "reset", "checkbox", "radio", "image", "file", "range", "color"].includes(type)) || role === "searchbox" || (role === "combobox" && tag !== "button");
    const kind = tag === "a" || role === "link" ? "link" : tag === "select" ? "select" : field ? "input" : "button";
    const hint = [type, role, e.name, e.id, e.placeholder, e.getAttribute("aria-label"), e.title].join(" ").toLowerCase();
    const search = field && (type === "search" || role === "searchbox" || role === "combobox" || /\b(q|query|search|find|keyword)/.test(hint) || !!e.closest("form[role=search],[role=search]"));
    const text = (e.innerText || e.getAttribute("aria-label") || e.value || e.placeholder || e.name || e.title || "").replace(/\s+/g, " ").trim().slice(0, 80);
    out.push({ index: i, kind, text, href: tag === "a" ? e.href : null, search });
    i++;
  }
  return JSON.stringify(out);
})()
