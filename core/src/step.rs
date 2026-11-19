//! One recorded step: act on a control (click, type a search, press Enter), wait until the screen is
//! still, then keep the before and after pictures, the clip, and any new screen it reached.
use crate::components;
use crate::store::{Control, Library, Run, Screen, Step};
use crate::tab::{same_site, short_hash, write_clip, Tab};
use anyhow::Result;
use chromiumoxide::element::Element;
use std::path::Path;
use std::time::Instant;

pub struct Ctx<'a> {
    pub lib: &'a Library,
    pub dir: &'a Path,
    pub origin: &'a str,
    pub run: &'a mut Run,
}

pub enum Act<'a> {
    Click,
    Type(&'a str),
    Enter,
}

/// What a step led to, so the explorer knows where to go next.
pub struct Led {
    pub outcome: &'static str,
    pub url: String,
    pub same_site: bool,
}

/// The same control on a freshly loaded page: same kind, same words, same address (the part after
/// "?" is left out, so "Log in" with a different return address on every page counts once).
pub fn key(c: &Control) -> (String, String, String) {
    let href = c.href.as_deref().unwrap_or("").split(['?', '#']).next().unwrap_or("").to_string();
    (c.kind.clone(), c.text.clone(), href)
}

/// Should the recorder leave this control alone? (signing out, deleting, downloads)
pub fn skip(c: &Control) -> bool {
    let t = c.text.to_lowercase();
    if ["log out", "logout", "sign out", "signout", "delete", "unsubscribe"].iter().any(|w| t.contains(w)) {
        return true;
    }
    if let Some(h) = &c.href {
        let h = h.to_lowercase();
        if h.starts_with("javascript:") || h.starts_with("mailto:") || h.starts_with("tel:") {
            return true;
        }
        if [".pdf", ".zip", ".dmg", ".exe", ".msi", ".apk"].iter().any(|e| h.split('?').next().unwrap_or("").ends_with(e)) {
            return true;
        }
    }
    false
}

fn explain(act: &Act, kind: &str, text: &str, outcome: &str, url_after: &str) -> String {
    let what = if text.is_empty() { format!("an unnamed {kind}") } else { format!("the \"{text}\" {kind}") };
    let did = match act {
        Act::Type(q) => format!("Typed \"{q}\" into {what}"),
        Act::Enter => format!("Pressed Enter in {what}"),
        Act::Click if kind == "input" || kind == "select" => format!("Clicked into {what}"),
        Act::Click => format!("Clicked {what}"),
    };
    match outcome {
        "new-screen" => format!("{did}; it opened a new screen ({url_after})."),
        "changed-in-place" => format!("{did}; the same screen changed (menu, panel, suggestions, message or animation)."),
        "nothing-changed" => format!("{did}; nothing visible changed."),
        _ => format!("{did}; it failed."),
    }
}

impl Ctx<'_> {
    /// Does one action on `el` and records it as the next step.
    pub async fn step(&mut self, tab: &mut Tab, el: &Element, c: &Control, act: Act<'_>, screen_before: &str) -> Result<Led> {
        let n = self.run.steps.len() + 1;
        let url_before = tab.url().await;
        let before = tab.picture().await?;
        tab.clear();
        let started = Instant::now();
        let done = async {
            match act {
                Act::Click => {
                    el.scroll_into_view().await?;
                    el.click().await?;
                }
                Act::Type(q) => {
                    el.scroll_into_view().await?;
                    el.click().await?;
                    el.type_str(q).await?;
                }
                Act::Enter => {
                    el.press_key("Enter").await?;
                }
            }
            anyhow::Ok(())
        }
        .await;
        tab.wait_still(started).await;
        let frames = tab.take();
        let after = tab.picture().await.unwrap_or_else(|_| before.clone());
        let url_after = tab.url().await;
        let code_after = tab.screen_code().await;
        let (before_name, after_name) = (format!("step-{n:02}-before.jpg"), format!("step-{n:02}-after.jpg"));
        std::fs::write(self.dir.join(&before_name), &before)?;
        std::fs::write(self.dir.join(&after_name), &after)?;

        let moved = url_after.split('#').next() != url_before.split('#').next();
        let outcome = if done.is_err() {
            "error"
        } else if moved && code_after != screen_before {
            "new-screen"
        } else if short_hash(&after) != short_hash(&before) || frames.len() > 2 {
            "changed-in-place"
        } else {
            "nothing-changed"
        };
        let inside = same_site(&url_after, self.origin);
        if outcome == "new-screen" && !self.run.screens.iter().any(|s| s.code == code_after) {
            self.new_screen(tab, &code_after, &url_after, &after, n, inside).await?;
        }
        let clip = if frames.is_empty() { None } else { write_clip(self.dir, &format!("step-{n:02}"), &before, &frames).ok() };
        if let Some(s) = self.run.screens.iter_mut().find(|s| s.code == screen_before) {
            if let Some(x) = s.controls.iter_mut().find(|x| key(x) == key(c)) {
                x.tried = true;
            }
        }
        self.run.steps.push(Step {
            n,
            action: match act {
                Act::Type(_) => "type".into(),
                Act::Enter => "press Enter".into(),
                Act::Click if c.kind == "input" || c.kind == "select" => "focus".into(),
                Act::Click => "click".into(),
            },
            control_kind: c.kind.clone(),
            control_text: c.text.clone(),
            screen_before: screen_before.into(),
            screen_after: code_after,
            url_before,
            url_after: url_after.clone(),
            outcome: outcome.into(),
            explanation: explain(&act, &c.kind, &c.text, outcome, &url_after),
            before: before_name,
            after: after_name,
            clip_ms: clip.as_ref().map(|c| c.1).unwrap_or(0),
            clip: clip.map(|c| c.0),
            frames: frames.len(),
        });
        self.lib.save(self.run)?;
        Ok(Led { outcome, url: url_after, same_site: inside })
    }

    /// Saves a screen the first time it is reached, with component cards when it is on the site.
    pub async fn new_screen(&mut self, tab: &mut Tab, code: &str, url: &str, pic: &[u8], first_step: usize, inside: bool) -> Result<()> {
        let name = format!("screen-{:02}.jpg", self.run.screens.len());
        std::fs::write(self.dir.join(&name), pic)?;
        let controls = if inside { tab.controls(self.origin).await } else { vec![] };
        if !controls.is_empty() {
            let (start, limit) = match self.run.screens.len() {
                0 => (0, components::FIRST_SCREEN_LIMIT),
                _ => (self.run.components.len(), components::OTHER_SCREEN_LIMIT),
            };
            let cards = components::capture(&tab.page, self.dir, code, start, limit, &self.run.components).await;
            self.run.components.extend(cards);
            // the cards' probe scrolled the page; list the controls again so they match the page
            tab.controls(self.origin).await;
        }
        self.run.screens.push(Screen {
            code: code.into(),
            url: url.into(),
            title: tab.page.get_title().await.ok().flatten().unwrap_or_default(),
            picture: name,
            first_step,
            controls,
        });
        self.lib.save(self.run)?;
        Ok(())
    }
}
