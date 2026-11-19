//! Reading measured values: colours, contrast, sizes, moves and font weights.

/// "rgb(37, 99, 235)" or "rgba(0, 0, 0, 0.5)" -> (r, g, b, alpha)
pub(crate) fn rgba(c: &str) -> Option<(f64, f64, f64, f64)> {
    let inner = c.trim().strip_prefix("rgba(").or_else(|| c.trim().strip_prefix("rgb("))?.strip_suffix(')')?;
    let n: Vec<f64> = inner.split([',', ' ', '/']).filter(|s| !s.is_empty()).filter_map(|s| s.parse().ok()).collect();
    match n.len() {
        3 => Some((n[0], n[1], n[2], 1.0)),
        4 => Some((n[0], n[1], n[2], n[3])),
        _ => None,
    }
}

pub(crate) fn hex(c: &str) -> String {
    match rgba(c) {
        Some((_, _, _, a)) if a == 0.0 => "transparent".into(),
        Some((r, g, b, a)) if a < 1.0 => format!("#{:02x}{:02x}{:02x} at {}%", r as u8, g as u8, b as u8, (a * 100.0).round()),
        Some((r, g, b, _)) => format!("#{:02x}{:02x}{:02x}", r as u8, g as u8, b as u8),
        None => c.to_string(),
    }
}

pub(crate) fn luminance(c: &str) -> Option<f64> {
    let (r, g, b, _) = rgba(c)?;
    let f = |v: f64| {
        let v = v / 255.0;
        if v <= 0.03928 { v / 12.92 } else { ((v + 0.055) / 1.055).powf(2.4) }
    };
    Some(0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b))
}

pub(crate) fn contrast(a: &str, b: &str) -> Option<f64> {
    let (la, lb) = (luminance(a)?, luminance(b)?);
    let (hi, lo) = if la > lb { (la, lb) } else { (lb, la) };
    Some((hi + 0.05) / (lo + 0.05))
}

pub(crate) fn px(v: &str) -> f64 {
    v.trim_end_matches("px").parse().unwrap_or(0.0)
}

/// "matrix(1.05, 0, 0, 1.05, 0, -2)" -> (scale, move x, move y)
pub(crate) fn transform(v: &str) -> Option<(f64, f64, f64)> {
    let inner = v.strip_prefix("matrix(")?.strip_suffix(')')?;
    let n: Vec<f64> = inner.split(',').filter_map(|s| s.trim().parse().ok()).collect();
    (n.len() == 6).then(|| ((n[0] * n[0] + n[1] * n[1]).sqrt(), n[4], n[5]))
}

pub(crate) fn weight(w: &str) -> &'static str {
    match w.parse::<u32>().unwrap_or(400) {
        0..=350 => "light",
        351..=450 => "regular",
        451..=550 => "medium",
        551..=650 => "semi-bold",
        _ => "bold",
    }
}
