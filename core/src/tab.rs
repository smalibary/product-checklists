//! One hidden Chrome tab with its own recording (pictures plus a smooth clip of what moved), and the
//! small helpers around it: finding Chrome, telling sites apart, writing clips with ffmpeg.
use crate::store::Control;
use anyhow::{anyhow, Result};
use base64::Engine;
use chromiumoxide::browser::Browser;
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

pub const W: u32 = 1280;
pub const H: u32 = 800;
pub use crate::values::{same_site, site_of};

const CONTROLS: &str = include_str!("controls.js");

#[derive(Default)]
struct Tape {
    frames: Vec<(f64, Vec<u8>)>,
    last: Option<Instant>,
}

/// One hidden tab with its own recording. A fresh one is opened whenever the tab has left the
/// website, because clicks stop reaching pages after a tab moves between websites (first test).
pub struct Tab {
    pub page: Page,
    tape: Arc<Mutex<Tape>>,
    /// picture size in pixels (a phone tab is drawn at twice its size, like a real phone screen)
    pub size: (u32, u32),
}

impl Tab {
    pub async fn open(browser: &Browser) -> Result<Self> {
        Self::open_as(browser, false).await
    }

    /// A tab that looks like a phone to the website: phone screen size, touch, mobile layout.
    pub async fn open_phone(browser: &Browser) -> Result<Self> {
        Self::open_as(browser, true).await
    }

    async fn open_as(browser: &Browser, phone: bool) -> Result<Self> {
        let page = browser.new_page("about:blank").await?;
        let size = if phone {
            crate::chrome::make_phone(&page).await?;
            let s = crate::chrome::PHONE_SCALE as u32;
            (crate::chrome::PHONE.0 * s, crate::chrome::PHONE.1 * s)
        } else {
            (W, H)
        };
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
                .max_width(size.0 as i64)
                .max_height(size.1 as i64)
                .every_nth_frame(1)
                .build(),
        )
        .await?;
        Ok(Self { page, tape, size })
    }

    pub async fn close(self) {
        let _ = self.page.execute(StopScreencastParams::default()).await;
        let _ = self.page.close().await;
    }

    pub fn clear(&self) {
        let mut g = self.tape.lock().unwrap();
        g.frames.clear();
        g.last = None;
    }

    pub fn take(&self) -> Vec<(f64, Vec<u8>)> {
        std::mem::take(&mut self.tape.lock().unwrap().frames)
    }

    /// Wait until nothing on screen has moved for a moment (animations finished), up to a limit.
    pub async fn wait_still(&self, started: Instant) {
        loop {
            tokio::time::sleep(Duration::from_millis(100)).await;
            let since_frame = self.tape.lock().unwrap().last.map(|l| l.elapsed());
            let quiet = since_frame.map(|d| d >= Duration::from_millis(700)).unwrap_or(true);
            if started.elapsed() >= Duration::from_secs(8) {
                return;
            }
            // still means: nothing moved for a while AND the page has finished loading
            if quiet && started.elapsed() >= Duration::from_millis(900) && self.loaded().await {
                return;
            }
        }
    }

    async fn loaded(&self) -> bool {
        let r = self.page.evaluate("document.readyState === 'complete' && !!document.body && document.body.innerText.trim().length > 0");
        match tokio::time::timeout(Duration::from_secs(2), r).await {
            Ok(Ok(v)) => v.into_value::<bool>().unwrap_or(true),
            _ => false,
        }
    }

    pub async fn goto(&self, url: &str) -> Result<()> {
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

    pub async fn picture(&self) -> Result<Vec<u8>> {
        Ok(self
            .page
            .screenshot(ScreenshotParams::builder().format(CaptureScreenshotFormat::Jpeg).quality(90).build())
            .await?)
    }

    pub async fn url(&self) -> String {
        self.page.url().await.ok().flatten().unwrap_or_default()
    }

    /// Short code for "which screen is this": the address (without # part) plus the visible text.
    pub async fn screen_code(&self) -> String {
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
    pub async fn controls(&self, origin: &str) -> Vec<Control> {
        let js = CONTROLS;
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
            #[serde(default)]
            search: bool,
        }
        let list: Vec<C> = serde_json::from_str(&raw).unwrap_or_default();
        list.into_iter()
            .map(|c| {
                let external = c
                    .href
                    .as_deref()
                    .map(|h| !same_site(h, origin) || h.starts_with("mailto:") || h.starts_with("tel:"))
                    .unwrap_or(false);
                Control { index: c.index, kind: c.kind, text: c.text, href: c.href, external, tried: false, search: c.search }
            })
            .collect()
    }
}

pub fn short_hash(bytes: &[u8]) -> String {
    let h = Sha256::digest(bytes);
    h.iter().take(4).map(|b| format!("{b:02x}")).collect()
}

pub fn origin_of(u: &str) -> String {
    url::Url::parse(u).map(|p| p.origin().ascii_serialization()).unwrap_or_default()
}

/// Write a clip from screencast frames (each frame keeps its real timing) using ffmpeg.
pub fn write_clip(dir: &Path, name: &str, before: &[u8], frames: &[(f64, Vec<u8>)], (w, h): (u32, u32)) -> Result<(String, u64)> {
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
            &format!("scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:white,fps=60"),
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
