//! A throwaway test inbox (mail.tm, free, chosen by Salem 2026-11-19): one new address per sign-up
//! recording, read for the code or link the site sends, then deleted. Capped in code (L-4): at most
//! 20 inboxes a day and 40 calls each; a "too many requests" answer stops it at once.
use anyhow::{anyhow, bail, Result};
use serde_json::{json, Value};
use std::path::Path;
use std::time::{Duration, Instant};

const API: &str = "https://api.mail.tm";
const PER_DAY: u64 = 20;
const CALLS_EACH: u32 = 40;

pub struct Inbox {
    pub address: String,
    id: String,
    token: String,
    http: reqwest::Client,
    calls: u32,
}

/// What the site sent: a code to type, or a link to open.
pub struct Mail {
    pub subject: String,
    pub code: Option<String>,
    pub link: Option<String>,
}

impl Inbox {
    /// Makes a new address. `count_file` keeps today's count so the daily cap holds across recordings.
    pub async fn create(count_file: &Path) -> Result<Self> {
        let today = chrono::Local::now().format("%Y-%m-%d").to_string();
        let old: Value = std::fs::read_to_string(count_file).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default();
        let used = if old["date"] == today.as_str() { old["count"].as_u64().unwrap_or(0) } else { 0 };
        if used >= PER_DAY {
            bail!("the test inbox cap is used up for today ({PER_DAY} a day); try again tomorrow");
        }
        std::fs::write(count_file, json!({ "date": today, "count": used + 1 }).to_string())?;
        let http = reqwest::Client::builder().user_agent("agentscreen-test-inbox").timeout(Duration::from_secs(20)).build()?;
        let mut me = Self { address: String::new(), id: String::new(), token: String::new(), http, calls: 0 };
        let domains = me.call(reqwest::Method::GET, "/domains", None).await?;
        let domain = domains.as_array().and_then(|d| d.iter().find(|x| x["isActive"] != false))
            .and_then(|d| d["domain"].as_str()).ok_or_else(|| anyhow!("the test inbox service offered no address"))?
            .to_string();
        let stamp = chrono::Local::now().format("%m%d%H%M%S");
        let address = format!("agentscreen{stamp}@{domain}");
        let password = format!("As-{stamp}-{}", std::process::id());
        let made = me.call(reqwest::Method::POST, "/accounts", Some(json!({ "address": address, "password": password }))).await?;
        me.id = made["id"].as_str().unwrap_or_default().to_string();
        let tok = me.call(reqwest::Method::POST, "/token", Some(json!({ "address": address, "password": password }))).await?;
        me.token = tok["token"].as_str().ok_or_else(|| anyhow!("the test inbox gave no sign-in"))?.to_string();
        me.address = address;
        Ok(me)
    }

    /// Waits up to `wait` for the first email and reads the code or link in it.
    pub async fn wait_for_mail(&mut self, wait: Duration) -> Result<Option<Mail>> {
        let start = Instant::now();
        while start.elapsed() < wait {
            let list = self.call(reqwest::Method::GET, "/messages", None).await?;
            if let Some(id) = list.as_array().and_then(|l| l.first()).and_then(|m| m["id"].as_str()).map(String::from) {
                let m = self.call(reqwest::Method::GET, &format!("/messages/{id}"), None).await?;
                let text = m["text"].as_str().unwrap_or_default().to_string();
                let html = m["html"].as_array().map(|h| h.iter().filter_map(|x| x.as_str()).collect::<Vec<_>>().join(" ")).unwrap_or_default();
                return Ok(Some(Mail {
                    subject: m["subject"].as_str().unwrap_or_default().to_string(),
                    code: code_in(&text).or_else(|| code_in(&strip(&html))),
                    link: link_in(&text).or_else(|| link_in(&html)),
                }));
            }
            tokio::time::sleep(Duration::from_secs(5)).await;
        }
        Ok(None)
    }

    /// Deletes the address once the recording is over.
    pub async fn delete(mut self) {
        let id = self.id.clone();
        let _ = self.call(reqwest::Method::DELETE, &format!("/accounts/{id}"), None).await;
    }

    async fn call(&mut self, method: reqwest::Method, path: &str, body: Option<Value>) -> Result<Value> {
        self.calls += 1;
        if self.calls > CALLS_EACH {
            bail!("the test inbox reached its cap of {CALLS_EACH} calls for this recording");
        }
        let mut req = self.http.request(method, format!("{API}{path}")).header("accept", "application/json");
        if !self.token.is_empty() {
            req = req.bearer_auth(&self.token);
        }
        if let Some(b) = body {
            req = req.json(&b);
        }
        let res = req.send().await?;
        if res.status().as_u16() == 429 {
            bail!("the test inbox service said too many requests; stopped");
        }
        if !res.status().is_success() {
            bail!("the test inbox service answered {}", res.status());
        }
        Ok(res.json().await.unwrap_or(Value::Null))
    }
}

fn strip(html: &str) -> String {
    let mut out = String::new();
    let mut inside = false;
    for ch in html.chars() {
        match ch {
            '<' => inside = true,
            '>' => { inside = false; out.push(' ') }
            c if !inside => out.push(c),
            _ => {}
        }
    }
    out
}

/// A 4 to 8 digit code standing on its own (not part of a year, a phone number or an address).
fn code_in(text: &str) -> Option<String> {
    text.split(|c: char| !c.is_ascii_alphanumeric())
        .find(|w| (4..=8).contains(&w.len()) && w.chars().all(|c| c.is_ascii_digit()) && !(w.len() == 4 && w.starts_with("20")))
        .map(String::from)
}

/// The first link that looks like it confirms the email.
fn link_in(text: &str) -> Option<String> {
    let links: Vec<&str> = text.split(|c: char| c.is_whitespace() || c == '"' || c == '\'' || c == '<' || c == '>')
        .filter(|w| w.starts_with("https://")).collect();
    let good = ["confirm", "verify", "activate", "validate", "token"];
    links.iter().find(|l| good.iter().any(|g| l.to_lowercase().contains(g))).map(|l| l.replace("&amp;", "&"))
}
