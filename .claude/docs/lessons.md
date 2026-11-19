# Lessons

| Date | What happened | Fix lives in |
|---|---|---|
| 2026-10-04 | A backend's monthly allowance was used up in a few days | `.claude/rules/service-limits.md` + `.claude/docs/services.md` |
| 2026-10-04 | A search printed a secret key | safety step (`.claude/hooks/guard.js`) |
| 2026-10-04 | A checker closed every Chrome window by name | safety step (`.claude/hooks/guard.js`) |
| 2026-10-04 | Instructions were lost across many compactions | memory step (`.claude/hooks/memory.js`) |
| 2026-10-04 | Saved words filled up with pasted reports | memory step strips pasted text |
| 2026-10-04 | "Where are we in v2" was answered with an offer to grill | the board (R-04) |
| 2026-10-04 | A helper stalled on a board permission | only the main session writes the board (R-23) |
| 2026-10-04 | A request on the board was missed | reminder at each message (memory step) |
| 2026-10-04 | Two helpers sat finished for 90 minutes unnoticed | helper watcher (R-40) |
| 2026-10-04 | Send on the board did not reach Claude | comments capability: Send wakes the session |
| 2026-10-04 | Work landed with no task moving | the task check (`.claude/hooks/board-check.js`) |
| 2026-11-19 | Clicks stopped reaching the page after the same hidden tab moved to another website | one hidden tab per website (`.claude/docs/idea.md`, first test) |
| 2026-11-19 | The first test was run in the lab folder while Salem watched the project folder, which looked empty | work in the project folder (now.md, "Salem said to remember") |
