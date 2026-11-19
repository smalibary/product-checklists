# Git and worktrees (the Termi way)

Needed in every session, so this file has no `paths:` and always loads.

| ID | Grade | Rule | Why | Since |
|---|---|---|---|---|
| R-10 | SHOULD | `main` is the base branch and stays clean. Do feature work on a branch. | `main` is always a working state. | 2026-10-04 |
| R-11 | SHOULD | Create a new branch with Termi's worktree create action, based on `main`. Don't use `git worktree add` or Claude's own worktree tools. | Termi puts it in the project's worktree home and shows it in the sidebar. | 2026-10-04 |
| R-12 | SHOULD | Termi can't merge or remove worktrees. Merge into `main` with plain git from the main checkout, then `git worktree remove` and delete the branch. | Fills Termi's gap without a second tool. | 2026-10-04 |
| R-13 | SHOULD | Long or watchable work goes to helpers opened with Termi's session open action (agent + brief); see R-22 for when a hidden helper is fine. Wait with Termi's wait. Helpers end with session finish. | Salem can watch helpers; hidden subagents he can't see. | 2026-10-04 |
| R-16 | SHOULD | A builder working on a branch saves (commits) its own work there once checked; the main session merges into `main`. No separate "saver" role. | In bimvit, the saver role caused the biggest group of mistakes (10 lessons). | 2026-10-04 |
| R-14 | SHOULD | Check what Salem sees with `termi agent state --json` instead of asking him. | Saves him a question. | 2026-10-04 |
| R-15 | SHOULD | `.termi/` (helper briefs and worktrees) stays git-ignored. | Local, temporary state. | 2026-10-04 |
