//! The automatic audit: grades a sign-up recording against the checked checklist
//! (.claude/docs/checklists/sign-up.md) from what was measured on each form screen.
//! Items it cannot judge from measurements are left "for Claude" (judged in a session, no AI cost
//! per recording); items on screens a robot check kept us from are "not reached".
use crate::store::Run;
use serde::{Deserialize, Serialize};
use serde_json::Value;

const CHECKLIST: &str = include_str!("../../.claude/docs/checklists/sign-up.md");
/// How tall a phone keyboard is, in points, on a 844-point-tall phone.
const KEYBOARD: i64 = 300;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct Grade {
    pub section: String,
    pub item: String,
    pub backing: String,
    /// pass | partly | fail | not-offered | not-reached | not-relevant | untested | for-claude
    pub result: String,
    pub why: String,
    /// "auto" (measured) or "claude" (judged in a session)
    #[serde(default)]
    pub by: String,
}

pub fn audit(run: &Run) -> Vec<Grade> {
    let blocked = run.notes.iter().any(|n| n.contains("robot check"));
    let mut out = vec![];
    let mut section = String::new();
    for line in CHECKLIST.lines() {
        if let Some(h) = line.strip_prefix("## ") {
            section = h.split_once(". ").map(|(_, t)| t).unwrap_or(h).to_string();
            continue;
        }
        let cols: Vec<&str> = line.split('|').map(str::trim).collect();
        if cols.len() < 5 || cols[1].is_empty() || cols[1] == "Item" || cols[1].starts_with("---") {
            continue;
        }
        let (item, backing, judged) = (cols[1], cols[2], cols[3]);
        let (result, why) = grade(run, item).unwrap_or_else(|| {
            let late = section.starts_with("Verification") || section.starts_with("After sign-up");
            if blocked && late && judged == "Seen" {
                ("not-reached", "A robot check stopped the recording before this screen.".into())
            } else if judged == "Person" {
                ("untested", "Needs a hands-on test this recording did not do.".into())
            } else {
                ("for-claude", String::new())
            }
        });
        out.push(Grade { section: section.clone(), item: item.into(), backing: backing.into(), result: result.into(), why, by: "auto".into() });
    }
    out
}

/// Puts Claude's own judgements (claude-audit.json in the recording's folder: [item start, result, why])
/// over the automatic grades. Claude judges from the recorded screens in a session, at no cost per recording.
pub fn with_claude(mut grades: Vec<Grade>, dir: &std::path::Path) -> Vec<Grade> {
    let file = std::fs::read_to_string(dir.join("claude-audit.json")).unwrap_or_default();
    let mine: Vec<(String, String, String)> = serde_json::from_str(&file).unwrap_or_default();
    for (start, result, why) in mine {
        if let Some(g) = grades.iter_mut().find(|g| g.item.starts_with(&start)) {
            (g.result, g.why, g.by) = (result, why, "claude".into());
        }
    }
    grades
}

fn grade(run: &Run, item: &str) -> Option<(&'static str, String)> {
    let forms = &run.forms;
    let first = forms.first()?;
    let all = |role: &str| forms.iter().flat_map(|f| f["fields"].as_array().cloned().unwrap_or_default()).filter(|x| x["role"] == role).collect::<Vec<_>>();
    let fields = first["fields"].as_array().cloned().unwrap_or_default();
    let typed: Vec<&Value> = fields.iter().filter(|f| f["role"] != "checkbox").collect();
    let s = |v: &Value, k: &str| v[k].as_str().unwrap_or_default().to_string();
    let submit = &first["submit"];
    let after = |m: &str| forms.iter().find(|f| f["moment"].as_str().is_some_and(|x| x.contains(m)));
    let starts = |p: &str| item.starts_with(p);
    let web = !run.start_url.is_empty();

    if starts("Email field brings") {
        let e = all("email");
        let e = e.first()?;
        return Some(if s(e, "type") == "email" || s(e, "inputmode") == "email" {
            ("pass", "The email field is marked as email, so phones show the email keyboard.".into())
        } else {
            ("fail", "The email field is a plain text field, so phones show the ordinary keyboard.".into())
        });
    }
    if starts("Password manager") {
        let mut miss = vec![];
        for e in all("email").iter().chain(all("username").iter()).take(1) {
            let ac = s(e, "autocomplete");
            if !(ac.contains("email") || ac.contains("username")) { miss.push("the email field has no \"username\" or \"email\" mark"); }
        }
        if let Some(p) = all("password").first() {
            if !s(p, "autocomplete").contains("new-password") { miss.push("the password field is not marked as a new password"); }
        }
        return Some(if miss.is_empty() { ("pass", "Fields are marked so password managers fill and save them.".into()) }
            else { ("fail", format!("Password managers get no help: {}.", miss.join("; "))) });
    }
    if starts("Auto-capitalise") {
        let e = all("email");
        let e = e.first()?;
        return Some(if s(e, "type") == "email" || s(e, "autocapitalize") == "none" || s(e, "autocapitalize") == "off" {
            ("pass", "The email field is an email type, which phones never capitalise.".into())
        } else {
            ("fail", "The email field may start with a capital letter on phones.".into())
        });
    }
    if starts("Labels stay visible") {
        let bare: Vec<String> = typed.iter().filter(|f| s(f, "label").is_empty()).map(|f| s(f, "placeholder")).collect();
        return Some(if bare.is_empty() { ("pass", "Every field has a label that stays on screen.".into()) }
            else { ("fail", format!("Only hint text inside the field (\"{}\"); it disappears as soon as you type.", bare.join("\", \""))) });
    }
    if starts("Only the fields needed") {
        let n = typed.len();
        return Some(if n <= 3 { ("pass", format!("{n} field(s) on the first screen."))} else { ("partly", format!("{n} fields on the first screen; each extra one costs sign-ups.")) });
    }
    if starts("No confirm-password") {
        let n = forms.iter().map(|f| f["fields"].as_array().map(|a| a.iter().filter(|x| x["role"] == "password").count()).unwrap_or(0)).max().unwrap_or(0);
        return match n { 0 => None, 1 => Some(("pass", "One password field, no confirm field.".into())), _ => Some(("fail", "Asks for the password twice.".into())) };
    }
    if starts("Each field checked when") {
        let f = after("wrong email")?;
        return Some(if errors(f).is_empty() { ("fail", "No error appeared after leaving the email field with a wrong address.".into()) }
            else { ("pass", "The error appeared once the person left the field.".into()) });
    }
    if starts("Error next to the field") {
        let f = after("wrong email").or_else(|| after("empty"))?;
        let e = errors(f);
        return Some(match e.first() { Some(t) => ("pass", format!("Says \"{t}\" under the field.")), None => ("fail", "No message explained what was wrong.".into()) });
    }
    if starts("Errors never erase") {
        let f = after("wrong email")?;
        let kept = f["fields"].as_array()?.iter().any(|x| x["role"] == "email" && x["filled"] == true);
        return Some(if kept { ("pass", "The wrong email stayed in the field to be fixed.".into()) } else { ("fail", "The field was emptied after the error.".into()) });
    }
    if starts("Errors read aloud") {
        let f = after("wrong email").or_else(|| after("empty"))?;
        let linked = f["fields"].as_array()?.iter().any(|x| x["invalid"] == true && !s(x, "described_by").is_empty());
        return Some(if linked { ("pass", "The error is linked to its field, so screen readers say it.".into()) }
            else { ("fail", "The error is not linked to its field, so a screen reader may not say it.".into()) });
    }
    if starts("Sign up with Apple") {
        let list: Vec<String> = first["social"].as_array()?.iter().filter_map(|x| x.as_str().map(String::from)).collect();
        return Some(if list.is_empty() { ("not-offered", "Only email.".into()) } else { ("pass", format!("Offers: {}.", list.join(", "))) });
    }
    if starts("If any third-party") || starts("Sign-up stays in the app") || starts("Tracking asked") {
        return web.then(|| ("not-relevant", "An iPhone app rule; this recording is a website.".into()));
    }
    if starts("Phone number sign-up") {
        return Some(if all("phone").is_empty() { ("not-offered", "No phone number option.".into()) } else { ("pass", "A phone number field is offered.".into()) });
    }
    if starts("Passkey sign-up") {
        first.get("passkey")?;
        return Some(if first["passkey"] == true { ("for-claude", String::new()) } else { ("not-offered", "No passkey option.".into()) });
    }
    if starts("Terms and privacy accepted") {
        first.get("terms")?;
        return Some(if first["terms"] == true { ("pass", "Says that continuing accepts the Terms and Privacy Policy, with links.".into()) } else { ("fail", "No terms or privacy shown before the account is made.".into()) });
    }
    if starts("Button says what it does") {
        let t = s(submit, "text");
        let ok = ["create", "sign up", "join", "register"].iter().any(|w| t.to_lowercase().contains(w));
        return Some(if ok { ("pass", format!("Says \"{t}\".")) } else { ("partly", format!("Says \"{t}\", which does not say an account will be made.")) });
    }
    if starts("Button stays above the keyboard") {
        let b = submit["bottom"].as_i64()?;
        return Some(if b >= KEYBOARD { ("pass", format!("The button sits {b} pt above the bottom, clear of a ~{KEYBOARD} pt keyboard.")) }
            else { ("fail", format!("The button sits {b} pt above the bottom; a phone keyboard is about {KEYBOARD} pt, so it is hidden while typing.")) });
    }
    if starts("A disabled button says why") {
        return Some(if submit["disabled"] == true { ("fail", "The button is disabled with no reason shown.".into()) }
            else { ("pass", "The button stays enabled and shows what is missing when pressed.".into()) });
    }
    if starts("Touch targets") {
        let min = typed.iter().map(|f| f["h"].as_i64().unwrap_or(0)).chain(submit["h"].as_i64()).min()?;
        return Some(match min { 44.. => ("pass", format!("Smallest field or button is {min} pt tall.")),
            24..=43 => ("partly", format!("Smallest is {min} pt: passes the 24 minimum, under the 44 recommended.")),
            _ => ("fail", format!("Smallest is {min} pt, under the 24 minimum.")) });
    }
    if starts("Every field has a name") {
        let bare = typed.iter().filter(|f| s(f, "label").is_empty() && s(f, "aria_label").is_empty()).count();
        return Some(if bare == 0 { ("pass", "Every field has a name for screen readers.".into()) } else { ("fail", format!("{bare} field(s) have no name for screen readers.")) });
    }
    if starts("Right-to-left") {
        return Some(if first["rtl"] == true { ("for-claude", String::new()) } else { ("not-relevant", "The page is in a left-to-right language.".into()) });
    }
    if starts("Already-have-an-account") {
        first.get("login_link")?;
        return Some(if first["login_link"] == true { ("pass", "A \"Sign in\" link sits under the form.".into()) } else { ("fail", "No link for people who already have an account.".into()) });
    }
    if starts("Main actions within thumb reach") {
        let b = submit["bottom"].as_i64()?;
        return Some(if b <= 844 * 55 / 100 { ("pass", "The main button is in the lower half, where a thumb reaches.".into()) } else { ("partly", "The main button is high up, a stretch for one thumb.".into()) });
    }
    if starts("Robot check only when needed") {
        return forms.iter().any(|f| f["challenge"] == true)
            .then(|| ("fail", "A picture robot check appeared on an ordinary first try.".into()));
    }
    None
}

fn errors(f: &Value) -> Vec<String> {
    f["errors"].as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).unwrap_or_default()
}
