//! agentscreen brain: records websites in a hidden Chrome and keeps every step in a library on disk.
pub mod recorder;
pub mod store;

pub use recorder::{explore, ExploreOptions};
pub use store::{Library, Run, RunSummary, Screen, Step};
