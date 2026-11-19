//! Reading and using a form during a sign-up recording: what fields it has, doing one step with a
//! reason, typing into a field by what it is for, and keeping the form's measurements for the audit.
use crate::step::{Act, Ctx, Led};
use crate::store::Control;
use crate::tab::Tab;
use anyhow::Result;
use serde::Deserialize;

const FIELDS: &str = include_str!("fields.js");

#[derive(Deserialize, Default)]
pub struct Form {
    #[serde(default)]
    pub fields: Vec<Field>,
    pub submit: Option<Submit>,
    #[serde(default)]
    pub challenge: bool,
}
#[derive(Deserialize)]
pub struct Field {
    pub index: usize,
    pub role: String,
    #[serde(default)]
    pub filled: bool,
    #[serde(default)]
    pub checked: bool,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub aria_label: String,
}
#[derive(Deserialize)]
pub struct Submit {
    pub index: usize,
    pub disabled: bool,
}

impl Form {
    pub fn has(&self, roles: &[&str]) -> bool {
        self.fields.iter().any(|f| roles.contains(&f.role.as_str()))
    }
}

/// Lists the controls and reads the form, from the same marking of the page.
pub async fn look(tab: &Tab, origin: &str) -> (Vec<Control>, Form, serde_json::Value) {
    let list = tab.controls(origin).await;
    let raw: String = tab.page.evaluate(FIELDS).await.ok().and_then(|v| v.into_value().ok()).unwrap_or_default();
    let value: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
    let form = serde_json::from_value(value.clone()).unwrap_or_default();
    (list, form, value)
}

/// Keeps what the form looks like at this moment, for the audit.
pub async fn keep(cx: &mut Ctx<'_>, tab: &Tab, moment: &str) {
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
pub async fn act(cx: &mut Ctx<'_>, tab: &mut Tab, c: &Control, a: Act<'_>, why: &str) -> Result<Led> {
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
pub async fn type_into(cx: &mut Ctx<'_>, tab: &mut Tab, role: &str, value: &str, why: &str) -> Result<bool> {
    let (list, form, _) = look(tab, cx.origin).await;
    let Some(c) = form.fields.iter().find(|f| f.role == role).and_then(|f| by_index(&list, f.index)) else { return Ok(false) };
    act(cx, tab, &c, Act::Type(value), why).await?;
    act(cx, tab, &c, Act::Key("Tab"), "Leaving the field, so its check runs").await?;
    Ok(true)
}

/// Presses the form's send button, if there is one that can be pressed.
pub async fn send(cx: &mut Ctx<'_>, tab: &mut Tab, why: &str) -> Result<Option<Led>> {
    let (list, form, _) = look(tab, cx.origin).await;
    let Some(c) = form.submit.as_ref().filter(|s| !s.disabled).and_then(|s| by_index(&list, s.index)) else { return Ok(None) };
    Ok(Some(act(cx, tab, &c, Act::Click, why).await?))
}

pub fn by_index(list: &[Control], i: usize) -> Option<Control> {
    list.iter().find(|c| c.index == i).cloned()
}

pub fn note(cx: &mut Ctx<'_>, text: &str) -> Result<()> {
    cx.run.notes.push(text.into());
    cx.lib.save(cx.run)?;
    Ok(())
}
