//! agentscreen brain: records websites in a hidden Chrome and keeps every step in a library on disk.
pub mod components;
pub mod describe;
pub mod recorder;
pub mod store;

pub use recorder::{explore, ExploreOptions};
pub use store::{ComponentCard, Library, Run, RunSummary, Screen, Step};
