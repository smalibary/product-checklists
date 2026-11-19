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

#[derive(Debug, Clone, Serialize, Deserialize)]
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
