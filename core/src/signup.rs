//! Sign-up recording at phone size. Finds the way into sign-up, triggers each error on purpose (send
//! everything empty, a wrong email, a weak password), then fills good test details. With a real test
//! inbox it goes on to the end: each next screen's fields, the code or link the site emails, up to
//! the welcome screen. Each form's measurements are kept for the audit. At a robot check it stops
//! and says so; it never gets around one.
use crate::chrome::Chrome;
use crate::form::{act, by_index, keep, look, note, send, type_into, Form};
use crate::inbox::Inbox;
use crate::step::{Act, Ctx};
use crate::store::{Control, Library, Run};
use crate::tab::{origin_of, Tab};
use anyhow::Result;
use std::time::Duration;

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
const ENTRY: &[&str] = &["email", "password", "phone", "username"];

/// `real`: make a real account with a throwaway test inbox; otherwise stop before the final button.
pub async fn record_signup(lib: &Library, url: &str, run_id: Option<String>, real: bool) -> Result<Run> {
    let site = url::Url::parse(url)?.host_str().unwrap_or("site").to_string();
    let stamp = chrono::Local::now().format("%Y%m%d-%H%M%S");
    let id = run_id.unwrap_or_else(|| format!("{stamp}-signup-{}", site.replace('.', "-")));
    let dir = lib.run_dir(&id);
    std::fs::create_dir_all(&dir)?;
    let mut run = Run {
        id: id.clone(), site, start_url: url.into(), started_at: chrono::Local::now().to_rfc3339(),
        status: "running".into(), kind: "sign-up".into(), device: "phone".into(), ..Default::default()
    };
    lib.save(&run)?;
    let origin = origin_of(url);
    let result = async {
        let mut inbox = if real { Some(Inbox::create(&lib.root.join("inbox-count.json")).await?) } else { None };
        let chrome = Chrome::start(&id).await?;
        let r = walk(&chrome, url, inbox.as_mut(), Ctx { lib, dir: &dir, origin: &origin, run: &mut run }).await;
        chrome.stop().await;
        if let Some(i) = inbox {
            i.delete().await;
        }
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

async fn walk(chrome: &Chrome, url: &str, mut inbox: Option<&mut Inbox>, mut cx: Ctx<'_>) -> Result<()> {
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
        if form.has(ENTRY) {
            found = true;
            break;
        }
        let next = way_in(&list, &used).map(|c| (c, "Looking for the sign-up form"))
            .or_else(|| menu(&list, &used).map(|c| (c, "Sign-up is not on the screen, so opening the menu")));
        let Some((c, why)) = next else { break };
        used.push(c.text.to_lowercase());
        act(&mut cx, &mut tab, &c, Act::Click, why).await?;
    }
    if !found {
        return note(&mut cx, "No sign-up form was reached from this address; try the site's own sign-up address.");
    }
    let form_url = tab.url().await;
    keep(&mut cx, &tab, "the form as it first appears").await;

    // 2. every error on purpose: all empty, a wrong email, a weak password
    let (_, form, _) = look(&tab, cx.origin).await;
    match form.submit.as_ref() {
        Some(s) if s.disabled => keep(&mut cx, &tab, "the send button is disabled while the form is empty").await,
        Some(_) => {
            if let Some(led) = send(&mut cx, &mut tab, "To see what happens when everything is empty").await? {
                keep(&mut cx, &tab, "after sending it empty").await;
                if led.outcome == "new-screen" {
                    tab.goto(&form_url).await?;
                }
            }
        }
        None => {}
    }
    for (role, bad, why) in [("email", "not-an-email", "a wrong email"), ("password", "123", "a weak password")] {
        if type_into(&mut cx, &mut tab, role, bad, &format!("To see the error for {why}")).await? {
            keep(&mut cx, &tab, &format!("after {why}")).await;
        }
    }

    // 3. good details; without a test inbox stop before the final button
    let email = inbox.as_ref().map(|i| i.address.clone()).unwrap_or_else(|| "agentscreen.test@example.com".into());
    fill(&mut cx, &mut tab, &email).await?;
    keep(&mut cx, &tab, "filled in with good details").await;
    let Some(inbox) = inbox.as_deref_mut() else {
        return note(&mut cx, "Stopped before the final button: no test inbox, so no account was made.");
    };

    // 4. send, then follow each next screen: new fields, the emailed code or link, to the welcome screen
    let mut mailed = false;
    for round in 0..6 {
        let why = if round == 0 { "Making the account with the test inbox" } else { "Going on to the next part of sign-up" };
        if send(&mut cx, &mut tab, why).await?.is_none() && round > 0 {
            break;
        }
        keep(&mut cx, &tab, "after sending").await;
        let (_, form, _) = look(&tab, cx.origin).await;
        if form.challenge {
            return note(&mut cx, "A robot check appeared after sending, so the recording stopped here.");
        }
        if !mailed && (form.has(&["code"]) || !form.has(ENTRY) && waiting_for_email(&tab).await) {
            mailed = true;
            let Some(mail) = inbox.wait_for_mail(Duration::from_secs(180)).await? else {
                return note(&mut cx, "No email arrived in the test inbox within 3 minutes.");
            };
            note(&mut cx, &format!("Email from the site: \"{}\"", mail.subject))?;
            if let (true, Some(code)) = (form.has(&["code"]), mail.code.as_deref()) {
                type_into(&mut cx, &mut tab, "code", code, "Typing the code the site emailed").await?;
            } else if let Some(link) = mail.link.as_deref() {
                tab.goto(link).await?;
                let (c, p, u) = (tab.screen_code().await, tab.picture().await?, tab.url().await);
                cx.new_screen(&mut tab, &c, &u, &p, cx.run.steps.len(), false).await?;
                keep(&mut cx, &tab, "after opening the link from the email").await;
            }
            continue;
        }
        if form.fields.iter().any(|f| !f.filled && f.role != "checkbox") {
            fill(&mut cx, &mut tab, &email).await?;
            continue;
        }
        if form.submit.is_none() {
            break;
        }
    }
    keep(&mut cx, &tab, "where sign-up ended").await;
    note(&mut cx, "Made a real account with a throwaway test inbox; the inbox was deleted afterwards.")
}

/// Good test details in every empty field it understands, and the terms box ticked (never marketing).
async fn fill(cx: &mut Ctx<'_>, tab: &mut Tab, email: &str) -> Result<()> {
    let user = format!("agentscreen{}", chrono::Local::now().format("%H%M%S"));
    for (role, value) in [
        ("name", "Sam Tester"), ("first-name", "Sam"), ("last-name", "Tester"), ("username", user.as_str()),
        ("email", email), ("password", TEST_PASSWORD),
    ] {
        let (_, form, _) = look(tab, cx.origin).await;
        if form.fields.iter().any(|f| f.role == role && (!f.filled || matches!(role, "email" | "password"))) {
            type_into(cx, tab, role, value, "Filling in good test details").await?;
        }
    }
    let (list, form, _) = look(tab, cx.origin).await;
    if let Some(c) = terms_box(&form).and_then(|i| by_index(&list, i)) {
        act(cx, tab, &c, Act::Click, "Accepting the terms (never the marketing box)").await?;
    }
    Ok(())
}

fn terms_box(form: &Form) -> Option<usize> {
    form.fields.iter().find(|f| {
        let t = format!("{} {}", f.label, f.aria_label).to_lowercase();
        f.role == "checkbox" && !f.checked && ["terms", "agree", "privacy"].iter().any(|w| t.contains(w))
            && !["news", "marketing", "offers", "updates", "promotion"].iter().any(|w| t.contains(w))
    }).map(|f| f.index)
}

async fn waiting_for_email(tab: &Tab) -> bool {
    let text: String = tab.page.evaluate("document.body?.innerText || ''").await.ok().and_then(|v| v.into_value().ok()).unwrap_or_default();
    let t = text.to_lowercase();
    ["check your email", "check your inbox", "verify your email", "confirm your email", "we sent", "we've sent", "sent you"]
        .iter().any(|w| t.contains(w))
}

/// The best "sign up" control not tried yet: earlier words in WAY_IN win, and the shortest text wins a tie.
fn way_in(list: &[Control], used: &[String]) -> Option<Control> {
    let ok = |c: &&Control| {
        let t = c.text.to_lowercase();
        c.kind != "input" && !c.external && !used.contains(&t) && !SOCIAL.iter().any(|s| t.contains(s))
            && !t.split(|ch: char| !ch.is_alphanumeric()).any(|w| NOT_SIGN_UP.iter().any(|n| w.starts_with(n)))
            && t.len() <= 40
    };
    WAY_IN.iter().find_map(|w| {
        list.iter().filter(ok).filter(|c| c.text.to_lowercase().contains(w)).min_by_key(|c| c.text.len()).cloned()
    })
}

/// The menu button, found by its name; never a link away.
fn menu(list: &[Control], used: &[String]) -> Option<Control> {
    list.iter()
        .filter(|c| c.kind == "button" && !used.contains(&c.text.to_lowercase()))
        .find(|c| MENU.iter().any(|m| c.text.to_lowercase().contains(m)))
        .cloned()
}
