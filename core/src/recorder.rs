//! The recorder: drives a hidden Chrome (never the real mouse or screen), clicks through a website,
//! and keeps a picture before and after each click plus a smooth video clip of what moved in between.
use crate::store::{Control, Library, Run, Screen, Step};
use anyhow::{anyhow, Result};
use base64::Engine;
use chromiumoxide::browser::{Browser, BrowserConfig};
use chromiumoxide::cdp::browser_protocol::page::{
    CaptureScreenshotFormat, EventScreencastFrame, ScreencastFrameAckParams, StartScreencastFormat,
    StartScreencastParams, StopScreencastParams,
};
use chromiumoxide::page::ScreenshotParams;
use chromiumoxide::Page;
use futures::StreamExt;
use sha2::{Digest, Sha256};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

const W: u32 = 1280;
const H: u32 = 800;

#[derive(Debug, Clone)]
pub struct ExploreOptions {
    pub url: String,
    pub max_steps: usize,
}

#[derive(Default)]
struct Tape {
    frames: Vec<(f64, Vec<u8>)>,
    last: Option<Instant>,
}

/// One hidden tab with its own recording. A fresh one is opened whenever the tab has left the
/// website, because clicks stop reaching pages after a tab moves between websites (first test).
struct Tab {
    page: Page,
    tape: Arc<Mutex<Tape>>,
}

impl Tab {
    async fn open(browser: &Browser) -> Result<Self> {
        let page = browser.new_page("about:blank").await?;
        let tape = Arc::new(Mutex::new(Tape::default()));
        let mut events = page.event_listener::<EventScreencastFrame>().await?;
        let (p, t) = (page.clone(), tape.clone());
        tokio::spawn(async move {
            while let Some(ev) = events.next().await {
                let ts = ev.metadata.timestamp.as_ref().map(|t| *t.inner()).unwrap_or(0.0);
                let data: &str = ev.data.as_ref();
                if let Ok(bytes) = base64::engine::general_purpose::STANDARD.decode(data) {
                    let mut g = t.lock().unwrap();
                    g.frames.push((ts, bytes));
                    g.last = Some(Instant::now());
                }
                let _ = p.execute(ScreencastFrameAckParams::new(ev.session_id)).await;
            }
        });
        page.execute(
            StartScreencastParams::builder()
                .format(StartScreencastFormat::Jpeg)
                .quality(85)
                .max_width(W as i64)
                .max_height(H as i64)
                .every_nth_frame(1)
                .build(),
        )
        .await?;
        Ok(Self { page, tape })
    }

    async fn close(self) {
        let _ = self.page.execute(StopScreencastParams::default()).await;
        let _ = self.page.close().await;
    }

    fn clear(&self) {
        let mut g = self.tape.lock().unwrap();
        g.frames.clear();
        g.last = None;
    }

    fn take(&self) -> Vec<(f64, Vec<u8>)> {
        std::mem::take(&mut self.tape.lock().unwrap().frames)
    }

    /// Wait until nothing on screen has moved for a moment (animations finished), up to a limit.
    async fn wait_still(&self, started: Instant) {
        loop {
            tokio::time::sleep(Duration::from_millis(100)).await;
            let since_frame = self.tape.lock().unwrap().last.map(|l| l.elapsed());
            let quiet = since_frame.map(|d| d >= Duration::from_millis(700)).unwrap_or(true);
            if (quiet && started.elapsed() >= Duration::from_millis(900))
                || started.elapsed() >= Duration::from_secs(8)
            {
                return;
            }
        }
    }

    async fn goto(&self, url: &str) -> Result<()> {
        self.page.goto(url).await?;
        let _ = tokio::time::timeout(Duration::from_secs(15), self.page.wait_for_navigation()).await;
        // a blinking text cursor never lets the screen go still, so hide it while recording
        let _ = self
            .page
            .evaluate("(()=>{const s=document.createElement('style');s.textContent='*{caret-color:transparent!important}';document.head&&document.head.appendChild(s)})()")
            .await;
        self.wait_still(Instant::now()).await;
        Ok(())
    }

    async fn picture(&self) -> Result<Vec<u8>> {
        Ok(self
            .page
            .screenshot(ScreenshotParams::builder().format(CaptureScreenshotFormat::Jpeg).quality(90).build())
            .await?)
    }

    async fn url(&self) -> String {
        self.page.url().await.ok().flatten().unwrap_or_default()
    }

    /// Short code for "which screen is this": the address (without # part) plus the visible text.
    async fn screen_code(&self) -> String {
        let text: String = self
            .page
            .evaluate("(document.body ? document.body.innerText : '').replace(/\\s+/g,' ').slice(0,3000)")
            .await
            .ok()
            .and_then(|v| v.into_value().ok())
            .unwrap_or_default();
        let url = self.url().await;
        let url = url.split('#').next().unwrap_or("").to_string();
        short_hash(format!("{url}\n{text}").as_bytes())
    }

    /// Lists every visible link, button and input, marking each so it can be clicked later.
    async fn controls(&self, origin: &str) -> Vec<Control> {
        let js = r#"(() => {
          const els = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=menuitem],summary')];
          const out = [];
          let i = 0;
          for (const e of els) {
            const r = e.getBoundingClientRect();
            const st = getComputedStyle(e);
            if (r.width < 2 || r.height < 2 || st.visibility === 'hidden' || st.display === 'none') continue;
            e.setAttribute('data-as-i', String(i));
            const tag = e.tagName.toLowerCase();
            const role = e.getAttribute('role');
            const kind = tag === 'a' ? 'link' : (tag === 'button' || role === 'button' || role === 'tab' || role === 'menuitem' || tag === 'summary' || (tag === 'input' && ['submit','button','reset'].includes(e.type))) ? 'button' : (tag === 'select' ? 'select' : (tag === 'input' || tag === 'textarea') ? 'input' : 'other');
            const text = (e.innerText || e.getAttribute('aria-label') || e.value || e.placeholder || e.name || e.title || '').replace(/\s+/g,' ').trim().slice(0, 80);
            out.push({ index: i, kind, text, href: tag === 'a' ? e.href : null });
            i++;
          }
          return JSON.stringify(out);
        })()"#;
        let raw: String = match self.page.evaluate(js).await {
            Ok(v) => v.into_value().unwrap_or_default(),
            Err(_) => return vec![],
        };
        #[derive(serde::Deserialize)]
        struct C {
            index: usize,
            kind: String,
            text: String,
            href: Option<String>,
        }
        let list: Vec<C> = serde_json::from_str(&raw).unwrap_or_default();
        list.into_iter()
            .map(|c| {
                let external = c
                    .href
                    .as_deref()
                    .map(|h| !origin_of(h).eq_ignore_ascii_case(origin) || h.starts_with("mailto:") || h.starts_with("tel:"))
                    .unwrap_or(false);
                Control { index: c.index, kind: c.kind, text: c.text, href: c.href, external, tried: false }
            })
            .collect()
    }
}

fn short_hash(bytes: &[u8]) -> String {
    let h = Sha256::digest(bytes);
    h.iter().take(4).map(|b| format!("{b:02x}")).collect()
}

fn origin_of(u: &str) -> String {
    url::Url::parse(u).map(|p| p.origin().ascii_serialization()).unwrap_or_default()
}

fn find_chrome() -> Option<String> {
    let candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ];
    candidates.iter().find(|p| Path::new(p).exists()).map(|p| p.to_string())
}

/// Should the recorder leave this control alone? (leaving the site, downloads, signing out)
fn skip(c: &Control) -> bool {
    if c.external {
        return true;
    }
    let t = c.text.to_lowercase();
    if ["log out", "logout", "sign out", "signout", "delete"].iter().any(|w| t.contains(w)) {
        return true;
    }
    if let Some(h) = &c.href {
        let h = h.to_lowercase();
        if h.starts_with("javascript:") || [".pdf", ".zip", ".dmg", ".exe"].iter().any(|e| h.ends_with(e)) {
            return true;
        }
    }
    false
}

/// Write a clip from screencast frames (each frame keeps its real timing) using ffmpeg.
fn write_clip(dir: &Path, name: &str, before: &[u8], frames: &[(f64, Vec<u8>)]) -> Result<(String, u64)> {
    let tmp = dir.join(format!("{name}-frames"));
    std::fs::create_dir_all(&tmp)?;
    let mut list = String::new();
    // hold the "before" picture briefly so every clip starts from the screen as it was
    std::fs::write(tmp.join("00000.jpg"), before)?;
    list.push_str("file '00000.jpg'\nduration 0.4000\n");
    let mut total = 0.4;
    for (i, (ts, bytes)) in frames.iter().enumerate() {
        let file = format!("{:05}.jpg", i + 1);
        std::fs::write(tmp.join(&file), bytes)?;
        let next = frames.get(i + 1).map(|n| n.0).unwrap_or(ts + 0.6);
        let dur = (next - ts).clamp(0.001, 2.0);
        total += dur;
        list.push_str(&format!("file '{file}'\nduration {dur:.4}\n"));
    }
    let last = frames.len();
    list.push_str(&format!("file '{last:05}.jpg'\n"));
    std::fs::write(tmp.join("list.txt"), list)?;
    let out = dir.join(format!("{name}.mp4"));
    let status = std::process::Command::new("ffmpeg")
        .args(["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i"])
        .arg(tmp.join("list.txt"))
        .args([
            "-vf",
            &format!("scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:white,fps=60"),
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
        ])
        .arg(&out)
        .status()?;
    let _ = std::fs::remove_dir_all(&tmp);
    if !status.success() {
        return Err(anyhow!("ffmpeg could not make the clip"));
    }
    Ok((format!("{name}.mp4"), (total * 1000.0) as u64))
}

fn explain(kind: &str, text: &str, outcome: &str, url_after: &str) -> String {
    let what = if text.is_empty() { format!("an unnamed {kind}") } else { format!("the \"{text}\" {kind}") };
    let verb = if kind == "input" || kind == "select" { "Clicked into" } else { "Clicked" };
    match outcome {
        "new-screen" => format!("{verb} {what}; it opened a new screen ({url_after})."),
        "changed-in-place" => format!("{verb} {what}; the same screen changed (menu, panel, message or animation)."),
        "nothing-changed" => format!("{verb} {what}; nothing visible changed."),
        _ => format!("{verb} {what}; it failed."),
    }
}

/// Automatic mode: open the start page, then try every link and button on it one by one,
/// going back to the start page before each try. Saves the run after every step.
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
    };
    lib.save(&run)?;

    let result = explore_inner(lib, &opts, &origin, &dir, &mut run).await;
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

async fn explore_inner(lib: &Library, opts: &ExploreOptions, origin: &str, dir: &Path, run: &mut Run) -> Result<()> {
    let mut cfg = BrowserConfig::builder().new_headless_mode().window_size(W, H).viewport(None);
    if let Some(chrome) = find_chrome() {
        cfg = cfg.chrome_executable(chrome);
    }
    let (mut browser, mut handler) = Browser::launch(cfg.build().map_err(|e| anyhow!(e))?).await?;
    let pump = tokio::spawn(async move { while handler.next().await.is_some() {} });

    let outcome = async {
        let mut tab = Tab::open(&browser).await?;
        tab.goto(&opts.url).await?;
        let home_code = tab.screen_code().await;
        let home_pic = tab.picture().await?;
        std::fs::write(dir.join("screen-00.jpg"), &home_pic)?;
        let home_controls = tab.controls(origin).await;
        run.screens.push(Screen {
            code: home_code.clone(),
            url: tab.url().await,
            title: tab.page.get_title().await.ok().flatten().unwrap_or_default(),
            picture: "screen-00.jpg".into(),
            first_step: 0,
            controls: home_controls.clone(),
        });
        lib.save(run)?;

        let todo: Vec<Control> = home_controls.iter().filter(|c| !skip(c)).take(opts.max_steps).cloned().collect();
        let mut fresh = true;
        for c in todo {
            let n = run.steps.len() + 1;
            // start every try from a clean start page, in a new tab if the last one left the website
            if !fresh {
                if origin_of(&tab.url().await) != origin {
                    tab.close().await;
                    tab = Tab::open(&browser).await?;
                }
                tab.goto(&opts.url).await?;
                tab.controls(origin).await; // re-mark the controls on the fresh page
            }
            fresh = false;
            let url_before = tab.url().await;
            let before = tab.picture().await?;
            let sel = format!("[data-as-i=\"{}\"]", c.index);
            let el = match tab.page.find_element(sel.as_str()).await {
                Ok(el) => el,
                Err(_) => continue,
            };
            let _ = tab
                .page
                .evaluate(format!("document.querySelector('{}')?.removeAttribute('target')", sel.replace('\'', "\\'")))
                .await;
            tab.clear();
            let started = Instant::now();
            let clicked = async {
                el.scroll_into_view().await?;
                el.click().await?;
                anyhow::Ok(())
            }
            .await;
            tab.wait_still(started).await;
            let frames = tab.take();
            let after = tab.picture().await.unwrap_or_else(|_| before.clone());
            let url_after = tab.url().await;
            let code_after = tab.screen_code().await;
            let before_name = format!("step-{n:02}-before.jpg");
            let after_name = format!("step-{n:02}-after.jpg");
            std::fs::write(dir.join(&before_name), &before)?;
            std::fs::write(dir.join(&after_name), &after)?;

            let outcome = if clicked.is_err() {
                "error"
            } else if code_after != run.screens[0].code && url_after.split('#').next() != url_before.split('#').next() {
                "new-screen"
            } else if short_hash(&after) != short_hash(&before) || frames.len() > 2 {
                "changed-in-place"
            } else {
                "nothing-changed"
            };
            if outcome == "new-screen" && !run.screens.iter().any(|s| s.code == code_after) {
                let pic = format!("screen-{:02}.jpg", run.screens.len());
                std::fs::write(dir.join(&pic), &after)?;
                let controls = if origin_of(&url_after) == origin { tab.controls(origin).await } else { vec![] };
                run.screens.push(Screen {
                    code: code_after.clone(),
                    url: url_after.clone(),
                    title: tab.page.get_title().await.ok().flatten().unwrap_or_default(),
                    picture: pic,
                    first_step: n,
                    controls,
                });
            }
            let (clip, clip_ms) = if frames.is_empty() {
                (None, 0)
            } else {
                match write_clip(dir, &format!("step-{n:02}"), &before, &frames) {
                    Ok((f, ms)) => (Some(f), ms),
                    Err(_) => (None, 0),
                }
            };
            if let Some(ctrl) = run.screens[0].controls.iter_mut().find(|x| x.index == c.index) {
                ctrl.tried = true;
            }
            run.steps.push(Step {
                n,
                action: if c.kind == "input" || c.kind == "select" { "focus".into() } else { "click".into() },
                control_kind: c.kind.clone(),
                control_text: c.text.clone(),
                screen_before: run.screens[0].code.clone(),
                screen_after: code_after,
                url_before,
                url_after: url_after.clone(),
                outcome: outcome.into(),
                explanation: explain(&c.kind, &c.text, outcome, &url_after),
                before: before_name,
                after: after_name,
                clip,
                clip_ms,
                frames: frames.len(),
            });
            lib.save(run)?;
        }
        tab.close().await;
        anyhow::Ok(())
    }
    .await;

    let _ = browser.close().await;
    let _ = browser.wait().await;
    pump.abort();
    outcome
}
