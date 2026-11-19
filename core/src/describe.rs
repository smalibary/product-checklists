//! Plain words for component cards: what a component is, what happens in each state, how it moves,
//! and design lessons a learner (or an AI copying it) should know. Written from the measured values.
use crate::store::{Change, ComponentCard, Motion};
use crate::values::{contrast, hex, luminance, px, rgba, transform, weight};

/// How a timing curve feels, in plain words.
pub fn easing(e: &str) -> String {
    match e {
        "linear" => "at a steady speed".into(),
        "ease" => "starting quickly and settling gently (the browser's default curve)".into(),
        "ease-in" => "starting slowly and speeding up".into(),
        "ease-out" => "starting fast and slowing to a stop, which feels responsive".into(),
        "ease-in-out" => "speeding up then slowing down, smooth at both ends".into(),
        e if e.starts_with("cubic-bezier") => bezier(e),
        e if e.starts_with("steps") => format!("in steps, not smoothly ({e})"),
        e => format!("on the curve {e}"),
    }
}

/// Reads a custom curve's shape: does it start fast or slow, end gently or sharply, overshoot?
fn bezier(e: &str) -> String {
    let n: Vec<f64> = e.trim_start_matches("cubic-bezier(").trim_end_matches(')').split(',')
        .filter_map(|s| s.trim().parse().ok()).collect();
    if n.len() != 4 {
        return format!("on the curve {e}");
    }
    let (x1, y1, x2, y2) = (n[0], n[1], n[2], n[3]);
    let fast_start = y1 > x1 + 0.05;
    let gentle_end = y2 > x2 + 0.05;
    let shape = match (fast_start, gentle_end) {
        (true, true) | (false, true) if x1 > y1 + 0.05 => "speeding up then slowing down, smooth at both ends",
        (_, true) => "starting fast and slowing to a stop, which feels responsive",
        (true, false) => "starting fast and ending sharply",
        (false, false) => "starting slowly and speeding up",
    };
    let bounce = if y1 > 1.0 || y2 > 1.0 || y1 < 0.0 || y2 < 0.0 { ", with a small overshoot that feels springy" } else { "" };
    format!("{shape}{bounce} (custom curve {e})")
}

/// A see-through colour as it really shows over what is behind it.
fn over(c: &str, behind: &str) -> String {
    match (rgba(c), rgba(behind)) {
        (Some((r, g, b, a)), Some((br, bg, bb, _))) if a < 1.0 => format!(
            "rgb({}, {}, {})",
            r * a + br * (1.0 - a), g * a + bg * (1.0 - a), b * a + bb * (1.0 - a)
        ),
        _ => c.to_string(),
    }
}

fn change_words(c: &Change, behind: &str) -> Option<String> {
    let darker = |a: &str, b: &str| match (luminance(&over(a, behind)), luminance(&over(b, behind))) {
        (Some(x), Some(y)) if y < x - 0.01 => "darker",
        (Some(x), Some(y)) if y > x + 0.01 => "lighter",
        _ => "a different shade",
    };
    Some(match c.what.as_str() {
        "background-color" => format!("the background turns {} ({} → {})", darker(&c.from, &c.to), hex(&c.from), hex(&c.to)),
        "color" => format!("the text turns {} ({} → {})", darker(&c.from, &c.to), hex(&c.from), hex(&c.to)),
        "border-top-color" => format!("the border colour changes ({} → {})", hex(&c.from), hex(&c.to)),
        "outline-style" if c.to != "none" => "an outline ring appears around it".into(),
        "outline-style" => "the outline ring goes away".into(),
        "outline-color" | "outline-offset" | "outline-width" => return None,
        "box-shadow" if c.from == "none" => "a shadow appears under it".into(),
        "box-shadow" if c.to == "none" => "its shadow disappears".into(),
        "box-shadow" => "its shadow changes (often a ring or a deeper lift)".into(),
        "opacity" => format!("it fades to {}%", (c.to.parse::<f64>().unwrap_or(1.0) * 100.0).round()),
        "text-decoration-line" if c.to.contains("underline") => "an underline appears".into(),
        "text-decoration-line" => "the underline goes away".into(),
        "transform" => {
            let (s, x, y) = transform(&c.to).unwrap_or((1.0, 0.0, 0.0));
            let mut bits = vec![];
            if (s - 1.0).abs() > 0.005 {
                bits.push(if s > 1.0 { format!("grows to {:.0}%", s * 100.0) } else { format!("shrinks to {:.0}%", s * 100.0) });
            }
            if y.abs() >= 0.5 {
                bits.push(if y < 0.0 { format!("lifts up {:.0}px", -y) } else { format!("moves down {:.0}px", y) });
            }
            if x.abs() >= 0.5 {
                bits.push(format!("slides {:.0}px {}", x.abs(), if x > 0.0 { "right" } else { "left" }));
            }
            if bits.is_empty() { return None }
            format!("it {}", bits.join(" and "))
        }
        "border-top-width" => format!("the border gets {} ({} → {})", if px(&c.to) > px(&c.from) { "thicker" } else { "thinner" }, c.from, c.to),
        "font-weight" => "the text becomes bolder".into(),
        "filter" => "a filter changes how it looks (brightness, blur or similar)".into(),
        "background-image" => "its background picture or gradient changes".into(),
        _ => return None,
    })
}

/// One sentence for one state.
pub fn state(state: &str, changes: &[Change], motion: &[Motion], behind: &str) -> String {
    let when = match state {
        "hover" => "When the pointer is over it",
        "focus" => "When it is reached with the keyboard (focus)",
        "pressed" => "While it is being pressed",
        _ => "Normally",
    };
    let words: Vec<String> = changes.iter().filter_map(|c| change_words(c, behind)).collect();
    if words.is_empty() {
        return format!("{when}, nothing visible changes.");
    }
    let mut s = format!("{when}, {}.", join(&words));
    if let Some(m) = motion.iter().max_by_key(|m| m.ms) {
        let secs = m.ms as f64 / 1000.0;
        s.push_str(&format!(" The change takes {secs:.2} s, {}.", easing(&m.easing)));
        if m.delay_ms > 0 {
            s.push_str(&format!(" It waits {} ms before starting.", m.delay_ms));
        }
    } else {
        s.push_str(" It switches instantly, with no animation.");
    }
    s
}

fn join(words: &[String]) -> String {
    match words.len() {
        1 => words[0].clone(),
        n => format!("{} and {}", words[..n - 1].join(", "), words[n - 1]),
    }
}

/// The opening paragraph: what it is and how it looks at rest, then each state.
pub fn card(c: &ComponentCard) -> String {
    let l = |k: &str| c.look.get(k).cloned().unwrap_or_default();
    let label = if c.name.is_empty() { String::new() } else { format!(" labelled \"{}\"", c.name) };
    let mut s = format!("A {}{label} ({}).", c.family, c.parts);
    let bg = l("background-color");
    if rgba(&bg).map(|x| x.3 > 0.0).unwrap_or(false) {
        s.push_str(&format!(" Background {},", hex(&bg)));
    } else {
        s.push_str(" No background of its own,");
    }
    s.push_str(&format!(
        " text {} in {} {} at {}px, {} by {}.",
        hex(&l("color")), l("font-family"), weight(&l("font-weight")), px(&l("font-size")).round(), l("width"), l("height")
    ));
    let r = px(&l("border-radius"));
    if r >= px(&l("height")) / 2.0 && r > 0.0 {
        s.push_str(" Fully rounded ends (a pill shape).");
    } else if r > 0.0 {
        s.push_str(&format!(" Corners rounded {r:.0}px."));
    } else {
        s.push_str(" Square corners.");
    }
    if c.used > 1 {
        s.push_str(&format!(" {} controls on this screen look exactly like this one.", c.used));
    }
    for st in c.states.iter().skip(1) {
        s.push(' ');
        s.push_str(&st.said);
    }
    s
}

/// Design lessons: what this component does well or poorly.
pub fn lessons(c: &ComponentCard) -> Vec<String> {
    let mut out = vec![];
    let get = |name: &str| c.states.iter().find(|s| s.state == name);
    let clickable = c.kind != "text field" && c.kind != "select";
    if let Some(h) = get("hover") {
        if h.changes.is_empty() && clickable {
            out.push("No hover feedback: nothing tells people it is clickable until they click it.".into());
        } else if let Some(m) = h.motion.iter().map(|m| m.ms).max() {
            out.push(match m {
                0..=90 => format!("Hover change in {m} ms: almost instant, which reads as snappy but can look abrupt."),
                91..=300 => format!("Hover change in {m} ms: quick enough to feel instant, smooth enough not to flash. A good range is 100 to 300 ms."),
                _ => format!("Hover change in {m} ms: on the slow side; past about 300 ms it can feel laggy."),
            });
        } else if !h.changes.is_empty() {
            out.push("Hover changes with no animation: clear, but a short transition (100 to 200 ms) usually feels more polished.".into());
        }
    }
    if let Some(f) = get("focus") {
        if f.changes.is_empty() {
            out.push("No visible focus look: someone using the keyboard cannot see where they are. This is an accessibility gap.".into());
        } else {
            out.push("Visible focus look: keyboard users can see where they are.".into());
        }
    }
    if let Some(p) = get("pressed") {
        let hover_same = get("hover").map(|h| h.changes.len() == p.changes.len()).unwrap_or(false);
        if p.changes.iter().any(|c| c.what == "transform") {
            out.push("It moves when pressed, like a physical button: a small touch that makes clicks feel real.".into());
        } else if !p.changes.is_empty() && !hover_same {
            out.push("It has its own pressed look, so a click feels acknowledged.".into());
        }
    }
    let h = px(c.look.get("height").map(String::as_str).unwrap_or("0"));
    if h > 0.0 && h < 24.0 {
        out.push(format!("Small target ({h:.0}px tall): hard to hit on a phone. 44px is the usual comfortable size; 24px is the minimum."));
    }
    if c.parts == "icon only" && !c.html.contains("aria-label") && !c.html.contains("title=") {
        out.push("Icon with no written name: screen readers cannot say what it does (add an aria-label).".into());
    }
    let fg = c.look.get("color").cloned().unwrap_or_default();
    let bg = c.look.get("background-color").filter(|b| rgba(b).map(|x| x.3 >= 1.0).unwrap_or(false)).cloned()
        .or_else(|| c.look.get("backdrop").cloned())
        .unwrap_or_default();
    if let Some(r) = contrast(&fg, &bg) {
        let large = px(c.look.get("font-size").map(String::as_str).unwrap_or("16")) >= 18.5;
        let need = if large { 3.0 } else { 4.5 };
        if r < need {
            out.push(format!("Low text contrast ({r:.1}:1): {need}:1 is the readable minimum for this size."));
        } else {
            out.push(format!("Text contrast {r:.1}:1, above the {need}:1 readability minimum."));
        }
    }
    out
}
