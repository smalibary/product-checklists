//! agentscreen brain: records websites in a hidden Chrome and keeps every step in a library on disk.
pub mod components;
pub mod describe;
pub mod livecopy;
pub mod recorder;
pub mod step;
pub mod store;
pub mod tab;
pub mod values;

pub use recorder::{explore, ExploreOptions};
pub use store::{ComponentCard, Library, Run, RunSummary, Screen, Step};
