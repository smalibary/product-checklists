//! The recorder: drives a hidden Chrome (never the real mouse or screen) through a whole website,
//! screen by screen. On every screen it tries each link, button and field: it types a search into
//! search boxes and presses Enter, opens menus and then tries what appeared inside them, and puts
//! every new screen it reaches on the list to explore next. Microphone, camera and location are
//! allowed (with a fake microphone and camera), so buttons that need them work.
use crate::step::{key, skip, Act, Ctx};
use crate::store::{Control, Library, Run};
use crate::tab::{find_chrome, origin_of, same_site, Tab, H, W};
use anyhow::{anyhow, Result};
use chromiumoxide::browser::{Browser, BrowserConfig};
use chromiumoxide::cdp::browser_protocol::browser::{PermissionDescriptor, PermissionSetting, SetPermissionParams};
use futures::StreamExt;
use std::collections::{HashSet, VecDeque};
use std::path::Path;
use std::time::Instant;

/// Tries per visit to a screen (a screen with more is visited again later, so the explorer goes deep
/// before it goes wide), most screens explored, and links to other websites tried per screen.
const PER_SCREEN: usize = 12;
const MAX_SCREENS: usize = 25;
const OUTSIDE_PER_SCREEN: usize = 4;
/// Most items tried inside one menu or panel that a click opened.
const INSIDE_MENU: usize = 6;

#[derive(Debug, Clone)]
pub struct ExploreOptions {
    pub url: String,
    pub max_steps: usize,
    /// what to type into search boxes
    pub query: String,
}

/// One thing to try: a control on a screen, maybe inside a menu that another control opens first.
struct Try {
    via: Option<Control>,
    target: Control,
}

pub async fn explore(lib: &Library, opts: ExploreOptions, run_id: Option<String>) -> Result<Run> {
    let origin = origin_of(&opts.url);
    let site = url::Url::parse(&opts.url)?.host_str().unwrap_or("site").to_string();
    let id = run_id.unwrap_or_else(|| format!("{}-{}", chrono::Local::now().format("%Y%m%d-%H%M%S"), site.replace('.', "-")));
    let dir = lib.run_dir(&id);
    std::fs::create_dir_all(&dir)?;
    let mut run = Run {
        id: id.clone(),
        site: site.clone(),
        start_url: opts.url.clone(),
        started_at: chrono::Local::now().to_rfc3339(),
        finished_at: None,
        status: "running".into(),
        error: None,
        screens: vec![],
        steps: vec![],
        components: vec![],
    };
    lib.save(&run)?;
    let result = launch(lib, &opts, &origin, &dir, &mut run).await;
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

async fn launch(lib: &Library, opts: &ExploreOptions, origin: &str, dir: &Path, run: &mut Run) -> Result<()> {
    // each recording gets its own Chrome profile, so a Chrome left over from a stopped one never blocks it
    let profile = std::env::temp_dir().join(format!("agentscreen-{}", run.id));
    let mut cfg = BrowserConfig::builder()
        .user_data_dir(&profile)
        .new_headless_mode()
        .window_size(W, H)
        .viewport(None)
        // say yes to microphone and camera, with a fake device, so those buttons really work
        .arg("--use-fake-ui-for-media-stream")
        .arg("--use-fake-device-for-media-stream")
        .arg("--lang=en-US");
    if let Some(chrome) = find_chrome() {
        cfg = cfg.chrome_executable(chrome);
    }
    let (mut browser, mut handler) = Browser::launch(cfg.build().map_err(|e| anyhow!(e))?).await?;
    let pump = tokio::spawn(async move { while handler.next().await.is_some() {} });
    for name in ["microphone", "camera", "geolocation", "notifications", "clipboard-read", "clipboard-write"] {
        let _ = browser.execute(SetPermissionParams::new(PermissionDescriptor::new(name), PermissionSetting::Granted)).await;
    }
    let outcome = crawl(&browser, opts, Ctx { lib, dir, origin, run }).await;
    let _ = browser.close().await;
    let _ = browser.wait().await;
    pump.abort();
    let _ = std::fs::remove_dir_all(&profile);
    outcome
}

/// Load a screen again and, when the try is inside a menu, open that menu first.
async fn reset(browser: &Browser, tab: &mut Tab, url: &str, origin: &str, via: &Option<Control>) -> Result<Vec<Control>> {
    if !same_site(&tab.url().await, origin) {
        // clicks stop reaching pages after a tab moves between websites, so take a fresh tab
        let old = std::mem::replace(tab, Tab::open(browser).await?);
        old.close().await;
    }
    tab.goto(url).await?;
    let mut list = tab.controls(origin).await;
    if let Some(v) = via {
        if let Some(c) = list.iter().find(|c| key(c) == key(v)) {
            if let Ok(el) = tab.page.find_element(format!("[data-as-i=\"{}\"]", c.index)).await {
                let _ = el.click().await;
                tab.wait_still(Instant::now()).await;
                list = tab.controls(origin).await;
            }
        }
    }
    Ok(list)
}

async fn crawl(browser: &Browser, opts: &ExploreOptions, mut cx: Ctx<'_>) -> Result<()> {
    let mut tab = Tab::open(browser).await?;
    // (address, is this a second visit for the controls left over)
    let mut queue: VecDeque<(String, bool)> = VecDeque::from([(opts.url.clone(), false)]);
    let mut seen_urls: HashSet<String> = HashSet::from([bare(&opts.url)]);
    let mut explored: HashSet<String> = HashSet::new();
    let mut tried: HashSet<(String, String, String)> = HashSet::new();

    while let Some((url, again)) = queue.pop_front() {
        if cx.run.steps.len() >= opts.max_steps || explored.len() >= MAX_SCREENS {
            break;
        }
        let mut list = reset(browser, &mut tab, &url, cx.origin, &None).await?;
        let code = tab.screen_code().await;
        if !again && !explored.insert(code.clone()) {
            continue;
        }
        if !cx.run.screens.iter().any(|s| s.code == code) {
            let pic = tab.picture().await?;
            let (n, here) = (cx.run.steps.len(), tab.url().await);
            cx.new_screen(&mut tab, &code, &here, &pic, n, true).await?;
            list = tab.controls(cx.origin).await;
        }
        let mut outside = 0;
        let mut todo: VecDeque<Try> = VecDeque::new();
        for c in list.iter().filter(|c| !skip(c)) {
            if c.external {
                if outside >= OUTSIDE_PER_SCREEN {
                    continue;
                }
                outside += 1;
            }
            if c.href.as_ref().is_some_and(|h| seen_urls.contains(&bare(h))) || tried.contains(&key(c)) {
                continue; // the same control (or an address already reached) was tried on another screen
            }
            todo.push_back(Try { via: None, target: c.clone() });
        }
        // search boxes first: a search opens the most screens
        todo.make_contiguous().sort_by_key(|t| !t.target.search);
        if todo.len() > PER_SCREEN {
            todo.truncate(PER_SCREEN);
            queue.push_back((url.clone(), true)); // come back for the rest after going deeper
        }
        for t in &todo {
            tried.insert(key(&t.target));
        }

        let mut fresh = true;
        while let Some(t) = todo.pop_front() {
            if cx.run.steps.len() >= opts.max_steps {
                break;
            }
            let now = if fresh && t.via.is_none() { list.clone() } else { reset(browser, &mut tab, &url, cx.origin, &t.via).await? };
            fresh = false;
            let Some(c) = now.iter().find(|c| key(c) == key(&t.target)).cloned() else { continue };
            let Ok(el) = tab.page.find_element(format!("[data-as-i=\"{}\"]", c.index)).await else { continue };
            let _ = tab.page.evaluate(format!("document.querySelector('[data-as-i=\"{}\"]')?.removeAttribute('target')", c.index)).await;

            let led = if c.search {
                cx.step(&mut tab, &el, &c, Act::Type(&opts.query), &code).await?;
                if cx.run.steps.len() >= opts.max_steps {
                    break;
                }
                cx.step(&mut tab, &el, &c, Act::Enter, &code).await?
            } else {
                cx.step(&mut tab, &el, &c, Act::Click, &code).await?
            };

            if led.outcome == "new-screen" && led.same_site && seen_urls.insert(bare(&led.url)) {
                // new screens go before second visits, so the explorer goes deeper first
                let at = queue.iter().position(|q| q.1).unwrap_or(queue.len());
                queue.insert(at, (led.url.clone(), false));
            } else if led.outcome == "changed-in-place" && t.via.is_none() && !c.search {
                // a menu or panel opened: try what appeared inside it, opening it again before each try
                let after = tab.controls(cx.origin).await;
                let before: HashSet<_> = now.iter().map(key).collect();
                let new: Vec<Control> = after
                    .into_iter()
                    .filter(|x| !before.contains(&key(x)) && !skip(x) && !x.external && tried.insert(key(x)))
                    .take(INSIDE_MENU)
                    .collect();
                for (k, x) in new.into_iter().enumerate() {
                    todo.insert(k, Try { via: Some(c.clone()), target: x });
                }
            }
        }
    }
    tab.close().await;
    Ok(())
}

/// An address without its # part and trailing slash, to tell whether it was reached before.
fn bare(u: &str) -> String {
    u.split('#').next().unwrap_or("").trim_end_matches('/').to_string()
}
