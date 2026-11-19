//! The library on disk: one folder per run, holding run.json plus pictures and clips.
use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Control {
    pub index: usize,
    /// link | button | input | select | other
    pub kind: String,
    pub text: String,
    pub href: Option<String>,
    /// true when the link leaves the website being recorded
    pub external: bool,
    /// true once the recorder has tried it
    pub tried: bool,
    /// true for a search box: the recorder types a search into it and presses Enter
    #[serde(default)]
    pub search: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Screen {
    /// short code that tells screens apart (address + visible text)
    pub code: String,
    pub url: String,
    pub title: String,
    pub picture: String,
    pub first_step: usize,
    pub controls: Vec<Control>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Step {
    pub n: usize,
    /// click | focus
    pub action: String,
    pub control_kind: String,
    pub control_text: String,
    pub screen_before: String,
    pub screen_after: String,
    pub url_before: String,
    pub url_after: String,
    /// new-screen | changed-in-place | nothing-changed | error
    pub outcome: String,
    pub explanation: String,
    pub before: String,
    pub after: String,
    pub clip: Option<String>,
    pub clip_ms: u64,
    pub frames: usize,
}

/// One look of a component (normal, hover, focus, pressed): its picture, what changed from normal,
/// and what moved on the way there.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StateShot {
    pub state: String,
    pub picture: String,
    pub changes: Vec<Change>,
    pub motion: Vec<Motion>,
    /// plain-language sentence about this state
    pub said: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Change {
    pub what: String,
    pub from: String,
    pub to: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Motion {
    pub what: String,
    pub ms: u64,
    pub delay_ms: u64,
    pub easing: String,
}

/// A component cut out of a recorded screen, so an AI can copy it and a person can learn from it.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComponentCard {
    pub id: String,
    /// short code of the screen it was found on
    pub screen: String,
    pub kind: String,
    /// filled button, outlined button, ghost button, text link, icon button, text field...
    pub family: String,
    pub name: String,
    /// how many controls on the screen look exactly like this one
    pub used: usize,
    pub tag: String,
    pub role: String,
    /// icon + label | icon only | label only
    pub parts: String,
    pub html: String,
    /// how it looks when nothing is happening (colours, sizes, corners, font...)
    pub look: std::collections::BTreeMap<String, String>,
    pub states: Vec<StateShot>,
    /// a short paragraph in plain words: what it is and what it does
    pub explanation: String,
    /// design lessons: what it does well or badly (feedback, focus, size, contrast, timing)
    pub lessons: Vec<String>,
    /// file name of the live working copy (a small web page you can hover, focus and press)
    #[serde(default)]
    pub live: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct Run {
    pub id: String,
    pub site: String,
    pub start_url: String,
    pub started_at: String,
    pub finished_at: Option<String>,
    /// running | done | failed
    pub status: String,
    pub error: Option<String>,
    pub screens: Vec<Screen>,
    pub steps: Vec<Step>,
    #[serde(default)]
    pub components: Vec<ComponentCard>,
    /// "explore" (whole site) or "sign-up" (one sign-up flow at phone size)
    #[serde(default)]
    pub kind: String,
    /// "desktop" or "phone"
    #[serde(default)]
    pub device: String,
    /// plain-words notes, such as where and why a recording stopped
    #[serde(default)]
    pub notes: Vec<String>,
    /// what was measured on each form screen (fields, the send button, errors shown), for the audit
    #[serde(default)]
    pub forms: Vec<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunSummary {
    pub id: String,
    pub site: String,
    pub start_url: String,
    pub started_at: String,
    pub status: String,
    pub steps: usize,
    pub screens: usize,
    pub components: usize,
    pub cover: Option<String>,
}

#[derive(Debug, Clone)]
pub struct Library {
    pub root: PathBuf,
}

impl Library {
    pub fn open(root: impl Into<PathBuf>) -> Result<Self> {
        let root = root.into();
        std::fs::create_dir_all(root.join("runs"))?;
        Ok(Self { root })
    }

    pub fn run_dir(&self, id: &str) -> PathBuf {
        self.root.join("runs").join(id)
    }

    pub fn save(&self, run: &Run) -> Result<()> {
        let dir = self.run_dir(&run.id);
        std::fs::create_dir_all(&dir)?;
        let tmp = dir.join("run.json.tmp");
        std::fs::write(&tmp, serde_json::to_vec_pretty(run)?)?;
        std::fs::rename(&tmp, dir.join("run.json"))?;
        Ok(())
    }

    pub fn load(&self, id: &str) -> Result<Run> {
        let p = self.run_dir(id).join("run.json");
        let bytes = std::fs::read(&p).with_context(|| format!("no run {id}"))?;
        Ok(serde_json::from_slice(&bytes)?)
    }

    pub fn list(&self) -> Result<Vec<RunSummary>> {
        let mut out = vec![];
        for entry in std::fs::read_dir(self.root.join("runs"))? {
            let entry = entry?;
            let id = entry.file_name().to_string_lossy().to_string();
            if let Ok(run) = self.load(&id) {
                out.push(RunSummary {
                    cover: run.screens.first().map(|s| s.picture.clone()),
                    id: run.id,
                    site: run.site,
                    start_url: run.start_url,
                    started_at: run.started_at,
                    status: run.status,
                    steps: run.steps.len(),
                    screens: run.screens.len(),
                    components: run.components.len(),
                });
            }
        }
        out.sort_by(|a, b| b.started_at.cmp(&a.started_at));
        Ok(out)
    }

    pub fn path(&self) -> &Path {
        &self.root
    }
}
