//! Component cards: for each distinct-looking control on a screen, read how it is built and how it
//! looks, then show it hovered, focused and pressed, keeping a picture, the changes and the motion.
//! Hover uses the hidden Chrome's own virtual pointer (never the real mouse); focus and pressed are
//! switched on directly in Chrome, which plays the same transitions a real person would see.
use crate::describe;
use crate::store::{Change, ComponentCard, Motion, StateShot};
use anyhow::Result;
use chromiumoxide::cdp::browser_protocol::css::{EnableParams as CssEnable, ForcePseudoStateParams};
use chromiumoxide::cdp::browser_protocol::dom::EnableParams as DomEnable;
use chromiumoxide::cdp::browser_protocol::page::{CaptureScreenshotFormat, Viewport};
use chromiumoxide::layout::Point;
use chromiumoxide::page::ScreenshotParams;
use chromiumoxide::Page;
use serde::Deserialize;
use std::collections::BTreeMap;
use std::path::Path;
use std::time::Duration;

const PROBE: &str = include_str!("probe.js");
/// Most cards made per screen: the start page gets more, later screens fewer.
pub const FIRST_SCREEN_LIMIT: usize = 16;
pub const OTHER_SCREEN_LIMIT: usize = 8;

#[derive(Deserialize)]
struct Group {
    index: usize,
    used: usize,
}

#[derive(Deserialize)]
struct Read {
    kind: String,
    family: String,
    parts: String,
    tag: String,
    role: String,
    html: String,
    name: String,
    style: BTreeMap<String, String>,
}

#[derive(Deserialize)]
struct Now {
    x: f64,
    y: f64,
    w: f64,
    h: f64,
    style: BTreeMap<String, String>,
}

#[derive(Deserialize)]
struct Moving {
    what: String,
    ms: u64,
    delay_ms: u64,
    easing: String,
}

async fn js<T: for<'de> Deserialize<'de>>(page: &Page, code: String) -> Option<T> {
    let raw: String = page.evaluate(code).await.ok()?.into_value().ok()?;
    serde_json::from_str(&raw).ok()
}

/// Makes cards for the marked controls on the page as it is now. Card ids continue from `start`.
pub async fn capture(page: &Page, dir: &Path, screen: &str, start: usize, limit: usize) -> Vec<ComponentCard> {
    let _ = page.execute(DomEnable::default()).await;
    let _ = page.execute(CssEnable::default()).await;
    if page.evaluate(PROBE).await.is_err() {
        return vec![];
    }
    let groups: Vec<Group> = js(page, format!("window.__as.groups({limit})")).await.unwrap_or_default();
    let mut cards = vec![];
    for g in groups {
        let id = format!("c-{:02}", start + cards.len() + 1);
        if let Ok(Some(card)) = one(page, dir, screen, &id, g.index, g.used).await {
            cards.push(card);
        }
    }
    let _ = page.evaluate("scrollTo(0,0)").await;
    // most telling first: components that react to hover, focus and pressing, then the most used
    cards.sort_by_key(|c| {
        let reacts = c.states.iter().filter(|s| !s.changes.is_empty()).count();
        let wide = c.look.get("width").map(|w| w.trim_end_matches("px").parse::<f64>().unwrap_or(0.0) > 600.0).unwrap_or(false);
        (wide, std::cmp::Reverse(reacts), std::cmp::Reverse(c.used))
    });
    cards
}

async fn one(page: &Page, dir: &Path, screen: &str, id: &str, i: usize, used: usize) -> Result<Option<ComponentCard>> {
    let Some(read) = js::<Read>(page, format!("window.__as.read({i})")).await else { return Ok(None) };
    let sel = format!("[data-as-i=\"{i}\"]");
    let el = page.find_element(sel.as_str()).await?;
    park(page).await;
    tokio::time::sleep(Duration::from_millis(250)).await;
    let Some(normal) = js::<Now>(page, format!("window.__as.now({i})")).await else { return Ok(None) };
    if normal.w < 4.0 || normal.h < 4.0 {
        return Ok(None);
    }
    let mut states = vec![StateShot {
        state: "normal".into(),
        picture: shot(page, dir, id, "normal", &normal).await?,
        changes: vec![],
        motion: vec![],
        said: String::new(),
    }];

    for state in ["hover", "focus", "pressed"] {
        match state {
            "hover" => {
                let _ = el.hover().await;
            }
            _ => {
                let classes = if state == "focus" { vec!["focus", "focus-visible"] } else { vec!["hover", "active"] };
                force(page, &el.node_id, classes).await;
            }
        }
        tokio::time::sleep(Duration::from_millis(40)).await;
        let moving: Vec<Moving> = js(page, format!("window.__as.motion({i})")).await.unwrap_or_default();
        let longest = moving.iter().map(|m| m.ms + m.delay_ms).max().unwrap_or(0).min(1500);
        tokio::time::sleep(Duration::from_millis(longest + 120)).await;
        let now = js::<Now>(page, format!("window.__as.now({i})")).await;
        if let Some(now) = now {
            let changes = diff(&normal.style, &now.style);
            let motion: Vec<Motion> = moving
                .into_iter()
                .filter(|m| m.ms > 0)
                .map(|m| Motion { what: m.what, ms: m.ms, delay_ms: m.delay_ms, easing: m.easing })
                .collect();
            let picture = shot(page, dir, id, state, &now).await?;
            let behind = normal.style.get("backdrop").cloned().unwrap_or_default();
            let said = describe::state(state, &changes, &motion, &behind);
            states.push(StateShot { state: state.into(), picture, changes, motion, said });
        }
        // back to normal before the next state
        if state == "hover" {
            park(page).await;
        } else {
            force(page, &el.node_id, vec![]).await;
        }
        tokio::time::sleep(Duration::from_millis(longest.min(600) + 80)).await;
    }

    let mut card = ComponentCard {
        id: id.into(),
        screen: screen.into(),
        kind: read.kind,
        family: read.family,
        name: read.name,
        used,
        tag: read.tag,
        role: read.role,
        parts: read.parts,
        html: read.html,
        look: read.style,
        states,
        explanation: String::new(),
        lessons: vec![],
    };
    card.explanation = describe::card(&card);
    card.lessons = describe::lessons(&card);
    Ok(Some(card))
}

/// Move the hidden Chrome's pointer to a quiet corner so nothing stays hovered.
async fn park(page: &Page) {
    let _ = page.move_mouse(Point { x: 1.0, y: 1.0 }).await;
}

async fn force(page: &Page, node: &chromiumoxide::cdp::browser_protocol::dom::NodeId, classes: Vec<&str>) {
    let params = ForcePseudoStateParams::new(node.clone(), classes.into_iter().map(String::from).collect::<Vec<_>>());
    let _ = page.execute(params).await;
}

/// A crisp picture of the component with a little space around it.
async fn shot(page: &Page, dir: &Path, id: &str, state: &str, at: &Now) -> Result<String> {
    let pad = 14.0;
    let clip = Viewport {
        x: (at.x - pad).max(0.0),
        y: (at.y - pad).max(0.0),
        width: (at.w + pad * 2.0).min(1280.0),
        height: (at.h + pad * 2.0).min(800.0),
        scale: 2.0,
    };
    let bytes = page
        .screenshot(ScreenshotParams::builder().format(CaptureScreenshotFormat::Png).clip(clip).build())
        .await?;
    let name = format!("{id}-{state}.png");
    std::fs::write(dir.join(&name), bytes)?;
    Ok(name)
}

/// What differs between two looks (sizes from layout are left out: they shift with neighbours).
fn diff(a: &BTreeMap<String, String>, b: &BTreeMap<String, String>) -> Vec<Change> {
    a.iter()
        .filter(|(k, _)| !["backdrop", "cursor"].contains(&k.as_str()))
        .filter_map(|(k, v)| {
            let to = b.get(k)?;
            (to != v).then(|| Change { what: k.clone(), from: v.clone(), to: to.clone() })
        })
        .collect()
}
