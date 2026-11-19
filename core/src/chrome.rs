//! Starting and stopping the hidden Chrome (never the real screen), and making a tab look like a phone.
use crate::tab::{H, W};
use anyhow::{anyhow, Result};
use chromiumoxide::browser::{Browser, BrowserConfig};
use chromiumoxide::cdp::browser_protocol::browser::{PermissionDescriptor, PermissionSetting, SetPermissionParams};
use chromiumoxide::cdp::browser_protocol::emulation::{
    SetDeviceMetricsOverrideParams, SetTouchEmulationEnabledParams, SetUserAgentOverrideParams,
};
use chromiumoxide::Page;
use futures::StreamExt;
use std::path::{Path, PathBuf};
use tokio::task::JoinHandle;

/// A common phone screen (in points) and how many pixels each point has.
pub const PHONE: (u32, u32) = (390, 844);
pub const PHONE_SCALE: f64 = 2.0;

pub struct Chrome {
    pub browser: Browser,
    pump: JoinHandle<()>,
    profile: PathBuf,
}

impl Chrome {
    /// Each recording gets its own Chrome profile, so a Chrome left over from a stopped one never blocks it.
    pub async fn start(run_id: &str) -> Result<Self> {
        let profile = std::env::temp_dir().join(format!("agentscreen-{run_id}"));
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
        let (browser, mut handler) = Browser::launch(cfg.build().map_err(|e| anyhow!(e))?).await?;
        let pump = tokio::spawn(async move { while handler.next().await.is_some() {} });
        for name in ["microphone", "camera", "geolocation", "notifications", "clipboard-read", "clipboard-write"] {
            let _ = browser.execute(SetPermissionParams::new(PermissionDescriptor::new(name), PermissionSetting::Granted)).await;
        }
        Ok(Self { browser, pump, profile })
    }

    pub async fn stop(mut self) {
        let _ = self.browser.close().await;
        let _ = self.browser.wait().await;
        self.pump.abort();
        let _ = std::fs::remove_dir_all(&self.profile);
    }
}

/// Phone size, touch and the mobile layout. The browser name still says it is a headless Chrome
/// (only "Windows" becomes "Android" and "Mobile" is added), so nothing hides that it is automated.
pub async fn make_phone(page: &Page) -> Result<()> {
    page.execute(SetDeviceMetricsOverrideParams::new(PHONE.0, PHONE.1, PHONE_SCALE, true)).await?;
    let mut touch = SetTouchEmulationEnabledParams::new(true);
    touch.max_touch_points = Some(5);
    page.execute(touch).await?;
    let agent: String = page.evaluate("navigator.userAgent").await?.into_value().unwrap_or_default();
    let agent = agent
        .replace("(Windows NT 10.0; Win64; x64)", "(Linux; Android 14; Pixel 8)")
        .replace(" Safari/", " Mobile Safari/");
    page.execute(SetUserAgentOverrideParams::new(agent)).await?;
    Ok(())
}

pub fn find_chrome() -> Option<String> {
    let candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ];
    candidates.iter().find(|p| Path::new(p).exists()).map(|p| p.to_string())
}
