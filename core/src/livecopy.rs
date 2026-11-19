//! Live copy: rebuilds a recorded component as its own small web page that really works. Hover,
//! keyboard focus and pressing replay the looks and motion measured on the real site, and the page
//! can also hold one state on request (class f-hover, f-focus or f-pressed on the html element).
use anyhow::Result;
use serde::Deserialize;
use std::collections::BTreeMap;
use std::fmt::Write as _;
use std::path::Path;

pub type Styles = Vec<BTreeMap<String, String>>;

#[derive(Deserialize)]
pub struct Copy {
    pub html: String,
    pub styles: Styles,
    pub fonts: Vec<String>,
    pub backdrop: String,
}

fn n(k: usize) -> String {
    format!("[data-as-n=\"{k}\"]")
}

fn block(out: &mut String, sel: &str, props: &BTreeMap<String, String>, root: bool) {
    let _ = write!(out, "{sel}{{");
    for (p, v) in props {
        if p.starts_with("::") || v.is_empty() {
            continue;
        }
        let v = if root && p == "position" && ["absolute", "fixed", "sticky"].contains(&v.as_str()) { "relative" } else { v };
        let _ = write!(out, "{p}:{v};");
    }
    if root {
        out.push_str("margin:0;top:auto;left:auto;right:auto;bottom:auto;");
    }
    out.push_str("}\n");
}

fn pseudo(out: &mut String, sel: &str, json: &str) {
    if let Ok(m) = serde_json::from_str::<BTreeMap<String, String>>(json) {
        block(out, sel, &m, false);
    }
}

/// Selectors for one node in one state: the real one (:hover...) and the held one (.f-hover...).
fn state_sel(state: &str, k: usize, suffix: &str) -> String {
    let (pc, cls) = match state {
        "hover" => (":hover", "f-hover"),
        "focus" => (":focus-visible", "f-focus"),
        _ => (":active", "f-pressed"),
    };
    if k == 0 {
        format!("{}{pc}{suffix},.{cls} {}{suffix}", n(0), n(0))
    } else {
        format!("{}{pc} {}{suffix},.{cls} {}{suffix}", n(0), n(k), n(k))
    }
}

pub fn css(copy: &Copy, states: &[(String, Styles)]) -> String {
    let mut out = String::new();
    for f in &copy.fonts {
        out.push_str(f);
        out.push('\n');
    }
    for (k, props) in copy.styles.iter().enumerate() {
        block(&mut out, &n(k), props, k == 0);
        for pe in ["::before", "::after"] {
            if let Some(j) = props.get(pe) {
                pseudo(&mut out, &format!("{}{pe}", n(k)), j);
            }
        }
    }
    for (state, styles) in states {
        for (k, (now, base)) in styles.iter().zip(copy.styles.iter()).enumerate() {
            let changed: BTreeMap<String, String> = now
                .iter()
                .filter(|(p, v)| !p.starts_with("::") && p.as_str() != "transition" && base.get(*p) != Some(v))
                .map(|(p, v)| (p.clone(), v.clone()))
                .collect();
            if !changed.is_empty() {
                block(&mut out, &state_sel(state, k, ""), &changed, false);
            }
            for pe in ["::before", "::after"] {
                if let Some(j) = now.get(pe).filter(|j| base.get(pe) != Some(j)) {
                    pseudo(&mut out, &state_sel(state, k, pe), j);
                }
            }
        }
    }
    out
}

/// Writes `<id>.html` next to the pictures and returns its name.
pub fn write(dir: &Path, id: &str, copy: &Copy, states: &[(String, Styles)]) -> Result<String> {
    let page = format!(
        r#"<!doctype html><html><head><meta charset="utf-8"><title>{id}</title><style>
html,body{{margin:0;min-height:100%}}
body{{display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box;background:{bg}}}
{css}</style></head><body>{html}
<script>
// a copy, not the real site: clicks and forms stay here
addEventListener("click",e=>e.preventDefault(),true);
addEventListener("submit",e=>e.preventDefault(),true);
</script></body></html>"#,
        bg = copy.backdrop,
        css = css(copy, states),
        html = copy.html,
    );
    let name = format!("{id}.html");
    std::fs::write(dir.join(&name), page)?;
    Ok(name)
}
