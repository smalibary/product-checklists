// Reads a sign-up form after controls.js has marked the page: every field with what the audit needs
// (keyboard type, password-manager marks, label, size), the button that sends it, the error messages
// on screen, and whether a robot check is showing. Returns JSON.
(() => {
  const txt = (s) => (s || "").replace(/\s+/g, " ").trim().slice(0, 120);
  const shown = (e) => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 1 && r.height > 1 && st.visibility !== "hidden" && st.display !== "none"; };
  const fields = [];
  for (const e of document.querySelectorAll("[data-as-i]")) {
    const tag = e.tagName.toLowerCase();
    if (!/^(input|textarea|select)$/.test(tag)) continue;
    const type = (e.type || tag).toLowerCase();
    if (["submit", "button", "reset", "image", "hidden"].includes(type)) continue;
    const ac = (e.getAttribute("autocomplete") || "").toLowerCase();
    const hint = [type, e.name, e.id, e.placeholder, e.getAttribute("aria-label"), ac].join(" ").toLowerCase();
    let label = e.labels && e.labels.length ? txt(e.labels[0].innerText) : "";
    const by = e.getAttribute("aria-labelledby");
    if (!label && by) label = txt(document.getElementById(by.split(" ")[0])?.innerText);
    const desc = (e.getAttribute("aria-describedby") || "").split(" ").map((id) => txt(document.getElementById(id)?.innerText)).filter(Boolean).join(" | ");
    const role = type === "password" ? "password" : type === "checkbox" ? "checkbox" : type === "email" || /e-?mail/.test(hint) ? "email"
      : type === "tel" || /phone|mobile/.test(hint) ? "phone" : /one-time-code|\botp\b|\bcode\b/.test(hint) ? "code"
      : /user ?name|handle|login/.test(hint) ? "username" : /first|given/.test(hint) ? "first-name"
      : /last|family|surname/.test(hint) ? "last-name" : /name/.test(hint) ? "name" : "other";
    const r = e.getBoundingClientRect();
    fields.push({
      index: +e.getAttribute("data-as-i"), role, type, inputmode: e.getAttribute("inputmode") || "", autocomplete: ac,
      autocapitalize: e.getAttribute("autocapitalize") || "", autocorrect: e.getAttribute("autocorrect") || "",
      spellcheck: e.getAttribute("spellcheck") || "", label, placeholder: e.placeholder || "", aria_label: e.getAttribute("aria-label") || "",
      described_by: desc, required: !!e.required, invalid: e.getAttribute("aria-invalid") === "true",
      checked: !!e.checked, filled: (e.value || "").length > 0, w: Math.round(r.width), h: Math.round(r.height),
    });
  }
  // the button that sends the form: a submit button in the same form first, never a "with Google" button
  const social = /google|apple|facebook|github|twitter|microsoft|linkedin|\bx\b/i;
  const words = /create|sign ?up|join|register|continue|next|get started|submit/i;
  const first = fields.find((f) => f.role !== "checkbox");
  const form = first ? document.querySelector(`[data-as-i="${first.index}"]`)?.closest("form") : null;
  const buttons = [...document.querySelectorAll("[data-as-i]")]
    .filter((e) => /^(button|input)$/i.test(e.tagName) || e.getAttribute("role") === "button")
    .filter((e) => !/^input$/i.test(e.tagName) || ["submit", "button"].includes((e.type || "").toLowerCase()))
    .filter((e) => !social.test(e.innerText || e.value || e.getAttribute("aria-label") || ""));
  const inForm = (e) => form && form.contains(e);
  const pick = buttons.find((e) => inForm(e) && e.type === "submit") || buttons.find((e) => inForm(e) && words.test(e.innerText || e.value || ""))
    || buttons.find((e) => words.test(e.innerText || e.value || ""));
  let submit = null;
  if (pick) {
    const r = pick.getBoundingClientRect();
    submit = { index: +pick.getAttribute("data-as-i"), text: txt(pick.innerText || pick.value),
      disabled: !!pick.disabled || pick.getAttribute("aria-disabled") === "true",
      w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(innerHeight - r.bottom) };
  }
  const errors = [...document.querySelectorAll("[role=alert],[aria-live],[class*=error i],[class*=invalid i]")]
    .filter(shown).map((e) => txt(e.innerText)).filter(Boolean);
  // a robot check that is showing (a check that only runs in the background is noted, not a stop)
  const frames = [...document.querySelectorAll("iframe")].filter(shown).map((f) => {
    const r = f.getBoundingClientRect();
    return { src: f.src || "", w: r.width, h: r.height, badge: !!f.closest(".grecaptcha-badge") };
  });
  const robotFrame = /recaptcha|hcaptcha|challenges\.cloudflare|turnstile|arkoselabs|funcaptcha/;
  const challenge = frames.some((f) => robotFrame.test(f.src) && !f.badge && f.w >= 250 && f.h >= 60)
    || /verify you are human|are you a robot|not a robot|complete the security check/i.test(document.body?.innerText || "");
  const background_check = !!document.querySelector("script[src*=recaptcha],script[src*=hcaptcha],script[src*=turnstile],.grecaptcha-badge");
  return JSON.stringify({
    url: location.href, fields, submit, errors: [...new Set(errors)].slice(0, 12), challenge, background_check,
    rtl: getComputedStyle(document.documentElement).direction === "rtl",
  });
})()
