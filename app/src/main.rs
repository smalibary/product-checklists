//! agentscreen app: `record <url>` records a website; `serve` opens the library page in the browser.
use agentscreen_core::{explore, ExploreOptions, Library};
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::Deserialize;
use std::sync::Arc;
use tower_http::services::{ServeDir, ServeFile};

#[derive(Clone)]
struct AppState {
    lib: Arc<Library>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let lib_root = std::env::var("AGENTSCREEN_LIBRARY").unwrap_or_else(|_| "library".into());
    let lib = Library::open(lib_root)?;
    match args.first().map(String::as_str) {
        Some("record") => {
            let url = args.get(1).ok_or_else(|| anyhow::anyhow!("usage: agentscreen record <url> [steps]"))?;
            let max_steps = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(12);
            let run = explore(&lib, ExploreOptions { url: url.clone(), max_steps }, None).await?;
            println!("{} {}: {} steps, {} screens{}", run.status, run.id, run.steps.len(), run.screens.len(),
                run.error.map(|e| format!(" ({e})")).unwrap_or_default());
            for s in &run.steps {
                println!("  {:>2}. [{}] {}", s.n, s.outcome, s.explanation);
            }
        }
        Some("serve") | None => {
            let port: u16 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(4477);
            serve(lib, port).await?;
        }
        Some(other) => anyhow::bail!("unknown command {other}; use: record <url> [steps] | serve [port]"),
    }
    Ok(())
}

async fn serve(lib: Library, port: u16) -> anyhow::Result<()> {
    let files = ServeDir::new(lib.root.join("runs"));
    let web = std::env::var("AGENTSCREEN_WEB").unwrap_or_else(|_| "web/dist".into());
    let site = ServeDir::new(&web).fallback(ServeFile::new(format!("{web}/index.html")));
    let state = AppState { lib: Arc::new(lib) };
    let app = Router::new()
        .route("/api/runs", get(list_runs))
        .route("/api/runs/{id}", get(get_run))
        .route("/api/record", post(start_record))
        .nest_service("/files", files)
        .fallback_service(site)
        .with_state(state);
    let addr = format!("127.0.0.1:{port}");
    println!("library page: http://{addr}");
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}

async fn list_runs(State(s): State<AppState>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let runs = s.lib.list().map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    Ok(Json(serde_json::to_value(runs).unwrap()))
}

async fn get_run(State(s): State<AppState>, Path(id): Path<String>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let run = s.lib.load(&id).map_err(|e| (StatusCode::NOT_FOUND, e.to_string()))?;
    Ok(Json(serde_json::to_value(run).unwrap()))
}

#[derive(Deserialize)]
struct RecordReq {
    url: String,
    steps: Option<usize>,
}

async fn start_record(State(s): State<AppState>, Json(req): Json<RecordReq>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let parsed = url_ok(&req.url).ok_or((StatusCode::BAD_REQUEST, "that is not a web address".into()))?;
    let host = parsed.replace('.', "-");
    let id = format!("{}-{}", chrono_now(), host);
    let lib = s.lib.clone();
    let rid = id.clone();
    let opts = ExploreOptions { url: req.url, max_steps: req.steps.unwrap_or(12).min(60) };
    tokio::spawn(async move {
        if let Err(e) = explore(&lib, opts, Some(rid)).await {
            eprintln!("recording failed: {e}");
        }
    });
    Ok(Json(serde_json::json!({ "id": id })))
}

fn url_ok(u: &str) -> Option<String> {
    let rest = u.strip_prefix("https://").or_else(|| u.strip_prefix("http://"))?;
    let host = rest.split(['/', '?', '#']).next()?.to_string();
    (!host.is_empty()).then_some(host)
}

fn chrono_now() -> String {
    chrono::Local::now().format("%Y%m%d-%H%M%S").to_string()
}
