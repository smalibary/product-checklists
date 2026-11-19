//! Sign-up recording at phone size. Finds the way into sign-up, triggers each error on purpose (send
//! everything empty, a wrong email, a weak password), then fills good test details. It presses the
//! final button only when a test inbox address is given. Each form screen's measurements (fields,
//! button, errors shown) are kept for the audit. At a robot check it stops and says so; it never
//! gets around one.
use crate::chrome::Chrome;
use crate::step::{Act, Ctx, Led};
use crate::store::{Control, Library, Run};
use crate::tab::{origin_of, Tab};
use anyhow::Result;
use serde::Deserialize;

const FIELDS: &str = include_str!("fields.js");
/// Words on the way into sign-up, best first.
const WAY_IN: &[&str] = &[
    "sign up with email", "continue with email", "use email", "sign up", "signup", "create account",
    "create an account", "create your account", "join", "register", "get started",
];
const SOCIAL: &[&str] = &["google", "apple", "facebook", "github", "twitter", "microsoft", "linkedin"];
/// Buttons that use sign-up words but lead somewhere else.
const NOT_SIGN_UP: &[&str] = &["waitlist", "wait list", "newsletter", "team", "career", "hiring", "webinar", "event", "pro"];
/// A menu button (often three lines on phones), opened when sign-up is not on the screen itself.
const MENU: &[&str] = &["menu", "navigation", "open nav", "toggle nav"];
const TEST_PASSWORD: &str = "Kx8!vR2#mQ7zLp-test";

#[derive(Deserialize, Default)]
struct Form {
    #[serde(default)]
    fields: Vec<Field>,
    submit: Option<Submit>,
    #[serde(default)]
    challenge: bool,
}
#[derive(Deserialize)]
struct Field {
    index: usize,
    role: String,
}
#[derive(Deserialize)]
struct Submit {
    index: usize,
    disabled: bool,
}

pub async fn record_signup(lib: &Library, url: &str, run_id: Option<String>, inbox: Option<String>) -> Result<Run> {
    let site = url::Url::parse(url)?.host_str().unwrap_or("site").to_string();
    let stamp = chrono::Local::now().format("%Y%m%d-%H%M%S");
    let id = run_id.unwrap_or_else(|| format!("{stamp}-signup-{}", site.replace('.', "-")));
    let dir = lib.run_dir(&id);
    std::fs::create_dir_all(&dir)?;
    let mut run = Run {
        id: id.clone(),
        site,
        start_url: url.into(),
        started_at: chrono::Local::now().to_rfc3339(),
        status: "running".into(),
        kind: "sign-up".into(),
        device: "phone".into(),
        ..Default::default()
    };
    lib.save(&run)?;
    let origin = origin_of(url);
    let result = async {
        let chrome = Chrome::start(&id).await?;
        let r = walk(&chrome, url, inbox.as_deref(), Ctx { lib, dir: &dir, origin: &origin, run: &mut run }).await;
        chrome.stop().await;
        r
    }
    .await;
    run.finished_at = Some(chrono::Local::now().to_rfc3339());
    match result {
        Ok(()) => run.status = "done".into(),
        Err(e) => {
            run.status = "failed".into();
            run.error = Some(e.to_string());
        }
    }
    lib.save(&run)?;
    Ok(run)
}

async fn walk(chrome: &Chrome, url: &str, inbox: Option<&str>, mut cx: Ctx<'_>) -> Result<()> {
    let mut tab = Tab::open_phone(&chrome.browser).await?;
    tab.goto(url).await?;
    let (code, pic, here) = (tab.screen_code().await, tab.picture().await?, tab.url().await);
    cx.new_screen(&mut tab, &code, &here, &pic, 0, true).await?;

    // 1. find the way to the form (a "Sign up" link, then maybe "Continue with email")
    let mut used: Vec<String> = vec![];
    let mut found = false;
    for _ in 0..4 {
        let (list, form, _) = look(&tab, cx.origin).await;
        if form.challenge {
            return note(&mut cx, "A robot check is showing, so the recording stopped here (agentscreen does not get around robot checks).");
        }
        if form.fields.iter().any(|f| matches!(f.role.as_str(), "email" | "password" | "phone" | "username")) {
            found = true;
            break;
        }
        if let Some(c) = way_in(&list, &used) {
            used.push(c.text.to_lowercase());
            act(&mut cx, &mut tab, &c, Act::Click, "Looking for the sign-up form").await?;
        } else if let Some(c) = menu(&list, &used) {
            used.push(c.text.to_lowercase());
            act(&mut cx, &mut tab, &c, Act::Click, "Sign-up is not on the screen, so opening the menu").await?;
        } else {
            break;
        }
    }
    if !found {
        return note(&mut cx, "No sign-up form was reached from this address; try the site's own sign-up address.");
    }
    let form_url = tab.url().await;
    keep(&mut cx, &tab, "the form as it first appears").await;

    // 2. every error on purpose: all empty, a wrong email, a weak password
    let (list, form, _) = look(&tab, cx.origin).await;
    match form.submit.as_ref() {
        Some(s) if !s.disabled => {
            if let Some(c) = by_index(&list, s.index) {
                let led = act(&mut cx, &mut tab, &c, Act::Click, "To see what happens when everything is empty").await?;
                keep(&mut cx, &tab, "after sending it empty").await;
                back_if_moved(&mut tab, &led, &form_url).await?;
            }
        }
        Some(_) => keep(&mut cx, &tab, "the send button is disabled while the form is empty").await,
        None => {}
    }
    for (role, bad, why) in [("email", "not-an-email", "a wrong email"), ("password", "123", "a weak password")] {
        if type_into(&mut cx, &mut tab, role, bad, &format!("To see the error for {why}")).await? {
            keep(&mut cx, &tab, &format!("after {why}")).await;
        }
    }

    // 3. good test details in every field it understands
    let email = inbox.unwrap_or("agentscreen.test@example.com");
    let user = format!("agentscreen{}", chrono::Local::now().format("%H%M%S"));
    for (role, value) in [
        ("name", "Sam Tester"), ("first-name", "Sam"), ("last-name", "Tester"), ("username", user.as_str()),
        ("email", email), ("password", TEST_PASSWORD),
    ] {
        type_into(&mut cx, &mut tab, role, value, "Filling in good test details").await?;
    }
    keep(&mut cx, &tab, "filled in with good details").await;

    // 4. make the account only with a real test inbox
    let Some(_) = inbox else {
        return note(&mut cx, "Stopped before the final button: no test inbox yet, so no account was made.");
    };
    let (list, form, _) = look(&tab, cx.origin).await;
    if let Some(c) = form.submit.as_ref().and_then(|s| by_index(&list, s.index)) {
        act(&mut cx, &mut tab, &c, Act::Click, "Making the account with the test inbox").await?;
        keep(&mut cx, &tab, "after making the account").await;
        if look(&tab, cx.origin).await.1.challenge {
            return note(&mut cx, "A robot check appeared after sending, so the recording stopped here.");
        }
    }
    note(&mut cx, "Sent with the test inbox. Reading the code from the inbox comes with the test inbox (part 2).")
}

/// Lists the controls and reads the form, from the same marking of the page.
async fn look(tab: &Tab, origin: &str) -> (Vec<Control>, Form, serde_json::Value) {
    let list = tab.controls(origin).await;
    let raw: String = tab.page.evaluate(FIELDS).await.ok().and_then(|v| v.into_value().ok()).unwrap_or_default();
    let value: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
    let form = serde_json::from_value(value.clone()).unwrap_or_default();
    (list, form, value)
}

/// Keeps what the form looks like at this moment, for the audit.
async fn keep(cx: &mut Ctx<'_>, tab: &Tab, moment: &str) {
    let (_, _, mut value) = look(tab, cx.origin).await;
    if let Some(m) = value.as_object_mut() {
        m.insert("moment".into(), moment.into());
        m.insert("after_step".into(), cx.run.steps.len().into());
        m.insert("screen".into(), tab.screen_code().await.into());
    }
    cx.run.forms.push(value);
    let _ = cx.lib.save(cx.run);
}

/// Does one step and puts why it was done in front of its explanation.
async fn act(cx: &mut Ctx<'_>, tab: &mut Tab, c: &Control, a: Act<'_>, why: &str) -> Result<Led> {
    let code = tab.screen_code().await;
    let el = tab.page.find_element(format!("[data-as-i=\"{}\"]", c.index)).await?;
    let _ = tab.page.evaluate(format!("document.querySelector('[data-as-i=\"{}\"]')?.removeAttribute('target')", c.index)).await;
    let led = cx.step(tab, &el, c, a, &code).await?;
    if let Some(s) = cx.run.steps.last_mut() {
        s.explanation = format!("{why}: {}", s.explanation);
    }
    cx.lib.save(cx.run)?;
    Ok(led)
}

/// Types into the field for `role` (if the form has one), then presses Tab to leave it so its check runs.
async fn type_into(cx: &mut Ctx<'_>, tab: &mut Tab, role: &str, value: &str, why: &str) -> Result<bool> {
    let (list, form, _) = look(tab, cx.origin).await;
    let Some(c) = form.fields.iter().find(|f| f.role == role).and_then(|f| by_index(&list, f.index)) else { return Ok(false) };
    act(cx, tab, &c, Act::Type(value), why).await?;
    act(cx, tab, &c, Act::Key("Tab"), "Leaving the field, so its check runs").await?;
    Ok(true)
}

async fn back_if_moved(tab: &mut Tab, led: &Led, form_url: &str) -> Result<()> {
    if led.outcome == "new-screen" {
        tab.goto(form_url).await?;
    }
    Ok(())
}

fn by_index(list: &[Control], i: usize) -> Option<Control> {
    list.iter().find(|c| c.index == i).cloned()
}

/// The best "sign up" control not tried yet: earlier words in WAY_IN win, and an exact match beats a partial one.
fn way_in(list: &[Control], used: &[String]) -> Option<Control> {
    let ok = |c: &&Control| {
        let t = c.text.to_lowercase();
        c.kind != "input" && !c.external && !used.contains(&t) && !SOCIAL.iter().any(|s| t.contains(s))
            && !t.split(|ch: char| !ch.is_alphanumeric()).any(|w| NOT_SIGN_UP.iter().any(|n| w.starts_with(n)))
            && t.len() <= 40
    };
    for w in WAY_IN {
        let mut hits: Vec<&Control> = list.iter().filter(ok).filter(|c| c.text.to_lowercase().contains(w)).collect();
        hits.sort_by_key(|c| c.text.len());
        if let Some(c) = hits.first() {
            return Some((*c).clone());
        }
    }
    None
}

/// The menu button, by its name or because it opens something (aria-haspopup); never a link away.
fn menu(list: &[Control], used: &[String]) -> Option<Control> {
    list.iter()
        .filter(|c| c.kind == "button" && !used.contains(&c.text.to_lowercase()))
        .find(|c| MENU.iter().any(|m| c.text.to_lowercase().contains(m)))
        .cloned()
}

fn note(cx: &mut Ctx<'_>, text: &str) -> Result<()> {
    cx.run.notes.push(text.into());
    cx.lib.save(cx.run)?;
    Ok(())
}
